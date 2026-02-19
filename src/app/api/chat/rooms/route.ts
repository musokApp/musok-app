import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import {
  getRoomsByUserId,
  findExistingRoom,
  createRoom,
  getUnreadCountByRoom,
} from '@/lib/data/chat-data';
import { findShamanById } from '@/lib/data/shamans-data';
import { findUserById } from '@/lib/auth/users-data';
import { CreateRoomData } from '@/types/chat.types';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const rooms = await getRoomsByUserId(user.userId);

  const roomsWithParticipant = await Promise.all(
    rooms.map(async (room) => {
      const isCustomer = room.customerId === user.userId;

      if (isCustomer) {
        const shaman = await findShamanById(room.shamanId);
        const shamanUserRow = shaman
          ? await findUserById(shaman.userId)
          : null;
        return {
          ...room,
          otherUser: {
            id: shamanUserRow?.id || '',
            fullName: shamanUserRow?.full_name || '알 수 없음',
            avatarUrl: shamanUserRow?.avatar_url || null,
            businessName: shaman?.businessName,
            images: shaman?.images,
          },
          unreadCount: await getUnreadCountByRoom(room.id, user.userId),
        };
      } else {
        const customerRow = await findUserById(room.customerId);
        return {
          ...room,
          otherUser: {
            id: customerRow?.id || '',
            fullName: customerRow?.full_name || '알 수 없음',
            avatarUrl: customerRow?.avatar_url || null,
          },
          unreadCount: await getUnreadCountByRoom(room.id, user.userId),
        };
      }
    })
  );

  return NextResponse.json({ rooms: roomsWithParticipant });
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  const body: CreateRoomData = await request.json();
  const shaman = await findShamanById(body.shamanId);

  if (!shaman) {
    return NextResponse.json({ error: '무속인을 찾을 수 없습니다' }, { status: 404 });
  }

  // 고객이 요청하는 경우
  if (user.role === 'customer') {
    const existing = await findExistingRoom(user.userId, body.shamanId);
    if (existing) {
      return NextResponse.json({ room: existing });
    }
    const room = await createRoom(user.userId, body.shamanId, shaman.userId);
    return NextResponse.json({ room }, { status: 201 });
  }

  // 무속인이 요청하는 경우 (shamanId는 본인, customerId는 body에서)
  return NextResponse.json({ error: '고객만 채팅방을 생성할 수 있습니다' }, { status: 403 });
}
