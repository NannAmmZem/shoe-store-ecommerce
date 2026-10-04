'use client';

/**
 * Add to Cart Form Component
 * Handles size selection, quantity, and adding items to cart
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@/components/Alert';

interface AddToCartFormProps {
  productId: number;
  productSlug: string;
  stock: number;
  sizes: string[];
}

export default function AddToCartForm({ productId, productSlug, stock, sizes }: AddToCartFormProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState(sizes.length > 0 ? sizes[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleAddToCart = async () => {
    if (stock === 0) return;

    if (sizes.length > 0 && !selectedSize) {
      setAlert({ type: 'error', message: 'Please select a size' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          quantity,
          size: selectedSize || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', message: 'Added to cart successfully!' });
        
        // Redirect to cart after 1 second
        setTimeout(() => {
          router.push('/cart');
        }, 1000);
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to add to cart. Please login first.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const isOutOfStock = stock === 0;

  return (
    <div className="space-y-4">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div>
          <label className="block font-semibold mb-2">Select Size</label>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-accent-500 bg-accent-500 text-white'
                    : 'border-gray-300 hover:border-accent-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selection */}
      <div>
        <label className="block font-semibold mb-2">Quantity</label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={isOutOfStock}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(stock, parseInt(e.target.value) || 1)))}
            disabled={isOutOfStock}
            className="w-20 text-center border border-gray-300 rounded-lg py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none disabled:opacity-50"
            min="1"
            max={stock}
          />
          <button
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={isOutOfStock}
            className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {isOutOfStock ? (
          <button
            disabled
            className="flex-1 bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <>
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="flex-1 bg-accent-500 hover:bg-accent-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Add to Cart
                </>
              )}
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="sm:w-auto px-6 border-2 border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white py-3 rounded-lg font-semibold transition-all"
            >
              View Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}
