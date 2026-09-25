import { z } from 'zod';

export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Full name is required' })
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(60, { message: 'Full name cannot exceed 60 characters' }),
  avatarUrl: z
    .string()
    .url({ message: 'Please enter a valid image URL' })
    .or(z.literal(''))
    .optional(),
});

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Current password is required' })
      .optional()
      .or(z.literal('')),
    newPassword: z
      .string()
      .min(1, { message: 'New password is required' })
      .min(6, { message: 'New password must be at least 6 characters long' }),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
