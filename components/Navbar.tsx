'use client';

/**
 * Main Navigation Bar Component
 * Features: Logo, navigation links, search, cart icon, user menu
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
  cartCount?: number;
}

export default function Navbar({ user, cartCount = 0 }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path ? 'text-accent-500 font-semibold' : 'text-gray-700 hover:text-accent-500';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary-900 to-accent-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
              👟 StepUp
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={`${isActive('/')} transition-colors`}>
              Home
            </Link>
            <Link href="/products" className={`${isActive('/products')} transition-colors`}>
              Products
            </Link>
            <Link href="/products?category=sneakers" className={`${isActive('/products?category=sneakers')} transition-colors`}>
              Sneakers
            </Link>
            <Link href="/products?category=running" className={`${isActive('/products?category=running')} transition-colors`}>
              Running
            </Link>
            <Link href="/products?category=formal" className={`${isActive('/products?category=formal')} transition-colors`}>
              Formal
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Desktop */}
            <Link href="/products" className="hidden md:block text-gray-700 hover:text-accent-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative text-gray-700 hover:text-accent-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-accent-500 transition-colors">
                  <div className="w-8 h-8 bg-primary-900 text-white rounded-full flex items-center justify-center font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
                  <div className="px-4 py-2 border-b">
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <Link href="/api/auth/logout" className="block px-4 py-2 text-red-600 hover:bg-gray-100">
                    Logout
                  </Link>
                </div>
              </div>
            ) : (
              <Link href="/login" className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors font-medium">
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-3">
              <Link href="/" className={`${isActive('/')} py-2`} onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/products" className={`${isActive('/products')} py-2`} onClick={() => setMobileMenuOpen(false)}>
                All Products
              </Link>
              <Link href="/products?category=sneakers" className="text-gray-700 hover:text-accent-500 py-2" onClick={() => setMobileMenuOpen(false)}>
                Sneakers
              </Link>
              <Link href="/products?category=running" className="text-gray-700 hover:text-accent-500 py-2" onClick={() => setMobileMenuOpen(false)}>
                Running
              </Link>
              <Link href="/products?category=formal" className="text-gray-700 hover:text-accent-500 py-2" onClick={() => setMobileMenuOpen(false)}>
                Formal
              </Link>
              {user && (
                <Link href="/orders" className="text-gray-700 hover:text-accent-500 py-2" onClick={() => setMobileMenuOpen(false)}>
                  My Orders
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
