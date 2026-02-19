'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MyPageLayout } from '@/components/layout/MyPageLayout';
import ReviewCard from '@/components/reviews/ReviewCard';
import StarRating from '@/components/reviews/StarRating';
import { ReviewWithCustomer } from '@/types/review.types';
import { replyToReview, updateReply, deleteReply } from '@/services/review.service';
import { FileText } from 'lucide-react';

export default function ShamanReviewsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [reviews, setReviews] = useState<ReviewWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'shaman')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.role === 'shaman') {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const meRes = await fetch('/api/shamans/me');
      if (!meRes.ok) return;
      const meData = await meRes.json();
      const shamanId = meData.shaman?.id;
      if (!shamanId) return;

      const res = await fetch(`/api/reviews?shamanId=${shamanId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId: string, content: string) => {
    const updated = await replyToReview(reviewId, content);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, replyContent: updated.replyContent, replyCreatedAt: updated.replyCreatedAt }
          : r
      )
    );
  };

  const handleEditReply = async (reviewId: string, content: string) => {
    const updated = await updateReply(reviewId, content);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, replyContent: updated.replyContent, replyCreatedAt: updated.replyCreatedAt }
          : r
      )
    );
  };

  const handleDeleteReply = async (reviewId: string) => {
    await deleteReply(reviewId);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, replyContent: null, replyCreatedAt: null }
          : r
      )
    );
  };

  if (isLoading || !user) return null;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <MyPageLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">후기 관리</h1>
      <p className="text-sm text-gray-500 mb-6">고객 후기를 확인하고 답글을 남겨보세요</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded-full" />
                <div className="h-4 w-20 bg-gray-100 rounded" />
              </div>
              <div className="h-3 w-24 bg-gray-100 rounded" />
              <div className="h-12 bg-gray-50 rounded-xl" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">후기가 없습니다</h2>
          <p className="text-sm text-gray-500">
            상담 완료 후 고객이 남긴 후기가 여기에 표시됩니다
          </p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {averageRating.toFixed(1)}
                </div>
                <StarRating rating={Math.round(averageRating)} size={14} />
              </div>
              <div className="h-12 w-px bg-gray-200" />
              <div className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{reviews.length}</span>개의 후기
              </div>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isShamanView
                onReply={handleReply}
                onEditReply={handleEditReply}
                onDeleteReply={handleDeleteReply}
              />
            ))}
          </div>
        </>
      )}
    </MyPageLayout>
  );
}
