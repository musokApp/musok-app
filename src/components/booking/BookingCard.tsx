'use client';

import Link from 'next/link';
import {
  BookingWithShaman,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_COLORS,
} from '@/types/booking.types';
import { Calendar, Tag, CreditCard } from 'lucide-react';

interface BookingCardProps {
  booking: BookingWithShaman;
  onCancel: (id: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

function formatCreatedAt(isoStr: string): string {
  const date = new Date(isoStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function BookingCard({ booking, onCancel }: BookingCardProps) {
  const { shaman } = booking;

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

      {/* Shaman Info */}
      {shaman && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {shaman.images.length > 0 ? (
              <img
                src={shaman.images[0]}
                alt={shaman.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg">🔮</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm truncate">{shaman.businessName}</h3>
            <p className="text-xs text-gray-500">
              {shaman.region} {shaman.district}
            </p>
          </div>
        </div>
      )}

      {/* Booking Details */}
      <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700">
            {formatDate(booking.date)} {booking.timeSlot}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-700">{booking.consultationType}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="font-semibold text-gray-900">
            {booking.totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {(booking.status === 'pending' || booking.status === 'confirmed') && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onCancel(booking.id)}
            className="flex-1 py-2.5 text-sm font-medium text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            예약 취소
          </button>
          {shaman && (
            <Link
              href={`/shamans/${shaman.id}`}
              className="flex-1 py-2.5 text-sm font-medium text-center text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors"
            >
              상세 보기
            </Link>
          )}
        </div>
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
