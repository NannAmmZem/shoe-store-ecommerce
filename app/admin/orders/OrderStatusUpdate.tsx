'use client';

/**
 * Order Status Update Component
 * Allows admin to update order status
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrderStatusColor } from '@/lib/utils';

interface OrderStatusUpdateProps {
  orderId: number;
  currentStatus: string;
}

const statusOptions = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status || loading) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleStatusChange(e.target.value)}
      disabled={loading}
      className={`badge ${getOrderStatusColor(status)} border-none cursor-pointer disabled:opacity-50`}
    >
      {statusOptions.map((option) => (
        <option key={option} value={option}>
          {option.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
