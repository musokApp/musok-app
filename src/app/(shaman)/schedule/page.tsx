'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MyPageLayout } from '@/components/layout/MyPageLayout';
import { Clock } from 'lucide-react';

export default function ShamanSchedulePage() {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">일정 관리</h1>
      <p className="text-sm text-gray-500 mb-6">상담 가능 시간을 설정하세요</p>

      <div className="text-center py-20">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-900 mb-2">일정 관리 준비 중</h2>
        <p className="text-sm text-gray-500">
          곧 상담 가능 시간 설정 기능이 추가됩니다
        </p>
      </div>
    </MyPageLayout>
  );
}
