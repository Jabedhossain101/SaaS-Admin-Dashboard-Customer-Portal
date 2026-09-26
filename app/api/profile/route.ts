import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/utils';
import { successResponse, errorResponse, HttpStatus } from '@/lib/utils/apiResponse';
import { profileUpdateSchema } from '@/lib/validations/profile';
import { getCustomerData, updateCustomerProfileAction } from '@/app/actions/customer';

/**
 * GET /api/profile - Retrieve current authenticated customer profile
 */
export async function GET() {
  try {
    const data = await getCustomerData();
    return successResponse(data.profile);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile';
    return errorResponse(message, 'PROFILE_FETCH_FAILED', HttpStatus.INTERNAL_ERROR);
  }
}

/**
 * PATCH /api/profile - Update full name, phone, timezone, avatar URL
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = profileUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      return errorResponse(
        'Validation failed for profile update payload',
        'VALIDATION_ERROR',
        HttpStatus.BAD_REQUEST,
        parseResult.error.format()
      );
    }

    const result = await updateCustomerProfileAction(parseResult.data);
    if (!result.success) {
      return errorResponse(
        result.error || 'Failed to update profile',
        'UPDATE_FAILED',
        HttpStatus.BAD_REQUEST
      );
    }

    return successResponse({ message: result.message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request body';
    return errorResponse(message, 'INVALID_REQUEST', HttpStatus.BAD_REQUEST);
  }
}
