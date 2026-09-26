import { NextRequest } from 'next/server';
import { successResponse, errorResponse, HttpStatus } from '@/lib/utils/apiResponse';
import { getCustomerData } from '@/app/actions/customer';

/**
 * GET /api/activity - Retrieve paginated activity logs for current tenant
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const { activityLogs } = await getCustomerData();

    // Filter by search query
    let filtered = activityLogs;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (log) =>
          log.action.toLowerCase().includes(q) ||
          (log.description && log.description.toLowerCase().includes(q))
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return successResponse(data, {
      page,
      limit,
      total,
      totalPages,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch activity logs';
    return errorResponse(message, 'ACTIVITY_FETCH_FAILED', HttpStatus.INTERNAL_ERROR);
  }
}
