'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MyPageLayout } from '@/components/layout/MyPageLayout';
import { BarChart } from 'lucide-react';

export default function ShamanRevenuePage() {
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
      <h1 className="text-2xl font-bold text-gray-900 mb-1">수익 현황</h1>
      <p className="text-sm text-gray-500 mb-6">수익 내역을 확인하세요</p>

      <div className="text-center py-20">
        <BarChart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-gray-900 mb-2">수익 데이터 없음</h2>
        <p className="text-sm text-gray-500">
          상담 완료 후 수익 내역이 여기에 표시됩니다
        </p>
      </div>
    </MyPageLayout>
  );
}
