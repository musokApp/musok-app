'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MyPageLayout } from '@/components/layout/MyPageLayout';
import { Calendar, Users, Star, TrendingUp } from 'lucide-react';

export default function ShamanDashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'shaman')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <MyPageLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">대시보드</h1>
      <p className="text-sm text-gray-500 mb-6">오늘의 현황을 확인하세요</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-xs text-gray-500">오늘 예약</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-500">대기 중</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-gray-500">평균 평점</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">-</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-500">이번 달 수익</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">₩0</p>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          대시보드 데이터는 데이터베이스 연동 후 실시간으로 업데이트됩니다.
        </p>
      </div>
    </MyPageLayout>
  );
}
