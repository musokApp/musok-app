import { NextRequest, NextResponse } from 'next/server';
import { getFilteredShamans } from '@/lib/data/shamans-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    region: searchParams.get('region') || undefined,
    district: searchParams.get('district') || undefined,
    specialties: searchParams.get('specialties')?.split(',') || undefined,
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
    minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
    searchQuery: searchParams.get('search') || undefined,
  };

  const shamans = getFilteredShamans(filters);

  return NextResponse.json({ shamans, total: shamans.length });
}
