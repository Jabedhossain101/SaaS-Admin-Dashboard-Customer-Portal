import { NextResponse } from 'next/server';
import type { PaginationMeta } from '@/types';

export function successResponse<T>(data: T, meta?: PaginationMeta, status = 200) {
  if (meta) {
    return NextResponse.json({ data, meta }, { status });
  }
  return NextResponse.json({ data }, { status });
}

export function errorResponse(
  message: string,
  code: string,
  status = 400,
  details?: unknown
) {
  return NextResponse.json(
    {
      error: {
        message,
        code,
        ...(details ? { details } : {}),
      },
    },
    { status }
  );
}

export const HttpStatus = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;
