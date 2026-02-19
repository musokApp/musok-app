import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import {
  getRoomsByUserId,
  findExistingRoom,
  createRoom,
  getUnreadCountByRoom,
} from '@/lib/data/chat-data';
import { findShamanById, findShamanByUserId } from '@/lib/data/shamans-data';
import { DUMMY_USERS } from '@/lib/auth/users-data';
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

  const rooms = getRoomsByUserId(user.userId);

  const roomsWithParticipant = rooms.map((room) => {
    const isCustomer = room.customerId === user.userId;

    if (isCustomer) {
      const shaman = findShamanById(room.shamanId);
      const shamanUser = shaman
        ? DUMMY_USERS.find((u) => u.id === shaman.userId)
        : null;
      return {
        ...room,
        otherUser: {
          id: shamanUser?.id || '',
          fullName: shamanUser?.fullName || '알 수 없음',
          avatarUrl: shamanUser?.avatarUrl || null,
          businessName: shaman?.businessName,
          images: shaman?.images,
        },
        unreadCount: getUnreadCountByRoom(room.id, user.userId),
      };
    } else {
      const customer = DUMMY_USERS.find((u) => u.id === room.customerId);
      return {
        ...room,
        otherUser: {
          id: customer?.id || '',
          fullName: customer?.fullName || '알 수 없음',
          avatarUrl: customer?.avatarUrl || null,
        },
        unreadCount: getUnreadCountByRoom(room.id, user.userId),
      };
    }
  });

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
  const shaman = findShamanById(body.shamanId);

  if (!shaman) {
    return NextResponse.json({ error: '무속인을 찾을 수 없습니다' }, { status: 404 });
  }

  // 고객이 요청하는 경우
  if (user.role === 'customer') {
    const existing = findExistingRoom(user.userId, body.shamanId);
    if (existing) {
      return NextResponse.json({ room: existing });
    }
    const room = createRoom(user.userId, body.shamanId, shaman.userId);
    return NextResponse.json({ room }, { status: 201 });
  }

  // 무속인이 요청하는 경우 (shamanId는 본인, customerId는 body에서)
  return NextResponse.json({ error: '고객만 채팅방을 생성할 수 있습니다' }, { status: 403 });
}
