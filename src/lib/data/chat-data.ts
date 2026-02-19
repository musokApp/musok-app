import { createClient } from '@/lib/supabase/server';
import { mapChatRoomRow, mapMessageRow } from '@/lib/supabase/mappers';
import { ChatRoom, Message } from '@/types/chat.types';

export async function findRoomById(roomId: string): Promise<ChatRoom | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('id', roomId)
    .single();

  if (error || !data) return undefined;

  // participants 계산: customer_id + shaman의 user_id
  const { data: shaman } = await supabase
    .from('shamans')
    .select('user_id')
    .eq('id', data.shaman_id)
    .single();

  const participants = [data.customer_id];
  if (shaman) participants.push(shaman.user_id);

  return mapChatRoomRow({ ...data, participants });
}

export async function getRoomsByUserId(userId: string): Promise<ChatRoom[]> {
  const supabase = createClient();

  // 이 유저의 shaman 프로필이 있는지 확인
  const { data: shamanProfile } = await supabase
    .from('shamans')
    .select('id, user_id')
    .eq('user_id', userId)
    .single();

  // customer_id 또는 shaman_id로 채팅방 조회
  let orCondition = `customer_id.eq.${userId}`;
  if (shamanProfile) {
    orCondition += `,shaman_id.eq.${shamanProfile.id}`;
  }

  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .or(orCondition)
    .order('last_message_at', { ascending: false });

  if (error || !data) return [];

  // 각 방의 shaman user_id를 조회하여 participants 구성
  const shamanIds = [...new Set(data.map((r) => r.shaman_id))];
  const { data: shamans } = await supabase
    .from('shamans')
    .select('id, user_id')
    .in('id', shamanIds);

  const shamanUserMap = new Map<string, string>();
  shamans?.forEach((s) => shamanUserMap.set(s.id, s.user_id));

  return data.map((row) =>
    mapChatRoomRow({
      ...row,
      participants: [row.customer_id, shamanUserMap.get(row.shaman_id) || ''].filter(Boolean),
    })
  );
}

export async function findExistingRoom(customerId: string, shamanId: string): Promise<ChatRoom | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_rooms')
    .select('*')
    .eq('customer_id', customerId)
    .eq('shaman_id', shamanId)
    .single();

  if (error || !data) return undefined;

  const { data: shaman } = await supabase
    .from('shamans')
    .select('user_id')
    .eq('id', data.shaman_id)
    .single();

  const participants = [data.customer_id];
  if (shaman) participants.push(shaman.user_id);

  return mapChatRoomRow({ ...data, participants });
}

export async function createRoom(customerId: string, shamanId: string, shamanUserId: string): Promise<ChatRoom> {
  const existing = await findExistingRoom(customerId, shamanId);
  if (existing) return existing;

  const supabase = createClient();
  const { data, error } = await supabase
    .from('chat_rooms')
    .insert({
      customer_id: customerId,
      shaman_id: shamanId,
    })
    .select()
    .single();

  if (error || !data) throw error || new Error('채팅방 생성 실패');
  return mapChatRoomRow({ ...data, participants: [customerId, shamanUserId] });
}

export async function getMessagesByRoomId(roomId: string): Promise<Message[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true });

  if (error || !data) return [];
  return data.map(mapMessageRow);
}

export async function addMessage(roomId: string, senderId: string, content: string): Promise<Message> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      room_id: roomId,
      sender_id: senderId,
      content,
      type: 'text',
    })
    .select()
    .single();

  if (error || !data) throw error || new Error('메시지 전송 실패');

  // chat_rooms.last_message 업데이트
  await supabase
    .from('chat_rooms')
    .update({
      last_message: content,
      last_message_at: data.created_at,
    })
    .eq('id', roomId);

  return mapMessageRow(data);
}

export async function markMessagesAsRead(roomId: string, userId: string): Promise<void> {
  const supabase = createClient();
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('room_id', roomId)
    .neq('sender_id', userId)
    .eq('is_read', false);
}

export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = createClient();

  // 유저의 shaman 프로필 확인
  const { data: shamanProfile } = await supabase
    .from('shamans')
    .select('id')
    .eq('user_id', userId)
    .single();

  // 유저가 참여한 채팅방 ID 목록
  let orCondition = `customer_id.eq.${userId}`;
  if (shamanProfile) {
    orCondition += `,shaman_id.eq.${shamanProfile.id}`;
  }

  const { data: rooms } = await supabase
    .from('chat_rooms')
    .select('id')
    .or(orCondition);

  if (!rooms || rooms.length === 0) return 0;

  const roomIds = rooms.map((r) => r.id);

  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .in('room_id', roomIds)
    .neq('sender_id', userId)
    .eq('is_read', false);

  if (error) return 0;
  return count || 0;
}

export async function getUnreadCountByRoom(roomId: string, userId: string): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', roomId)
    .neq('sender_id', userId)
    .eq('is_read', false);

  if (error) return 0;
  return count || 0;
}
