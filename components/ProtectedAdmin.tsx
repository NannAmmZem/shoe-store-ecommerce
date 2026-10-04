'use client';

/**
 * Protected Admin Route Component
 * Wraps admin pages to ensure only admins can access
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedAdminProps {
  children: React.ReactNode;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function ProtectedAdmin({ children, user }: ProtectedAdminProps) {
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      // Not logged in - redirect to login
      router.push('/login?redirect=/admin');
    } else if (user.role !== 'admin') {
      // Logged in but not admin - redirect to home
      router.push('/');
    }
  }, [user, router]);

  // Show loading while checking
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-accent-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // User is admin - render protected content
  return <>{children}</>;
}
