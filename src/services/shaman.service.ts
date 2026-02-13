import { ShamanProfile, ShamanWithUser, ShamanFilters } from '@/types/shaman.types';

export async function getShamans(filters?: ShamanFilters): Promise<ShamanProfile[]> {
  const params = new URLSearchParams();

  if (filters?.region) params.append('region', filters.region);
  if (filters?.district) params.append('district', filters.district);
  if (filters?.specialties && filters.specialties.length > 0) {
    params.append('specialties', filters.specialties.join(','));
  }
  if (filters?.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString());
  if (filters?.minRating !== undefined) params.append('minRating', filters.minRating.toString());
  if (filters?.searchQuery) params.append('search', filters.searchQuery);

  const response = await fetch(`/api/shamans?${params.toString()}`);
  if (!response.ok) {
    throw new Error('무속인 목록을 불러오는데 실패했습니다');
  }

  const data = await response.json();
  return data.shamans;
}

export async function getShamanById(id: string): Promise<ShamanWithUser> {
  const response = await fetch(`/api/shamans/${id}`);
  if (!response.ok) {
    throw new Error('무속인 정보를 불러오는데 실패했습니다');
  }

  const data = await response.json();
  return data.shaman;
}
