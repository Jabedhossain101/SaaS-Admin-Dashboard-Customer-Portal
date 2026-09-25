'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Admin portal caught error:', error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-red-900/40 bg-slate-900/90 text-center space-y-4 p-6 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <CardHeader className="p-0 space-y-1">
          <CardTitle className="text-xl font-bold text-white">
            Admin Console Error
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            An error occurred while communicating with the administrative data layer.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 text-xs text-red-300 bg-red-950/30 p-3 rounded-lg border border-red-900/30 font-mono text-left truncate">
          {error.message || 'An unknown error occurred'}
        </CardContent>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={() => reset()} size="sm" variant="primary">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Retry Request
          </Button>
          <Link href="/">
            <Button size="sm" variant="outline">
              <Home className="w-3.5 h-3.5 mr-1.5" /> Public Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
