/**
 * Login Page
 * User authentication
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import LoginForm from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string };
}) {
  const user = await getCurrentUser();

  // If already logged in, redirect
  if (user) {
    redirect(searchParams.redirect || '/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-accent-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <div className="bg-white text-primary-900 px-6 py-3 rounded-lg font-bold text-2xl shadow-lg">
              👟 StepUp
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-200">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <LoginForm redirectTo={searchParams.redirect} />

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                href={`/register${searchParams.redirect ? `?redirect=${searchParams.redirect}` : ''}`}
                className="text-accent-500 hover:text-accent-600 font-semibold"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white text-sm">
          <p className="font-semibold mb-2">Demo Accounts:</p>
          <p>👤 Customer: john@example.com / password123</p>
          <p>🔐 Admin: admin@shoestore.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
