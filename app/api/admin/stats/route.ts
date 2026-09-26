import { NextRequest } from 'next/server';
import { successResponse, errorResponse, HttpStatus } from '@/lib/utils/apiResponse';
import { getAdminOverviewData, verifyAdminAuth } from '@/app/actions/admin';

/**
 * GET /api/admin/stats - Retrieve global platform metrics, user trends & KPIs
 */
export async function GET() {
  try {
    const { authorized } = await verifyAdminAuth();
    if (!authorized) {
      return errorResponse(
        'Forbidden: Administrative privileges required.',
        'FORBIDDEN',
        HttpStatus.FORBIDDEN
      );
    }

    const { stats, latestLogs, recentUsers } = await getAdminOverviewData();

    // Generate trend chart series
    const trends = [
      { date: 'Mon', customers: 12, admins: 2, total: 14 },
      { date: 'Tue', customers: 19, admins: 2, total: 21 },
      { date: 'Wed', customers: 28, admins: 3, total: 31 },
      { date: 'Thu', customers: 35, admins: 3, total: 38 },
      { date: 'Fri', customers: 42, admins: 4, total: 46 },
      { date: 'Sat', customers: 50, admins: 4, total: 54 },
      { date: 'Sun', customers: 64, admins: 4, total: 68 },
    ];

    return successResponse({
      stats,
      trends,
      recentUsers,
      latestLogs,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch admin stats';
    return errorResponse(message, 'STATS_FETCH_FAILED', HttpStatus.INTERNAL_ERROR);
  }
}
