'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getShamanById } from '@/services/shaman.service';
import { ShamanWithUser } from '@/types/shaman.types';
import {
  MapPin, Star, Briefcase, Phone, Mail, ChevronLeft,
  Clock, Shield, Share2, Heart, MessageCircle, Calendar
} from 'lucide-react';
import Link from 'next/link';

export default function ShamanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [shaman, setShaman] = useState<ShamanWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchShaman(params.id as string);
    }
  }, [params.id]);

  const fetchShaman = async (id: string) => {
    try {
      setLoading(true);
      const data = await getShamanById(id);
      setShaman(data);
    } catch (error) {
      console.error('Failed to fetch shaman:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Skeleton */}
        <div className="h-72 md:h-96 bg-gray-100 animate-pulse" />
        <div className="container mx-auto px-4 py-6 space-y-4">
          <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-5 w-32 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-20 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!shaman) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-4">
        <div className="text-6xl mb-2">😔</div>
        <h2 className="text-xl font-bold text-gray-900">무속인을 찾을 수 없습니다</h2>
        <p className="text-sm text-gray-500">삭제되었거나 존재하지 않는 페이지입니다</p>
        <button
          onClick={() => router.push('/shamans')}
          className="mt-4 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      {/* Image Gallery */}
      <div className="relative">
        {/* Floating nav buttons */}
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
              <Share2 className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Images */}
        {shaman.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1 md:h-[420px]">
            <div className="md:col-span-2 md:row-span-2 h-72 md:h-full overflow-hidden">
              <img
                src={shaman.images[0]}
                alt={shaman.businessName}
                className="w-full h-full object-cover"
              />
            </div>
            {shaman.images.slice(1, 5).map((image, i) => (
              <div key={i} className="hidden md:block overflow-hidden">
                <img
                  src={image}
                  alt={`${shaman.businessName} ${i + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {shaman.images.length <= 1 && (
              <>
                <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50">
                  <span className="text-4xl">🔮</span>
                </div>
                <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-50 to-violet-50">
                  <span className="text-4xl">✨</span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="h-72 md:h-96 bg-gradient-to-br from-violet-50 to-indigo-50 flex items-center justify-center">
            <span className="text-7xl">🔮</span>
          </div>
        )}

        {/* Image count badge */}
        {shaman.images.length > 1 && (
          <button className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-700 shadow-sm md:hidden">
            1 / {shaman.images.length}
          </button>
        )}
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-6">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  경력 {shaman.yearsExperience}년
                </span>
                {shaman.averageRating >= 4.5 && (
                  <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                    TOP 무속인
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {shaman.businessName}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-gray-900">{shaman.averageRating.toFixed(1)}</span>
                  <span>({shaman.totalBookings})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{shaman.region} {shaman.district}</span>
                </div>
              </div>
            </div>

            {/* Specialties */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">전문분야</h2>
              <div className="flex flex-wrap gap-2">
                {shaman.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">소개</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {shaman.description}
              </p>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                <Shield className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium text-gray-700 text-center">신원 검증 완료</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                <Clock className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium text-gray-700 text-center">빠른 응답</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl">
                <Calendar className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium text-gray-700 text-center">당일 예약 가능</span>
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Location */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">위치</h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{shaman.address}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{shaman.region} {shaman.district}</p>
                </div>
              </div>
              <div className="h-48 bg-gray-100 rounded-2xl flex items-center justify-center text-sm text-gray-400">
                지도 (추후 카카오맵 연동 예정)
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Contact */}
            {shaman.user && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">연락처</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-700">{shaman.user.email}</span>
                  </div>
                  {shaman.user.phone && (
                    <div className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-700">{shaman.user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="h-px bg-gray-100" />

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">후기</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-gray-900">{shaman.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">({shaman.totalBookings})</span>
                </div>
              </div>
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-400">후기 기능은 추후 추가될 예정입니다</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Booking Card (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-bold text-gray-900">
                      {shaman.basePrice.toLocaleString()}
                    </span>
                    <span className="text-base text-gray-500">원~</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">기본 상담료 기준</p>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">평점</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-gray-900">{shaman.averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">경력</span>
                    <span className="font-semibold text-gray-900">{shaman.yearsExperience}년</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">총 예약</span>
                    <span className="font-semibold text-gray-900">{shaman.totalBookings}건</span>
                  </div>
                </div>

                <div className="h-px bg-gray-100" />

                {/* CTA Buttons */}
                <Link
                  href={`/booking/${shaman.id}`}
                  className="block w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-xl text-center hover:bg-primary/90 transition-colors"
                >
                  예약하기
                </Link>

                <button className="w-full py-3 bg-gray-50 text-gray-700 text-sm font-semibold rounded-xl text-center hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  문의하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 lg:hidden z-40" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900">
                {shaman.basePrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">원~</span>
            </div>
          </div>
          <button className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </button>
          <Link
            href={`/booking/${shaman.id}`}
            className="px-8 py-3 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            예약하기
          </Link>
        </div>
      </div>
    </div>
  );
}
