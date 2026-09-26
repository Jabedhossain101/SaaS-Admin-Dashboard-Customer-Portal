import { z } from 'zod';

export const userAdminUpdateSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: 'Full name is required' })
    .min(2, { message: 'Full name must be at least 2 characters' })
    .max(60, { message: 'Full name cannot exceed 60 characters' }),
  phone: z.string().max(25).optional().or(z.literal('')),
  timezone: z.string().min(1, { message: 'Timezone is required' }),
  role: z.enum(['customer', 'admin'], {
    error: 'Please select a valid role',
  }),
  status: z.enum(['active', 'suspended', 'pending'], {
    error: 'Please select a valid status',
  }),
  plan: z.enum(['free', 'pro', 'enterprise'], {
    error: 'Please select a valid plan',
  }),
  avatarUrl: z
    .string()
    .url({ message: 'Please enter a valid image URL' })
    .or(z.literal(''))
    .optional(),
});

export type UserAdminUpdateFormValues = z.infer<typeof userAdminUpdateSchema>;
