export type ShamanStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type Specialty = '굿' | '점술' | '사주' | '타로' | '궁합' | '작명' | '풍수' | '해몽';

export interface ShamanProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  specialties: Specialty[];
  yearsExperience: number;

  // 위치
  region: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;

  // 요금
  basePrice: number;

  // 상태
  status: ShamanStatus;

  // 통계
  totalBookings: number;
  averageRating: number;

  // 이미지
  images: string[];

  createdAt: string;
}

export interface ShamanWithUser extends ShamanProfile {
  user: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    avatarUrl: string;
  };
}

export interface ShamanFilters {
  region?: string;
  district?: string;
  specialties?: Specialty[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  searchQuery?: string;
}
