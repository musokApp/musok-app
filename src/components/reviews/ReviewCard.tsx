'use client';

import { useState } from 'react';
import { ReviewWithCustomer } from '@/types/review.types';
import StarRating from './StarRating';
import { User, MessageSquareReply, Pencil, Trash2, Send, X } from 'lucide-react';

interface ReviewCardProps {
  review: ReviewWithCustomer;
  /** 무속인 모드: 답글 작성/수정/삭제 가능 */
  isShamanView?: boolean;
  onReply?: (reviewId: string, content: string) => Promise<void>;
  onEditReply?: (reviewId: string, content: string) => Promise<void>;
  onDeleteReply?: (reviewId: string) => Promise<void>;
}

function formatDate(isoStr: string): string {
  const date = new Date(isoStr);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function ReviewCard({
  review,
  isShamanView = false,
  onReply,
  onEditReply,
  onDeleteReply,
}: ReviewCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      if (isEditing && onEditReply) {
        await onEditReply(review.id, replyText.trim());
      } else if (onReply) {
        await onReply(review.id, replyText.trim());
      }
      setReplyText('');
      setShowReplyForm(false);
      setIsEditing(false);
    } catch (error: any) {
      alert(error.message || '답글 처리에 실패했습니다');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = () => {
    setReplyText(review.replyContent || '');
    setIsEditing(true);
    setShowReplyForm(true);
  };

  const handleDeleteReply = async () => {
    if (!confirm('답글을 삭제하시겠습니까?') || !onDeleteReply) return;
    try {
      await onDeleteReply(review.id);
    } catch (error: any) {
      alert(error.message || '답글 삭제에 실패했습니다');
    }
  };

  const handleCancel = () => {
    setShowReplyForm(false);
    setIsEditing(false);
    setReplyText('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      {/* Header: Customer + Rating */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {review.customer.avatarUrl ? (
              <img
                src={review.customer.avatarUrl}
                alt={review.customer.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={14} className="text-gray-400" />
            )}
          </div>
          <span className="font-medium text-sm text-gray-900">
            {review.customer.fullName}
          </span>
        </div>
        <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
      </div>

      {/* Rating */}
      <StarRating rating={review.rating} size={14} />

      {/* Content */}
      {review.content && (
        <p className="text-sm text-gray-700 leading-relaxed">{review.content}</p>
      )}

      {/* Reply Display */}
      {review.replyContent && (
        <div className="ml-4 pl-4 border-l-2 border-primary/20 bg-primary/5 rounded-r-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MessageSquareReply size={13} className="text-primary" />
              <span className="text-xs font-semibold text-primary">무속인 답글</span>
            </div>
            <div className="flex items-center gap-2">
              {review.replyCreatedAt && (
                <span className="text-xs text-gray-400">
                  {formatDate(review.replyCreatedAt)}
                </span>
              )}
              {isShamanView && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleEditClick}
                    className="p-1 text-gray-400 hover:text-primary transition-colors"
                    title="수정"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={handleDeleteReply}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="삭제"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{review.replyContent}</p>
        </div>
      )}

      {/* Reply Button (shaman only, no existing reply) */}
      {isShamanView && !review.replyContent && !showReplyForm && (
        <button
          onClick={() => { setShowReplyForm(true); setIsEditing(false); setReplyText(''); }}
          className="flex items-center gap-1.5 text-xs text-primary font-medium hover:text-primary/80 transition-colors pt-1"
        >
          <MessageSquareReply size={14} />
          답글 달기
        </button>
      )}

      {/* Reply Form */}
      {showReplyForm && (
        <div className="ml-4 pl-4 border-l-2 border-primary/20 space-y-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="답글을 입력하세요..."
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
            rows={3}
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{replyText.length}/500</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={14} className="inline mr-0.5" />
                취소
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || submitting}
                className="px-4 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <Send size={12} />
                {submitting ? '처리중...' : isEditing ? '수정' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
