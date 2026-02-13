'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getShamanById } from '@/services/shaman.service';
import { createBooking, getAvailableSlots } from '@/services/booking.service';
import { ShamanWithUser } from '@/types/shaman.types';
import { Specialty } from '@/types/shaman.types';
import { TimeSlot } from '@/types/booking.types';
import CalendarPicker from '@/components/booking/CalendarPicker';
import { ChevronLeft, Star, MapPin, Loader2 } from 'lucide-react';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const shamanId = params.shamanId as string;

  const [shaman, setShaman] = useState<ShamanWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedType, setSelectedType] = useState<Specialty | null>(null);
  const [notes, setNotes] = useState('');

  const [slots, setSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    fetchShaman();
  }, [shamanId]);

  useEffect(() => {
    if (selectedDate && shamanId) {
      fetchSlots(shamanId, selectedDate);
      setSelectedTimeSlot(null);
    }
  }, [selectedDate, shamanId]);

  const fetchShaman = async () => {
    try {
      setLoading(true);
      const data = await getShamanById(shamanId);
      setShaman(data);
      if (data.specialties.length === 1) {
        setSelectedType(data.specialties[0]);
      }
    } catch (error) {
      console.error('Failed to fetch shaman:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async (sid: string, date: string) => {
    try {
      setSlotsLoading(true);
      const data = await getAvailableSlots(sid, date);
      setSlots(data);
    } catch (error) {
      console.error('Failed to fetch slots:', error);
    } finally {
      setSlotsLoading(false);
    }
  };

  const isFormValid = selectedDate && selectedTimeSlot && selectedType && isAuthenticated;

  const handleSubmit = async () => {
    if (!isFormValid || !selectedDate || !selectedTimeSlot || !selectedType) return;

    try {
      setSubmitting(true);
      await createBooking({
        shamanId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        consultationType: selectedType,
        notes,
      });
      alert('예약이 신청되었습니다! 무속인의 확인을 기다려주세요.');
      router.push('/my-bookings');
    } catch (error: any) {
      alert(error.message || '예약에 실패했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-100 rounded-full animate-pulse" />
          <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="container mx-auto max-w-2xl px-4 py-6 space-y-6">
          <div className="h-16 bg-gray-50 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
          <div className="h-20 bg-gray-50 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!shaman) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl mb-2">😔</div>
        <h2 className="text-xl font-bold text-gray-900">무속인을 찾을 수 없습니다</h2>
        <button
          onClick={() => router.push('/shamans')}
          className="mt-4 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl mb-2">🔒</div>
        <h2 className="text-xl font-bold text-gray-900">로그인이 필요합니다</h2>
        <p className="text-sm text-gray-500">예약하려면 먼저 로그인해주세요</p>
        <button
          onClick={() => router.push('/login')}
          className="mt-4 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          로그인하기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-8">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">예약하기</h1>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-6 space-y-8">
        {/* Shaman Info Card */}
        <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
            {shaman.images.length > 0 ? (
              <img
                src={shaman.images[0]}
                alt={shaman.businessName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🔮</div>
            )}
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{shaman.businessName}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-700">
                  {shaman.averageRating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {shaman.region} {shaman.district}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">날짜 선택</h2>
          <div className="bg-gray-50 rounded-2xl p-4">
            <CalendarPicker selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          </div>
        </div>

        {/* Time Slot Selection */}
        {selectedDate && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">시간 선택</h2>
            {slotsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedTimeSlot(slot.time as TimeSlot)}
                    disabled={!slot.available}
                    className={`
                      py-3 rounded-xl text-sm font-medium transition-all
                      ${selectedTimeSlot === slot.time
                        ? 'bg-primary text-white'
                        : slot.available
                          ? 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-primary hover:text-primary'
                          : 'bg-gray-50 text-gray-300 line-through cursor-not-allowed'
                      }
                    `}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Consultation Type */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">상담 유형</h2>
          <div className="flex flex-wrap gap-2">
            {shaman.specialties.map((specialty) => (
              <button
                key={specialty}
                onClick={() => setSelectedType(specialty)}
                className={`
                  px-4 py-2.5 rounded-full text-sm font-medium border transition-all
                  ${selectedType === specialty
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                  }
                `}
              >
                {specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            요청사항 <span className="text-gray-400 font-normal text-sm">(선택)</span>
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="상담받고 싶은 내용이나 요청사항을 적어주세요"
            className="w-full min-h-[120px] p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
          />
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">기본 상담료</span>
            <span className="font-medium text-gray-900">
              {shaman.basePrice.toLocaleString()}원
            </span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900">총 결제 금액</span>
            <span className="text-xl font-bold text-primary">
              {shaman.basePrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* Desktop Submit */}
        <div className="hidden lg:block">
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || submitting}
            className="w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {submitting ? '예약 중...' : '예약 신청하기'}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-40"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || submitting}
          className="w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {submitting ? '예약 중...' : '예약 신청하기'}
        </button>
      </div>
    </div>
  );
}
