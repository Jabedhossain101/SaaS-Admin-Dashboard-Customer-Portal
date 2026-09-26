import { NextRequest } from 'next/server';
import { successResponse, errorResponse, HttpStatus } from '@/lib/utils/apiResponse';
import { userAdminUpdateSchema } from '@/lib/validations/user';
import { getAdminUserById, updateUserByAdminAction, verifyAdminAuth } from '@/app/actions/admin';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/users/[id] - Retrieve single user details and their activity logs
 */
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { authorized } = await verifyAdminAuth();
    if (!authorized) {
      return errorResponse(
        'Forbidden: Administrative privileges required.',
        'FORBIDDEN',
        HttpStatus.FORBIDDEN
      );
    }

    const { id } = await params;
    const { user, userLogs } = await getAdminUserById(id);

    if (!user) {
      return errorResponse('User not found', 'NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    return successResponse({ user, userLogs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user';
    return errorResponse(message, 'USER_FETCH_FAILED', HttpStatus.INTERNAL_ERROR);
  }
}

/**
 * PATCH /api/admin/users/[id] - Update user role, status, plan, and details
 */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { authorized } = await verifyAdminAuth();
    if (!authorized) {
      return errorResponse(
        'Forbidden: Administrative privileges required.',
        'FORBIDDEN',
        HttpStatus.FORBIDDEN
      );
    }

    const { id } = await params;
    const body = await request.json();
    const parseResult = userAdminUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      return errorResponse(
        'Validation failed for user update payload',
        'VALIDATION_ERROR',
        HttpStatus.BAD_REQUEST,
        parseResult.error.format()
      );
    }

    const result = await updateUserByAdminAction(id, parseResult.data);
    if (!result.success) {
      return errorResponse(
        result.error || 'Failed to update user',
        'UPDATE_FAILED',
        HttpStatus.BAD_REQUEST
      );
    }

    return successResponse({ message: result.message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return errorResponse(message, 'INVALID_REQUEST', HttpStatus.BAD_REQUEST);
  }
}
