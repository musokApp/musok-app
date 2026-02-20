'use client';

import { Phone, Plus, Check, X, CheckCircle, Clock } from 'lucide-react';
import {
  BookingWithCustomer,
  BookingStatus,
  ALL_TIME_SLOTS,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
  TimeSlot,
  getOccupiedSlots,
  getDurationLabel,
} from '@/types/booking.types';

interface DayBookingListProps {
  date: string;
  bookings: BookingWithCustomer[];
  availableSlots: { time: string; available: boolean }[];
  onStatusChange: (bookingId: string, status: BookingStatus) => void;
  onAddManual: (timeSlot: TimeSlot) => void;
  updatingId?: string | null;
}

export default function DayBookingList({
  date,
  bookings,
  availableSlots,
  onStatusChange,
  onAddManual,
  updatingId,
}: DayBookingListProps) {
  const availMap = new Map(availableSlots.map((s) => [s.time, s.available]));

  // Build slot → booking map considering duration
  // slotOwner: maps each slot to the booking that owns it
  // slotRole: 'start' = first slot of booking, 'continuation' = covered by multi-slot booking
  const slotOwner = new Map<string, BookingWithCustomer>();
  const slotRole = new Map<string, 'start' | 'continuation'>();

  for (const booking of bookings) {
    const dur = booking.duration || 1;
    const occupied = getOccupiedSlots(booking.timeSlot, dur);
    occupied.forEach((s, i) => {
      slotOwner.set(s, booking);
      slotRole.set(s, i === 0 ? 'start' : 'continuation');
    });
  }

  const formattedDate = (() => {
    const [, m, d] = date.split('-');
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][new Date(date).getDay()];
    return `${Number(m)}월 ${Number(d)}일 (${dayOfWeek})`;
  })();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="text-sm font-bold text-gray-900 mb-3">{formattedDate} 예약 현황</h3>

      <div className="space-y-2">
        {ALL_TIME_SLOTS.map((slot) => {
          const booking = slotOwner.get(slot);
          const role = slotRole.get(slot);
          const isAvailable = availMap.get(slot) ?? false;

          // Continuation of a multi-slot booking
          if (booking && role === 'continuation') {
            return (
              <div
                key={slot}
                className="flex items-center gap-3 px-3 py-2 rounded-xl bg-indigo-50/40 border-l-4 border-indigo-200"
              >
                <span className="text-sm font-medium text-indigo-300 w-12">{slot}</span>
                <span className="text-xs text-indigo-400">
                  ↑ {booking.manualCustomerName || booking.customer?.fullName || '고객'} 계속
                </span>
              </div>
            );
          }

          // Start of a booking (single or multi-slot)
          if (booking && role === 'start') {
            return (
              <BookingSlotCard
                key={slot}
                slot={slot}
                booking={booking}
                onStatusChange={onStatusChange}
                isUpdating={updatingId === booking.id}
              />
            );
          }

          // Empty slot - manual booking button
          return (
            <button
              key={slot}
              onClick={() => onAddManual(slot)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border-2 border-dashed transition-colors group ${
                isAvailable
                  ? 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30'
                  : 'border-gray-100 bg-gray-50/50 hover:border-indigo-200 hover:bg-indigo-50/20'
              }`}
            >
              <span className={`text-sm font-medium w-12 ${isAvailable ? 'text-gray-400' : 'text-gray-300'}`}>{slot}</span>
              <div className="flex items-center gap-1.5 text-gray-400 group-hover:text-indigo-500 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm">수동 예약 추가</span>
              </div>
              {!isAvailable && (
                <span className="ml-auto text-[10px] text-gray-300">근무시간 외</span>
              )}
            </button>
          );
        })}
      </div>

      {bookings.length === 0 && (
        <p className="text-center text-sm text-gray-400 mt-3">예약이 없습니다</p>
      )}
    </div>
  );
}

function BookingSlotCard({
  slot,
  booking,
  onStatusChange,
  isUpdating,
}: {
  slot: TimeSlot;
  booking: BookingWithCustomer;
  onStatusChange: (id: string, status: BookingStatus) => void;
  isUpdating: boolean;
}) {
  const isManual = booking.source === 'manual';
  const customerName = isManual
    ? booking.manualCustomerName || '고객'
    : booking.customer?.fullName || '고객';
  const customerPhone = isManual
    ? booking.manualCustomerPhone
    : booking.customer?.phone;
  const dur = booking.duration || 1;
  const isMultiSlot = dur > 1;

  return (
    <div className={`border rounded-xl p-3 ${isMultiSlot ? 'border-indigo-200 bg-indigo-50/20' : 'border-gray-100'}`}>
      <div className="flex items-start gap-3">
        {/* Time */}
        <div className="w-12 pt-0.5 flex-shrink-0">
          <span className="text-sm font-semibold text-gray-900">{slot}</span>
          {isMultiSlot && (
            <div className="flex items-center gap-0.5 mt-0.5">
              <Clock className="w-3 h-3 text-indigo-400" />
              <span className="text-[10px] text-indigo-500 font-medium">{getDurationLabel(dur)}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900 truncate">{customerName}</span>
            {isManual && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-medium">
                <Phone className="w-2.5 h-2.5" />
                전화
              </span>
            )}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium ${BOOKING_STATUS_COLORS[booking.status]}`}>
              {BOOKING_STATUS_LABELS[booking.status]}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{booking.consultationType}</span>
            {booking.partySize > 1 && (
              <>
                <span className="text-gray-300">|</span>
                <span>{booking.partySize}명</span>
              </>
            )}
            {customerPhone && (
              <>
                <span className="text-gray-300">|</span>
                <span>{customerPhone}</span>
              </>
            )}
            {booking.totalPrice > 0 && (
              <>
                <span className="text-gray-300">|</span>
                <span>₩{booking.totalPrice.toLocaleString()}</span>
              </>
            )}
          </div>

          {booking.notes && (
            <p className="text-xs text-gray-400 mt-1 truncate">{booking.notes}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {(booking.status === 'pending' || booking.status === 'confirmed') && (
        <div className="flex gap-2 mt-2 ml-[60px]">
          {booking.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusChange(booking.id, 'confirmed')}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                승인
              </button>
              <button
                onClick={() => onStatusChange(booking.id, 'rejected')}
                disabled={isUpdating}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <X className="w-3 h-3" />
                거절
              </button>
            </>
          )}
          {booking.status === 'confirmed' && (
            <button
              onClick={() => onStatusChange(booking.id, 'completed')}
              disabled={isUpdating}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              <CheckCircle className="w-3 h-3" />
              상담 완료
            </button>
          )}
        </div>
      )}
    </div>
  );
}
