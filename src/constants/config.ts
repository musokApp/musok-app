export const APP_CONFIG = {
  name: '무속은 안 어려워?',
  description: '무속인 예약 플랫폼',
  version: '0.1.0',

  // Pagination
  itemsPerPage: 20,

  // File upload
  maxImageSize: 5 * 1024 * 1024, // 5MB
  acceptedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],

  // Price
  minPrice: 10000,
  maxPrice: 1000000,

  // Platform fee (10%)
  platformFeeRate: 0.1,
} as const;
