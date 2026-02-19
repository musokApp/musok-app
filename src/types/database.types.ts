export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'customer' | 'shaman' | 'admin'
          avatar_url: string | null
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          role?: 'customer' | 'shaman' | 'admin'
          avatar_url?: string | null
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string
          phone?: string | null
          role?: 'customer' | 'shaman' | 'admin'
          avatar_url?: string | null
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      shamans: {
        Row: {
          id: string
          user_id: string
          business_name: string
          description: string
          specialties: string[]
          years_experience: number
          region: string
          district: string
          address: string
          latitude: number | null
          longitude: number | null
          base_price: number
          status: 'pending' | 'approved' | 'rejected' | 'suspended'
          total_bookings: number
          average_rating: number
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          description?: string
          specialties?: string[]
          years_experience?: number
          region: string
          district: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          base_price?: number
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          total_bookings?: number
          average_rating?: number
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          business_name?: string
          description?: string
          specialties?: string[]
          years_experience?: number
          region?: string
          district?: string
          address?: string
          latitude?: number | null
          longitude?: number | null
          base_price?: number
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          total_bookings?: number
          average_rating?: number
          images?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'shamans_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          shaman_id: string
          date: string
          time_slot: string
          consultation_type: string
          notes: string
          total_price: number
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          shaman_id: string
          date: string
          time_slot: string
          consultation_type: string
          notes?: string
          total_price?: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
          rejection_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bookings_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_shaman_id_fkey'
            columns: ['shaman_id']
            isOneToOne: false
            referencedRelation: 'shamans'
            referencedColumns: ['id']
          }
        ]
      }
      chat_rooms: {
        Row: {
          id: string
          customer_id: string
          shaman_id: string
          last_message: string
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          shaman_id: string
          last_message?: string
          last_message_at?: string
          created_at?: string
        }
        Update: {
          last_message?: string
          last_message_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'chat_rooms_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'chat_rooms_shaman_id_fkey'
            columns: ['shaman_id']
            isOneToOne: false
            referencedRelation: 'shamans'
            referencedColumns: ['id']
          }
        ]
      }
      messages: {
        Row: {
          id: string
          room_id: string
          sender_id: string
          content: string
          type: 'text' | 'image' | 'system'
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          sender_id: string
          content: string
          type?: 'text' | 'image' | 'system'
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'messages_room_id_fkey'
            columns: ['room_id']
            isOneToOne: false
            referencedRelation: 'chat_rooms'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          customer_id: string
          shaman_id: string
          rating: number
          content: string
          reply_content: string | null
          reply_created_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          customer_id: string
          shaman_id: string
          rating: number
          content?: string
          reply_content?: string | null
          reply_created_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          rating?: number
          content?: string
          reply_content?: string | null
          reply_created_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_booking_id_fkey'
            columns: ['booking_id']
            isOneToOne: true
            referencedRelation: 'bookings'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_shaman_id_fkey'
            columns: ['shaman_id']
            isOneToOne: false
            referencedRelation: 'shamans'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'shaman' | 'admin'
      shaman_status: 'pending' | 'approved' | 'rejected' | 'suspended'
      booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected'
      message_type: 'text' | 'image' | 'system'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
