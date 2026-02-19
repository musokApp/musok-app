import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { findShamanByUserId, updateShamanProfile, createShamanProfile } from '@/lib/data/shamans-data';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user || user.role !== 'shaman') {
    return NextResponse.json({ error: '무속인 계정만 접근할 수 있습니다' }, { status: 403 });
  }

  const shaman = await findShamanByUserId(user.userId);

  if (!shaman) {
    return NextResponse.json({ shaman: null });
  }

  return NextResponse.json({ shaman });
}

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user || user.role !== 'shaman') {
    return NextResponse.json({ error: '무속인 계정만 접근할 수 있습니다' }, { status: 403 });
  }

  const body = await request.json();
  const existingShaman = await findShamanByUserId(user.userId);

  if (existingShaman) {
    const updated = await updateShamanProfile(existingShaman.id, body);
    if (!updated) {
      return NextResponse.json({ error: '프로필 업데이트에 실패했습니다' }, { status: 500 });
    }
    return NextResponse.json({ shaman: updated });
  } else {
    const created = await createShamanProfile({
      userId: user.userId,
      businessName: body.businessName,
      description: body.description,
      specialties: body.specialties,
      yearsExperience: parseInt(body.yearsExperience),
      region: body.region,
      district: body.district,
      address: body.address,
      basePrice: parseInt(body.basePrice),
    });
    if (!created) {
      return NextResponse.json({ error: '프로필 등록에 실패했습니다' }, { status: 500 });
    }
    return NextResponse.json({ shaman: created }, { status: 201 });
  }
}
