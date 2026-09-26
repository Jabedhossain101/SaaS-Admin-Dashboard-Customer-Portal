import { NextRequest } from 'next/server';
import { successResponse, errorResponse, HttpStatus } from '@/lib/utils/apiResponse';
import { getAdminUsersList, verifyAdminAuth } from '@/app/actions/admin';

/**
 * GET /api/admin/users - Retrieve paginated user directory with search and role/status filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { authorized } = await verifyAdminAuth();
    if (!authorized) {
      return errorResponse(
        'Forbidden: Administrative privileges required.',
        'FORBIDDEN',
        HttpStatus.FORBIDDEN
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || 'all';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    let users = await getAdminUsersList(search, role);

    if (status !== 'all') {
      users = users.filter((u) => u.status === status);
    }

    const total = users.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginatedUsers = users.slice(start, start + limit);

    return successResponse(paginatedUsers, {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user directory';
    return errorResponse(message, 'USERS_FETCH_FAILED', HttpStatus.INTERNAL_ERROR);
  }
}
