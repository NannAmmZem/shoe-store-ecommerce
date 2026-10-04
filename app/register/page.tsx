/**
 * Register Page
 * New user registration
 */

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import RegisterForm from './RegisterForm';

export default async function RegisterPage({
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
          <h2 className="mt-6 text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-gray-200">Join us and start shopping</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <RegisterForm redirectTo={searchParams.redirect} />

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                href={`/login${searchParams.redirect ? `?redirect=${searchParams.redirect}` : ''}`}
                className="text-accent-500 hover:text-accent-600 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
