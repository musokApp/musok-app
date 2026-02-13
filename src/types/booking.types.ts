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

export type TimeSlot =
  | '09:00'
  | '10:00'
  | '11:00'
  | '13:00'
  | '14:00'
  | '15:00'
  | '16:00'
  | '17:00';

export const ALL_TIME_SLOTS: TimeSlot[] = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

export interface Booking {
  id: string;
  customerId: string;
  shamanId: string;
  date: string;
  timeSlot: TimeSlot;
  consultationType: Specialty;
  notes: string;
  totalPrice: number;
  status: BookingStatus;
  rejectionReason?: string;
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
  };
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
  consultationType: Specialty;
  notes: string;
}

export interface UpdateBookingStatusData {
  status: BookingStatus;
  rejectionReason?: string;
}
