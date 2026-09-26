'use client';

import * as React from 'react';
import Link from 'next/link';
import { AlertOctagon, RotateCcw, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Unhandled Application Exception:', error);
  }, [error]);

  return (
    <div className="flex-1 min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="max-w-md w-full border-red-900/40 bg-slate-900/90 backdrop-blur-xl p-8 text-center space-y-6 shadow-2xl relative z-10">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertOctagon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="warning" className="text-xs">Application Error</Badge>
          <CardTitle className="text-2xl font-bold text-white tracking-tight">
            Unexpected System Exception
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 max-w-sm mx-auto">
            An unexpected error occurred during rendering. The issue has been recorded for review.
          </CardDescription>
        </div>

        {error.message && (
          <div className="rounded-xl bg-red-950/30 border border-red-900/40 p-3.5 text-xs text-red-300 font-mono text-left max-h-28 overflow-y-auto">
            {error.message}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Button onClick={() => reset()} variant="primary" size="md" className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" /> Retry Action
          </Button>
          <Link href="/">
            <Button variant="outline" size="md" className="w-full">
              <Home className="w-4 h-4 mr-2" /> Public Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
