export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  shamanId: string;
  rating: number;
  content: string;
  replyContent: string | null;
  replyCreatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewWithCustomer extends Review {
  customer: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

export interface CreateReviewData {
  bookingId: string;
  shamanId: string;
  rating: number;
  content: string;
}

export interface UpdateReviewData {
  rating?: number;
  content?: string;
}
