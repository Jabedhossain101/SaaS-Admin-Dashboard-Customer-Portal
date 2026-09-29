import { NextRequest } from 'next/server';
import { loginSchema } from '@/lib/validations/auth';
import { signInAction } from '@/app/actions/auth';
import { successResponse, errorResponse, HttpStatus } from '@/lib/utils/apiResponse';

/**
 * POST /api/auth/login - Authenticate user credentials and establish session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return errorResponse(
        parseResult.error.issues[0]?.message || 'Validation failed for login payload',
        'VALIDATION_ERROR',
        HttpStatus.BAD_REQUEST,
        parseResult.error.format()
      );
    }

    const result = await signInAction(parseResult.data);
    if (!result.success) {
      return errorResponse(
        result.error || 'Authentication failed',
        'AUTH_FAILED',
        HttpStatus.UNAUTHORIZED
      );
    }

    return successResponse({
      message: result.message,
      redirectUrl: result.redirectUrl,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request payload';
    return errorResponse(message, 'INVALID_REQUEST', HttpStatus.BAD_REQUEST);
  }
}
