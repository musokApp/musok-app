'use client';

import { useState } from 'react';
import { X, Phone, Loader2 } from 'lucide-react';
import { Specialty } from '@/types/shaman.types';
import {
  CreateManualBookingData,
  TimeSlot,
  DURATION_OPTIONS,
  ALL_TIME_SLOTS,
  getOccupiedSlots,
} from '@/types/booking.types';

const CONSULTATION_TYPES: Specialty[] = ['굿', '점술', '사주', '타로', '궁합', '작명', '풍수', '해몽'];

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  timeSlot: TimeSlot;
  onSubmit: (data: CreateManualBookingData) => Promise<void>;
}

export default function ManualBookingModal({
  isOpen,
  onClose,
  date,
  timeSlot,
  onSubmit,
}: ManualBookingModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [consultationType, setConsultationType] = useState<Specialty>('사주');
  const [duration, setDuration] = useState(1);
  const [notes, setNotes] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const formattedDate = (() => {
    const [, m, d] = date.split('-');
    const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][new Date(date).getDay()];
    return `${Number(m)}월 ${Number(d)}일 (${dayOfWeek})`;
  })();

  // 종일이면 시작시간을 09:00으로 표시
  const isFullDay = duration === 0;
  const displayTimeSlot = isFullDay ? '종일 (09:00~17:00)' : timeSlot;

  // 선택한 duration에 따라 점유되는 시간대 미리보기
  const startSlot = isFullDay ? ALL_TIME_SLOTS[0] : timeSlot;
  const occupiedSlots = getOccupiedSlots(startSlot, isFullDay ? ALL_TIME_SLOTS.length : duration);

  // 시작 시간대에서 선택 가능한 최대 duration 계산
  const startIdx = ALL_TIME_SLOTS.indexOf(timeSlot);
  const maxFromStart = ALL_TIME_SLOTS.length - startIdx;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim()) {
      setError('고객명을 입력해주세요');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        date,
        timeSlot: isFullDay ? ALL_TIME_SLOTS[0] : timeSlot,
        duration,
        consultationType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        notes: notes.trim() || undefined,
        totalPrice: totalPrice ? Number(totalPrice) : undefined,
      });
      // Reset form
      setCustomerName('');
      setCustomerPhone('');
      setConsultationType('사주');
      setDuration(1);
      setNotes('');
      setTotalPrice('');
      onClose();
    } catch (err: any) {
      setError(err.message || '예약 등록에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        {/* Handle bar (mobile) */}
        <div className="sm:hidden flex justify-center pt-3">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
              <Phone className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">수동 예약 등록</h3>
              <p className="text-xs text-gray-500">{formattedDate} {displayTimeSlot}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 pt-2 space-y-4">
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-50 text-sm text-red-600">{error}</div>
          )}

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              고객명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="고객 이름"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              autoFocus
            />
          </div>

          {/* Customer Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="010-0000-0000"
              className="w-full h-11 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              소요 시간 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((opt) => {
                // 종일이 아닌 경우, 시작 시간에서 가능한 최대 시간 초과하면 비활성화
                const disabled = opt.value !== 0 && opt.value > maxFromStart;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => !disabled && setDuration(opt.value)}
                    disabled={disabled}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      duration === opt.value
                        ? 'bg-indigo-500 text-white'
                        : disabled
                          ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {/* 점유 슬롯 미리보기 */}
            {occupiedSlots.length > 1 && (
              <p className="text-xs text-gray-400 mt-1.5">
                {occupiedSlots[0]} ~ {occupiedSlots[occupiedSlots.length - 1]} ({occupiedSlots.length}시간)
              </p>
            )}
          </div>

          {/* Consultation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              상담 유형 <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CONSULTATION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setConsultationType(type)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    consultationType === type
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Total Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">상담료</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₩</span>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="0"
                className="w-full h-11 pl-8 pr-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">메모</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="예약 관련 메모"
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !customerName.trim()}
            className="w-full h-12 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                등록 중...
              </>
            ) : (
              '예약 등록'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
