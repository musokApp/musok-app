import {
  BookingWithShaman,
  BookingWithCustomer,
  BookingStatus,
  CreateBookingData,
  UpdateBookingStatusData,
} from '@/types/booking.types';

export async function getMyBookings(status?: BookingStatus): Promise<BookingWithShaman[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);

  const response = await fetch(`/api/bookings?${params.toString()}`);
  if (!response.ok) {
    throw new Error('예약 목록을 불러오는데 실패했습니다');
  }
  const data = await response.json();
  return data.bookings;
}

export async function getShamanBookings(status?: BookingStatus): Promise<BookingWithCustomer[]> {
  const params = new URLSearchParams();
  if (status) params.append('status', status);

  const response = await fetch(`/api/bookings?${params.toString()}`);
  if (!response.ok) {
    throw new Error('예약 목록을 불러오는데 실패했습니다');
  }
  const data = await response.json();
  return data.bookings;
}

export async function getBookingById(id: string): Promise<BookingWithShaman> {
  const response = await fetch(`/api/bookings/${id}`);
  if (!response.ok) {
    throw new Error('예약 정보를 불러오는데 실패했습니다');
  }
  const data = await response.json();
  return data.booking;
}

export async function createBooking(data: CreateBookingData): Promise<BookingWithShaman> {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '예약 생성에 실패했습니다');
  }
  const result = await response.json();
  return result.booking;
}

export async function updateBookingStatus(
  id: string,
  data: UpdateBookingStatusData
): Promise<BookingWithShaman> {
  const response = await fetch(`/api/bookings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '예약 상태 변경에 실패했습니다');
  }
  const result = await response.json();
  return result.booking;
}

export async function getAvailableSlots(
  shamanId: string,
  date: string
): Promise<{ time: string; available: boolean }[]> {
  const params = new URLSearchParams({ shamanId, date });
  const response = await fetch(`/api/bookings/available-slots?${params.toString()}`);
  if (!response.ok) {
    throw new Error('예약 가능 시간을 불러오는데 실패했습니다');
  }
  const data = await response.json();
  return data.slots;
}
