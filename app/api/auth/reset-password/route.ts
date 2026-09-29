import { NextRequest } from 'next/server';
import { forgotPasswordSchema, resetPasswordSchema } from '@/lib/validations/auth';
import { forgotPasswordAction, resetPasswordAction } from '@/app/actions/auth';
import { successResponse, errorResponse, HttpStatus } from '@/lib/utils/apiResponse';

/**
 * POST /api/auth/reset-password - Send reset link or update password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if body is requesting a reset email or submitting a new password
    if (body.email) {
      const parseResult = forgotPasswordSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse(
          parseResult.error.issues[0]?.message || 'Invalid email address',
          'VALIDATION_ERROR',
          HttpStatus.BAD_REQUEST,
          parseResult.error.format()
        );
      }

      const result = await forgotPasswordAction(parseResult.data);
      if (!result.success) {
        return errorResponse(
          result.error || 'Failed to send reset link',
          'RESET_REQUEST_FAILED',
          HttpStatus.BAD_REQUEST
        );
      }

      return successResponse({ message: result.message });
    } else if (body.password) {
      const parseResult = resetPasswordSchema.safeParse(body);
      if (!parseResult.success) {
        return errorResponse(
          parseResult.error.issues[0]?.message || 'Invalid password parameters',
          'VALIDATION_ERROR',
          HttpStatus.BAD_REQUEST,
          parseResult.error.format()
        );
      }

      const result = await resetPasswordAction(parseResult.data);
      if (!result.success) {
        return errorResponse(
          result.error || 'Failed to reset password',
          'RESET_FAILED',
          HttpStatus.BAD_REQUEST
        );
      }

      return successResponse({
        message: result.message,
        redirectUrl: result.redirectUrl,
      });
    } else {
      return errorResponse(
        'Missing required fields: email or password',
        'VALIDATION_ERROR',
        HttpStatus.BAD_REQUEST
      );
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request payload';
    return errorResponse(message, 'INVALID_REQUEST', HttpStatus.BAD_REQUEST);
  }
}
