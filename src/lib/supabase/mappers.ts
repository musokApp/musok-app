import { Database } from '@/types/database.types';
import { ShamanProfile } from '@/types/shaman.types';
import { Booking } from '@/types/booking.types';
import { ChatRoom, Message } from '@/types/chat.types';
import { Review } from '@/types/review.types';

type UserRow = Database['public']['Tables']['users']['Row'];
type ShamanRow = Database['public']['Tables']['shamans']['Row'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];
type ChatRoomRow = Database['public']['Tables']['chat_rooms']['Row'];
type MessageRow = Database['public']['Tables']['messages']['Row'];
type ReviewRow = Database['public']['Tables']['reviews']['Row'];

// User row → User (without password)
export function mapProfileToUser(row: UserRow) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    phone: row.phone,
    role: row.role,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

// Shaman row → ShamanProfile
export function mapShamanRow(row: ShamanRow): ShamanProfile {
  return {
    id: row.id,
    userId: row.user_id,
    businessName: row.business_name,
    description: row.description,
    specialties: row.specialties as ShamanProfile['specialties'],
    yearsExperience: row.years_experience,
    region: row.region,
    district: row.district,
    address: row.address,
    latitude: row.latitude ?? 0,
    longitude: row.longitude ?? 0,
    basePrice: row.base_price,
    status: row.status,
    totalBookings: row.total_bookings,
    averageRating: row.average_rating,
    images: row.images,
    createdAt: row.created_at,
  };
}

// Booking row → Booking
export function mapBookingRow(row: BookingRow): Booking {
  return {
    id: row.id,
    customerId: row.customer_id,
    shamanId: row.shaman_id,
    date: row.date,
    timeSlot: row.time_slot as Booking['timeSlot'],
    consultationType: row.consultation_type as Booking['consultationType'],
    notes: row.notes,
    totalPrice: row.total_price,
    status: row.status,
    rejectionReason: row.rejection_reason ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ChatRoom row → ChatRoom
export function mapChatRoomRow(row: ChatRoomRow & { participants?: string[] }): ChatRoom {
  return {
    id: row.id,
    customerId: row.customer_id,
    shamanId: row.shaman_id,
    participants: row.participants ?? [],
    lastMessage: row.last_message,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
  };
}

// Message row → Message
export function mapMessageRow(row: MessageRow): Message {
  return {
    id: row.id,
    roomId: row.room_id,
    senderId: row.sender_id,
    content: row.content,
    type: row.type,
    isRead: row.is_read,
    createdAt: row.created_at,
  };
}

// Review row → Review
export function mapReviewRow(row: ReviewRow): Review {
  return {
    id: row.id,
    bookingId: row.booking_id,
    customerId: row.customer_id,
    shamanId: row.shaman_id,
    rating: row.rating,
    content: row.content,
    replyContent: row.reply_content,
    replyCreatedAt: row.reply_created_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
