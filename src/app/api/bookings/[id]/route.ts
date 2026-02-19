import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { findBookingById, updateBookingStatus } from '@/lib/data/bookings-data';
import { findShamanById, findShamanByUserId } from '@/lib/data/shamans-data';
import { DUMMY_USERS } from '@/lib/auth/users-data';
import { UpdateBookingStatusData } from '@/types/booking.types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const booking = findBookingById(id);
  if (!booking) {
    return NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 });
  }

  if (user.role === 'customer' && booking.customerId !== user.userId) {
    return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 });
  }

  if (user.role === 'shaman') {
    const shaman = findShamanByUserId(user.userId);
    if (!shaman || shaman.id !== booking.shamanId) {
      return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 });
    }
  }

  const shaman = findShamanById(booking.shamanId);
  const customer = DUMMY_USERS.find((u) => u.id === booking.customerId);

  return NextResponse.json({
    booking: {
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
      customer: customer
        ? {
            id: customer.id,
            fullName: customer.fullName,
            email: customer.email,
            phone: customer.phone,
          }
        : null,
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const booking = findBookingById(id);
  if (!booking) {
    return NextResponse.json({ error: '예약을 찾을 수 없습니다' }, { status: 404 });
  }

  const body: UpdateBookingStatusData = await request.json();

  if (user.role === 'customer') {
    if (booking.customerId !== user.userId) {
      return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 });
    }
    if (body.status !== 'cancelled') {
      return NextResponse.json({ error: '고객은 취소만 가능합니다' }, { status: 400 });
    }
    if (booking.status !== 'pending' && booking.status !== 'confirmed') {
      return NextResponse.json({ error: '취소할 수 없는 상태입니다' }, { status: 400 });
    }
  }

  if (user.role === 'shaman') {
    const shaman = findShamanByUserId(user.userId);
    if (!shaman || shaman.id !== booking.shamanId) {
      return NextResponse.json({ error: '접근 권한이 없습니다' }, { status: 403 });
    }

    if (booking.status === 'pending') {
      if (body.status !== 'confirmed' && body.status !== 'rejected') {
        return NextResponse.json({ error: '대기 중인 예약은 승인 또는 거절만 가능합니다' }, { status: 400 });
      }
    } else if (booking.status === 'confirmed') {
      if (body.status !== 'completed') {
        return NextResponse.json({ error: '확정된 예약은 완료 처리만 가능합니다' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: '상태를 변경할 수 없는 예약입니다' }, { status: 400 });
    }
  }

  const updated = updateBookingStatus(id, body.status, body.rejectionReason);
  if (!updated) {
    return NextResponse.json({ error: '예약 상태 변경에 실패했습니다' }, { status: 500 });
  }

  return NextResponse.json({ booking: updated });
}
