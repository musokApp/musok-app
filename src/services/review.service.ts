import {
  Review,
  ReviewWithCustomer,
  CreateReviewData,
  UpdateReviewData,
} from '@/types/review.types';

export async function getReviewsByShamanId(shamanId: string): Promise<ReviewWithCustomer[]> {
  const response = await fetch(`/api/reviews?shamanId=${shamanId}`);
  if (!response.ok) {
    throw new Error('리뷰를 불러오는데 실패했습니다');
  }
  const data = await response.json();
  return data.reviews;
}

export async function createReview(data: CreateReviewData): Promise<Review> {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '리뷰 작성에 실패했습니다');
  }
  const result = await response.json();
  return result.review;
}

export async function updateReview(id: string, data: UpdateReviewData): Promise<Review> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '리뷰 수정에 실패했습니다');
  }
  const result = await response.json();
  return result.review;
}

export async function deleteReview(id: string): Promise<void> {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '리뷰 삭제에 실패했습니다');
  }
}

export async function replyToReview(reviewId: string, content: string): Promise<Review> {
  const response = await fetch(`/api/reviews/${reviewId}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '답글 작성에 실패했습니다');
  }
  const result = await response.json();
  return result.review;
}

export async function updateReply(reviewId: string, content: string): Promise<Review> {
  const response = await fetch(`/api/reviews/${reviewId}/reply`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '답글 수정에 실패했습니다');
  }
  const result = await response.json();
  return result.review;
}

export async function deleteReply(reviewId: string): Promise<void> {
  const response = await fetch(`/api/reviews/${reviewId}/reply`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '답글 삭제에 실패했습니다');
  }
}
