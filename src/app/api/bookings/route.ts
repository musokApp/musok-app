import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import {
  getFilteredBookings,
  createBooking,
  getBookedTimeSlots,
} from '@/lib/data/bookings-data';
import { findShamanById, findShamanByUserId } from '@/lib/data/shamans-data';
import { findUserById } from '@/lib/auth/users-data';
import { BookingFilters, BookingStatus, CreateBookingData, getOccupiedSlots } from '@/types/booking.types';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status') as BookingStatus | null;

  if (user.role === 'customer') {
    const filters: BookingFilters = { customerId: user.userId };
    if (statusFilter) filters.status = statusFilter;

    const bookings = await getFilteredBookings(filters);

    const bookingsWithShaman = await Promise.all(
      bookings.map(async (booking) => {
        const shaman = await findShamanById(booking.shamanId);
        return {
          ...booking,
          shaman: shaman
            ? {
                id: shaman.id,
                businessName: shaman.businessName,
                region: shaman.region,
                district: shaman.district,
                basePrice: shaman.basePrice,
                averageRating: shaman.averageRating,
                images: shaman.images,
                specialties: shaman.specialties,
              }
            : null,
        };
      })
    );

    return NextResponse.json({ bookings: bookingsWithShaman, total: bookingsWithShaman.length });
  }

  if (user.role === 'shaman') {
    const shaman = await findShamanByUserId(user.userId);
    if (!shaman) {
      return NextResponse.json({ error: '무속인 프로필을 찾을 수 없습니다' }, { status: 404 });
    }

    const filters: BookingFilters = { shamanId: shaman.id };
    if (statusFilter) filters.status = statusFilter;

    const bookings = await getFilteredBookings(filters);

    const bookingsWithCustomer = await Promise.all(
      bookings.map(async (booking) => {
        let customer = null;
        if (booking.customerId) {
          const customerRow = await findUserById(booking.customerId);
          if (customerRow) {
            customer = {
              id: customerRow.id,
              fullName: customerRow.full_name,
              email: customerRow.email,
              phone: customerRow.phone,
            };
          }
        }
        return { ...booking, customer };
      })
    );

    return NextResponse.json({ bookings: bookingsWithCustomer, total: bookingsWithCustomer.length });
  }

  return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user || user.role !== 'customer') {
    return NextResponse.json({ error: '고객 계정만 예약할 수 있습니다' }, { status: 403 });
  }

  const body: CreateBookingData = await request.json();

  const shaman = await findShamanById(body.shamanId);
  if (!shaman || shaman.status !== 'approved') {
    return NextResponse.json({ error: '예약할 수 없는 무속인입니다' }, { status: 400 });
  }

  const today = new Date().toISOString().split('T')[0];
  if (body.date < today) {
    return NextResponse.json({ error: '과거 날짜는 예약할 수 없습니다' }, { status: 400 });
  }

  const partySize = body.partySize || 1;
  const duration = partySize; // 1명당 1시간
  const occupiedSlots = getOccupiedSlots(body.timeSlot, duration);
  const bookedSlots = await getBookedTimeSlots(body.shamanId, body.date);
  const hasConflict = occupiedSlots.some((s) => bookedSlots.includes(s));
  if (hasConflict) {
    return NextResponse.json({ error: '이미 예약된 시간대가 포함되어 있습니다' }, { status: 400 });
  }

  const booking = await createBooking({
    customerId: user.userId,
    shamanId: body.shamanId,
    date: body.date,
    timeSlot: body.timeSlot,
    duration,
    partySize,
    consultationType: body.consultationType,
    notes: body.notes || '',
    totalPrice: shaman.basePrice,
    status: 'pending',
    source: 'online',
  });

  return NextResponse.json({ booking }, { status: 201 });
}
