import { Booking, BookingFilters, BookingStatus } from '@/types/booking.types';

export const DUMMY_BOOKINGS: Booking[] = [
  {
    id: 'booking-1',
    customerId: '1',
    shamanId: 'shaman-1',
    date: '2025-02-15',
    timeSlot: '10:00',
    consultationType: '사주',
    notes: '2025년 신년 운세를 보고 싶습니다.',
    totalPrice: 50000,
    status: 'confirmed',
    createdAt: '2025-02-10T09:00:00Z',
    updatedAt: '2025-02-10T12:00:00Z',
  },
  {
    id: 'booking-2',
    customerId: '1',
    shamanId: 'shaman-3',
    date: '2025-02-18',
    timeSlot: '14:00',
    consultationType: '타로',
    notes: '연애운을 봐주세요.',
    totalPrice: 40000,
    status: 'pending',
    createdAt: '2025-02-12T15:00:00Z',
    updatedAt: '2025-02-12T15:00:00Z',
  },
  {
    id: 'booking-3',
    customerId: '1',
    shamanId: 'shaman-2',
    date: '2025-01-20',
    timeSlot: '11:00',
    consultationType: '굿',
    notes: '가족 건강을 위한 굿을 부탁드립니다.',
    totalPrice: 80000,
    status: 'completed',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-20T16:00:00Z',
  },
  {
    id: 'booking-4',
    customerId: '1',
    shamanId: 'shaman-4',
    date: '2025-02-20',
    timeSlot: '15:00',
    consultationType: '작명',
    notes: '곧 태어날 아기 이름을 지어주세요.',
    totalPrice: 60000,
    status: 'cancelled',
    createdAt: '2025-02-08T11:00:00Z',
    updatedAt: '2025-02-09T09:00:00Z',
  },
  {
    id: 'booking-5',
    customerId: '1',
    shamanId: 'shaman-5',
    date: '2025-02-22',
    timeSlot: '13:00',
    consultationType: '궁합',
    notes: '결혼을 앞두고 궁합을 확인하고 싶습니다.',
    totalPrice: 35000,
    status: 'rejected',
    rejectionReason: '해당 날짜는 개인 사정으로 상담이 어렵습니다.',
    createdAt: '2025-02-11T08:00:00Z',
    updatedAt: '2025-02-11T14:00:00Z',
  },
  {
    id: 'booking-6',
    customerId: '4',
    shamanId: 'shaman-1',
    date: '2025-02-16',
    timeSlot: '14:00',
    consultationType: '궁합',
    notes: '궁합 상담 부탁드립니다.',
    totalPrice: 50000,
    status: 'pending',
    createdAt: '2025-02-13T10:00:00Z',
    updatedAt: '2025-02-13T10:00:00Z',
  },
];

// 런타임 변경을 위한 mutable 배열 (서버 재시작 시 초기화됨)
let bookings = [...DUMMY_BOOKINGS];

export function findBookingById(id: string): Booking | undefined {
  return bookings.find((b) => b.id === id);
}

export function getBookingsByCustomerId(customerId: string): Booking[] {
  return bookings.filter((b) => b.customerId === customerId);
}

export function getBookingsByShamanId(shamanId: string): Booking[] {
  return bookings.filter((b) => b.shamanId === shamanId);
}

export function getFilteredBookings(filters: BookingFilters): Booking[] {
  let result = [...bookings];

  if (filters.status) {
    result = result.filter((b) => b.status === filters.status);
  }
  if (filters.shamanId) {
    result = result.filter((b) => b.shamanId === filters.shamanId);
  }
  if (filters.customerId) {
    result = result.filter((b) => b.customerId === filters.customerId);
  }
  if (filters.dateFrom) {
    result = result.filter((b) => b.date >= filters.dateFrom!);
  }
  if (filters.dateTo) {
    result = result.filter((b) => b.date <= filters.dateTo!);
  }

  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return result;
}

export function createBooking(
  data: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>
): Booking {
  const newBooking: Booking = {
    ...data,
    id: `booking-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  return newBooking;
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  rejectionReason?: string
): Booking | null {
  const index = bookings.findIndex((b) => b.id === id);
  if (index === -1) return null;

  bookings[index] = {
    ...bookings[index],
    status,
    ...(rejectionReason ? { rejectionReason } : {}),
    updatedAt: new Date().toISOString(),
  };

  return bookings[index];
}

export function getBookedTimeSlots(shamanId: string, date: string): string[] {
  return bookings
    .filter(
      (b) =>
        b.shamanId === shamanId &&
        b.date === date &&
        (b.status === 'pending' || b.status === 'confirmed')
    )
    .map((b) => b.timeSlot);
}
