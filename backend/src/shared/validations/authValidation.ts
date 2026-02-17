import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().trim().min(6, 'Password must be at least 6 characters').regex(/^\S*$/, 'Password cannot contain spaces'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  phone: z.string().min(10, 'Phone number must be 10 digits'),
  password: z.string().trim().min(6, 'Password must be at least 6 characters').regex(/^\S*$/, 'Password cannot contain spaces'),
});

export const resetPasswordSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().trim().min(6, 'Password must be at least 6 characters').regex(/^\S*$/, 'Password cannot contain spaces'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
