import { Specialty } from './shaman.types';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: '예약 요청',
  confirmed: '예약 확정',
  completed: '상담 완료',
  cancelled: '취소됨',
  rejected: '거절됨',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
  rejected: 'bg-red-100 text-red-700',
};

export type BookingSource = 'online' | 'manual';

export const BOOKING_SOURCE_LABELS: Record<BookingSource, string> = {
  online: '온라인 예약',
  manual: '전화 예약',
};

export type TimeSlot =
  | '09:00'
  | '10:00'
  | '11:00'
  | '12:00'
  | '13:00'
  | '14:00'
  | '15:00'
  | '16:00'
  | '17:00'
  | '18:00'
  | '19:00'
  | '20:00'
  | '21:00'
  | '22:00'
  | '23:00';

export const ALL_TIME_SLOTS: TimeSlot[] = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

export interface Booking {
  id: string;
  customerId: string | null;
  shamanId: string;
  date: string;
  timeSlot: TimeSlot;
  duration: number;
  partySize: number;
  consultationType: Specialty;
  notes: string;
  totalPrice: number;
  status: BookingStatus;
  rejectionReason?: string;
  source: BookingSource;
  manualCustomerName?: string;
  manualCustomerPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingWithShaman extends Booking {
  shaman: {
    id: string;
    businessName: string;
    region: string;
    district: string;
    basePrice: number;
    averageRating: number;
    images: string[];
    specialties: Specialty[];
  };
}

export interface BookingWithCustomer extends Booking {
  customer: {
    id: string;
    fullName: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface BookingFilters {
  status?: BookingStatus;
  shamanId?: string;
  customerId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CreateBookingData {
  shamanId: string;
  date: string;
  timeSlot: TimeSlot;
  partySize?: number;
  consultationType: Specialty;
  notes: string;
}

export interface UpdateBookingStatusData {
  status: BookingStatus;
  rejectionReason?: string;
}

export interface CreateManualBookingData {
  date: string;
  timeSlot: TimeSlot;
  duration?: number;
  consultationType: Specialty;
  customerName: string;
  customerPhone?: string;
  notes?: string;
  totalPrice?: number;
}

// 인원수 옵션 (고객 예약용: 1명당 1시간)
export const PARTY_SIZE_OPTIONS = [
  { value: 1, label: '1명' },
  { value: 2, label: '2명' },
  { value: 3, label: '3명' },
  { value: 4, label: '4명' },
] as const;

// Duration 헬퍼 (무속인 수동 예약용)
export const DURATION_OPTIONS = [
  { value: 1, label: '1시간' },
  { value: 2, label: '2시간' },
  { value: 3, label: '3시간' },
  { value: 4, label: '4시간' },
  { value: 0, label: '종일' },
] as const;

export function getOccupiedSlots(startSlot: TimeSlot, duration: number): TimeSlot[] {
  const startIdx = ALL_TIME_SLOTS.indexOf(startSlot);
  if (startIdx === -1) return [];
  const d = duration === 0 ? ALL_TIME_SLOTS.length : duration;
  return ALL_TIME_SLOTS.slice(startIdx, startIdx + d);
}

export function getDurationLabel(duration: number): string {
  if (duration === 0 || duration >= ALL_TIME_SLOTS.length) return '종일';
  return `${duration}시간`;
}

export interface CalendarDayData {
  date: string;
  totalCount: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  cancelledCount: number;
  isOffDay: boolean;
}

export interface DashboardSummary {
  todayBookings: number;
  pendingTotal: number;
  thisWeekBookings: number;
  thisMonthRevenue: number;
}
