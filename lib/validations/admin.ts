import { z } from 'zod';

export const adminUserUpdateSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Full name is required' })
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(60, { message: 'Full name cannot exceed 60 characters' }),
  role: z.enum(['customer', 'admin'], {
    error: 'Please select a valid role',
  }),
  avatarUrl: z
    .string()
    .url({ message: 'Please enter a valid image URL' })
    .or(z.literal(''))
    .optional(),
});

export type AdminUserUpdateFormValues = z.infer<typeof adminUserUpdateSchema>;
