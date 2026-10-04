'use client';

/**
 * Cart Actions Component
 * Update quantity and remove items
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartActionsProps {
  cartItemId: number;
  currentQuantity: number;
  maxStock: number;
}

export default function CartActions({ cartItemId, currentQuantity, maxStock }: CartActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > maxStock || loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity: newQuantity }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => updateQuantity(currentQuantity - 1)}
          disabled={loading || currentQuantity <= 1}
          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="px-4 py-1 border-x">{currentQuantity}</span>
        <button
          onClick={() => updateQuantity(currentQuantity + 1)}
          disabled={loading || currentQuantity >= maxStock}
          className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>

      <button
        onClick={removeItem}
        disabled={loading}
        className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
      >
        Remove
      </button>
    </div>
  );
}
