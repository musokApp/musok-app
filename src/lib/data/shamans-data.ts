import { ShamanProfile } from '@/types/shaman.types';

export const DUMMY_SHAMANS: ShamanProfile[] = [
  {
    id: 'shaman-1',
    userId: '2', // shaman@test.com
    businessName: '명가점술원',
    description: '30년 경력의 사주, 점술 전문가입니다. 정확한 운세 풀이와 진심 어린 상담으로 많은 분들께 도움을 드리고 있습니다.',
    specialties: ['점술', '사주', '궁합'],
    yearsExperience: 30,
    region: '서울특별시',
    district: '강남구',
    address: '서울특별시 강남구 테헤란로 123',
    latitude: 37.5065,
    longitude: 127.0548,
    basePrice: 50000,
    status: 'approved',
    totalBookings: 156,
    averageRating: 4.8,
    images: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    ],
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'shaman-2',
    userId: 'user-shaman-2',
    businessName: '한결굿당',
    description: '전통 굿과 해몽 풀이를 전문으로 하는 무속인입니다. 조상님들의 뜻을 받들어 정성스럽게 굿을 모시고 있습니다.',
    specialties: ['굿', '해몽', '풍수'],
    yearsExperience: 25,
    region: '서울특별시',
    district: '종로구',
    address: '서울특별시 종로구 인사동길 45',
    latitude: 37.5709,
    longitude: 126.9857,
    basePrice: 80000,
    status: 'approved',
    totalBookings: 89,
    averageRating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
    ],
    createdAt: '2024-02-20T10:30:00Z',
  },
  {
    id: 'shaman-3',
    userId: 'user-shaman-3',
    businessName: '별빛타로',
    description: '타로와 궁합 전문 상담사입니다. 연애, 결혼, 인간관계 고민을 함께 나누고 해결책을 찾아드립니다.',
    specialties: ['타로', '궁합'],
    yearsExperience: 15,
    region: '부산광역시',
    district: '해운대구',
    address: '부산광역시 해운대구 해운대로 567',
    latitude: 35.1631,
    longitude: 129.1635,
    basePrice: 40000,
    status: 'approved',
    totalBookings: 234,
    averageRating: 4.7,
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
    ],
    createdAt: '2024-03-10T14:00:00Z',
  },
  {
    id: 'shaman-4',
    userId: 'user-shaman-4',
    businessName: '대길작명소',
    description: '작명과 풍수 전문가입니다. 아기 이름, 개명, 상호명을 지어드리며, 집과 사무실의 좋은 기운을 찾아드립니다.',
    specialties: ['작명', '풍수', '사주'],
    yearsExperience: 40,
    region: '대구광역시',
    district: '중구',
    address: '대구광역시 중구 동성로 89',
    latitude: 35.8686,
    longitude: 128.5933,
    basePrice: 60000,
    status: 'approved',
    totalBookings: 67,
    averageRating: 4.6,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    ],
    createdAt: '2024-01-05T08:00:00Z',
  },
  {
    id: 'shaman-5',
    userId: 'user-shaman-5',
    businessName: '인천사주카페',
    description: '사주와 궁합을 보는 역술인입니다. 카페 같은 편안한 분위기에서 상담을 진행합니다. 젊은 분들도 편하게 방문하세요.',
    specialties: ['사주', '궁합', '타로'],
    yearsExperience: 10,
    region: '인천광역시',
    district: '남동구',
    address: '인천광역시 남동구 논현로 234',
    latitude: 37.4470,
    longitude: 126.7314,
    basePrice: 35000,
    status: 'approved',
    totalBookings: 178,
    averageRating: 4.5,
    images: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
    ],
    createdAt: '2024-04-01T11:00:00Z',
  },
  {
    id: 'shaman-6',
    userId: 'user-shaman-6',
    businessName: '서울점술원',
    description: '신규 등록 무속인입니다. 승인 대기 중입니다.',
    specialties: ['점술', '해몽'],
    yearsExperience: 5,
    region: '서울특별시',
    district: '마포구',
    address: '서울특별시 마포구 홍대입구역 근처',
    latitude: 37.5564,
    longitude: 126.9236,
    basePrice: 30000,
    status: 'pending',
    totalBookings: 0,
    averageRating: 0,
    images: [],
    createdAt: new Date().toISOString(),
  },
];

// 무속인 ID로 찾기
export function findShamanById(id: string): ShamanProfile | undefined {
  return DUMMY_SHAMANS.find((shaman) => shaman.id === id);
}

// 사용자 ID로 무속인 프로필 찾기
export function findShamanByUserId(userId: string): ShamanProfile | undefined {
  return DUMMY_SHAMANS.find((shaman) => shaman.userId === userId);
}

// 승인된 무속인만 가져오기
export function getApprovedShamans(): ShamanProfile[] {
  return DUMMY_SHAMANS.filter((shaman) => shaman.status === 'approved');
}

// 승인 대기 중인 무속인 가져오기
export function getPendingShamans(): ShamanProfile[] {
  return DUMMY_SHAMANS.filter((shaman) => shaman.status === 'pending');
}

// 필터링된 무속인 가져오기
export function getFilteredShamans(filters: {
  region?: string;
  district?: string;
  specialties?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  searchQuery?: string;
}): ShamanProfile[] {
  let shamans = getApprovedShamans();

  if (filters.region) {
    shamans = shamans.filter((s) => s.region === filters.region);
  }

  if (filters.district) {
    shamans = shamans.filter((s) => s.district === filters.district);
  }

  if (filters.specialties && filters.specialties.length > 0) {
    shamans = shamans.filter((s) =>
      filters.specialties!.some((specialty) => s.specialties.includes(specialty as any))
    );
  }

  if (filters.minPrice !== undefined) {
    shamans = shamans.filter((s) => s.basePrice >= filters.minPrice!);
  }

  if (filters.maxPrice !== undefined) {
    shamans = shamans.filter((s) => s.basePrice <= filters.maxPrice!);
  }

  if (filters.minRating !== undefined) {
    shamans = shamans.filter((s) => s.averageRating >= filters.minRating!);
  }

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    shamans = shamans.filter(
      (s) =>
        s.businessName.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.region.toLowerCase().includes(query) ||
        s.district.toLowerCase().includes(query)
    );
  }

  return shamans;
}
