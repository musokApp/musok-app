import { ShamanProfile } from '@/types/shaman.types';
import { createClient } from '@/lib/supabase/server';
import { mapShamanRow } from '@/lib/supabase/mappers';

// 무속인 ID로 찾기
export async function findShamanById(id: string): Promise<ShamanProfile | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shamans')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return undefined;
  return mapShamanRow(data);
}

// 사용자 ID로 무속인 프로필 찾기
export async function findShamanByUserId(userId: string): Promise<ShamanProfile | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shamans')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return undefined;
  return mapShamanRow(data);
}

// 승인된 무속인만 가져오기
export async function getApprovedShamans(): Promise<ShamanProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shamans')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapShamanRow);
}

// 승인 대기 중인 무속인 가져오기
export async function getPendingShamans(): Promise<ShamanProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('shamans')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapShamanRow);
}

// 무속인 상태 업데이트 (승인/거절)
export async function updateShamanStatus(
  id: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string
): Promise<ShamanProfile | undefined> {
  const supabase = createClient();
  const updateData: Record<string, unknown> = { status };
  if (rejectionReason) updateData.rejection_reason = rejectionReason;

  const { data, error } = await supabase
    .from('shamans')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return undefined;
  return mapShamanRow(data);
}

// 무속인 프로필 업데이트
export async function updateShamanProfile(
  id: string,
  updates: {
    businessName?: string;
    description?: string;
    specialties?: string[];
    yearsExperience?: number;
    region?: string;
    district?: string;
    address?: string;
    basePrice?: number;
    images?: string[];
  }
): Promise<ShamanProfile | undefined> {
  const supabase = createClient();
  const updateData: Record<string, unknown> = {};
  if (updates.businessName !== undefined) updateData.business_name = updates.businessName;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.specialties !== undefined) updateData.specialties = updates.specialties;
  if (updates.yearsExperience !== undefined) updateData.years_experience = updates.yearsExperience;
  if (updates.region !== undefined) updateData.region = updates.region;
  if (updates.district !== undefined) updateData.district = updates.district;
  if (updates.address !== undefined) updateData.address = updates.address;
  if (updates.basePrice !== undefined) updateData.base_price = updates.basePrice;
  if (updates.images !== undefined) updateData.images = updates.images;

  const { data, error } = await supabase
    .from('shamans')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return undefined;
  return mapShamanRow(data);
}

// 무속인 프로필 생성
export async function createShamanProfile(data: {
  userId: string;
  businessName: string;
  description: string;
  specialties: string[];
  yearsExperience: number;
  region: string;
  district: string;
  address: string;
  basePrice: number;
  images?: string[];
}): Promise<ShamanProfile | undefined> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from('shamans')
    .insert({
      user_id: data.userId,
      business_name: data.businessName,
      description: data.description,
      specialties: data.specialties,
      years_experience: data.yearsExperience,
      region: data.region,
      district: data.district,
      address: data.address,
      base_price: data.basePrice,
      images: data.images || [],
      status: 'pending',
    })
    .select()
    .single();

  if (error || !row) return undefined;
  return mapShamanRow(row);
}

// 필터링된 무속인 가져오기
export async function getFilteredShamans(filters: {
  region?: string;
  district?: string;
  specialties?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  searchQuery?: string;
}): Promise<ShamanProfile[]> {
  const supabase = createClient();
  let query = supabase.from('shamans').select('*').eq('status', 'approved');

  if (filters.region) {
    query = query.eq('region', filters.region);
  }

  if (filters.district) {
    query = query.eq('district', filters.district);
  }

  if (filters.specialties && filters.specialties.length > 0) {
    query = query.overlaps('specialties', filters.specialties);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte('base_price', filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte('base_price', filters.maxPrice);
  }

  if (filters.minRating !== undefined) {
    query = query.gte('average_rating', filters.minRating);
  }

  if (filters.searchQuery) {
    const q = `%${filters.searchQuery}%`;
    query = query.or(`business_name.ilike.${q},description.ilike.${q},region.ilike.${q},district.ilike.${q}`);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapShamanRow);
}
