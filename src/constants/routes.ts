export const ROUTES = {
  // Public
  HOME: '/',

  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  ROLE_SELECT: '/role-select',

  // Customer
  SHAMANS: '/shamans',
  SHAMAN_DETAIL: (id: string) => `/shamans/${id}`,
  BOOKING: (shamanId: string) => `/booking/${shamanId}`,
  MY_BOOKINGS: '/my-bookings',
  CHAT: '/chat',
  CHAT_ROOM: (roomId: string) => `/chat/${roomId}`,
  CUSTOMER_PROFILE: '/profile',

  // Shaman
  SHAMAN_DASHBOARD: '/dashboard',
  SHAMAN_PROFILE: '/profile',
  SHAMAN_BOOKINGS: '/bookings',
  SHAMAN_SCHEDULE: '/schedule',
  SHAMAN_REVENUE: '/revenue',
  SHAMAN_REVIEWS: '/reviews',

  // Admin
  ADMIN_DASHBOARD: '/dashboard',
  ADMIN_SHAMANS_APPROVAL: '/shamans/approval',
  ADMIN_SHAMANS_MANAGE: '/shamans/manage',
  ADMIN_USERS: '/users',
  ADMIN_REPORTS: '/reports',
  ADMIN_STATISTICS: '/statistics',
} as const;
