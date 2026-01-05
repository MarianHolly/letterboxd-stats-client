'use client';

import { useEffect } from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for debugging
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Oops! Something went wrong
        </h1>

        {/* Description */}
        <p className="text-foreground/70 dark:text-foreground/60 mb-4">
          We encountered an unexpected error. Try refreshing the page or returning home.
        </p>

        {/* Error Details (only show in development) */}
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-700 dark:text-red-300 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 flex-col sm:flex-row">
          <Button
            onClick={reset}
            className="flex-1 bg-slate-950 hover:bg-slate-900 dark:bg-slate-50 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-semibold rounded-md flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full border-slate-300 dark:border-slate-700 text-foreground rounded-md flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Support */}
        <p className="mt-6 text-sm text-foreground/60 dark:text-foreground/50">
          Issues persist?{' '}
          <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Contact us
          </Link>
        </p>
      </div>
    </main>
  );
}
