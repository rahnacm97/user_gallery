export const FRONTEND_ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

export const API_ROUTES = {
  AUTH_LOGIN: '/api/auth/login',
  AUTH_REGISTER: '/api/auth/register',
  AUTH_FORGOT_PASSWORD: '/api/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/api/auth/reset-password',
  AUTH_VERIFY_OTP: '/api/auth/verify-otp',
  AUTH_RESEND_OTP: '/api/auth/resend-otp',
  GALLERY: '/api/gallery',
  GALLERY_UPLOAD: '/api/gallery/upload',
  GALLERY_REORDER: '/api/gallery/reorder',
} as const;

