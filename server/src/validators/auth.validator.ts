import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const updateAdminSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Please enter a valid email address').optional(),
  currentPassword: z.string().min(6).optional(),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').optional(),
});
