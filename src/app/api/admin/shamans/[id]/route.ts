import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import { updateShamanStatus } from '@/lib/data/shamans-data';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: '관리자만 접근할 수 있습니다' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status, rejectionReason } = body;

  if (!status || !['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: '유효하지 않은 상태입니다' }, { status: 400 });
  }

  const updated = await updateShamanStatus(id, status, rejectionReason);

  if (!updated) {
    return NextResponse.json({ error: '무속인을 찾을 수 없습니다' }, { status: 404 });
  }

  return NextResponse.json({ shaman: updated });
}
