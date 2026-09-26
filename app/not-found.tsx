import Link from 'next/link';
import { FileQuestion, Home, LayoutDashboard, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex-1 min-h-[85vh] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="max-w-lg w-full border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 text-center space-y-6 shadow-2xl relative z-10">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <FileQuestion className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <Badge variant="purple" className="text-xs">404 Error</Badge>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            The resource, tenant workspace, or route you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link href="/">
            <Button variant="primary" size="md" className="w-full">
              <Home className="w-4 h-4 mr-2" /> Public Home
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="md" className="w-full">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Customer Portal
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 text-xs text-slate-500">
          <Link href="/login" className="hover:text-slate-300 transition-colors flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Sign In
          </Link>
          <span>•</span>
          <Link href="/admin" className="hover:text-purple-400 transition-colors">
            Admin Area
          </Link>
        </div>
      </Card>
    </div>
  );
}
