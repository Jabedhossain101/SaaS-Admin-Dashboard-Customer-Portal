import { NextRequest } from 'next/server';
import { signUpSchema } from '@/lib/validations/auth';
import { signUpAction } from '@/app/actions/auth';
import { successResponse, errorResponse, HttpStatus } from '@/lib/utils/apiResponse';

/**
 * POST /api/auth/signup - Create new account with email, password, full_name, role
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = signUpSchema.safeParse(body);

    if (!parseResult.success) {
      return errorResponse(
        parseResult.error.issues[0]?.message || 'Validation failed for signup payload',
        'VALIDATION_ERROR',
        HttpStatus.BAD_REQUEST,
        parseResult.error.format()
      );
    }

    const result = await signUpAction(parseResult.data);
    if (!result.success) {
      return errorResponse(
        result.error || 'Failed to register account',
        'SIGNUP_FAILED',
        HttpStatus.BAD_REQUEST
      );
    }

    return successResponse(
      {
        message: result.message,
        redirectUrl: result.redirectUrl,
      },
      undefined,
      201
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request payload';
    return errorResponse(message, 'INVALID_REQUEST', HttpStatus.BAD_REQUEST);
  }
}
