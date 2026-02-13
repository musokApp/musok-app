'use client';

import {
  BookingWithCustomer,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
} from '@/types/booking.types';
import { Calendar, Tag, CreditCard } from 'lucide-react';

interface ShamanBookingCardProps {
  booking: BookingWithCustomer;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function formatCreatedAt(isoStr: string): string {
  const date = new Date(isoStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function ShamanBookingCard({
  booking,
  onApprove,
  onReject,
  onComplete,
}: ShamanBookingCardProps) {
  const { customer } = booking;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      {/* Status + Date */}
      <div className="flex items-center justify-between">
        <span
          className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${BOOKING_STATUS_COLORS[booking.status]}`}
        >
          {BOOKING_STATUS_LABELS[booking.status]}
        </span>
        <span className="text-xs text-gray-400">{formatCreatedAt(booking.createdAt)}</span>
      </div>

      {/* Customer Info */}
      {customer && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
            {customer.fullName[0]}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">{customer.fullName}</h3>
            <p className="text-xs text-gray-500">{customer.phone || customer.email}</p>
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">상담일시</span>
          </div>
          <span className="font-medium text-gray-900">
            {formatDate(booking.date)} {booking.timeSlot}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">상담유형</span>
          </div>
          <span className="font-medium text-gray-900">{booking.consultationType}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">상담료</span>
          </div>
          <span className="font-bold text-gray-900">{booking.totalPrice.toLocaleString()}원</span>
        </div>
      </div>

      {/* Customer Notes */}
      {booking.notes && (
        <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-800">
          <span className="font-medium">고객 요청사항: </span>
          {booking.notes}
        </div>
      )}

      {/* Pending Actions */}
      {booking.status === 'pending' && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onApprove(booking.id)}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors"
          >
            승인
          </button>
          <button
            onClick={() => onReject(booking.id)}
            className="flex-1 py-2.5 text-sm font-semibold text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            거절
          </button>
        </div>
      )}

      {/* Complete Action */}
      {booking.status === 'confirmed' && (
        <button
          onClick={() => onComplete(booking.id)}
          className="w-full py-2.5 text-sm font-semibold text-green-700 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
        >
          상담 완료 처리
        </button>
      )}

      {/* Rejection Reason */}
      {booking.status === 'rejected' && booking.rejectionReason && (
        <div className="bg-red-50 rounded-xl p-3 text-sm text-red-600">
          <span className="font-medium">거절 사유: </span>
          {booking.rejectionReason}
        </div>
      )}
    </div>
  );
}
