'use client';

/**
 * Checkout Form Component
 * Handles form submission and payment processing
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@/components/Alert';

interface CheckoutFormProps {
  user: { id: number; name: string; email: string };
  total: number;
}

export default function CheckoutForm({ user, total }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formData, setFormData] = useState({
    customerName: user.name || '',
    email: user.email || '',
    phone: '',
    address: '',
    city: 'Phnom Penh',
    notes: '',
    paymentMethod: 'Cash on Delivery',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAlert({ type: 'success', message: 'Order placed successfully!' });
        setTimeout(() => {
          router.push(`/orders`);
        }, 1500);
      } else {
        setAlert({ type: 'error', message: data.error || 'Failed to place order' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Information</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+855 12 345 678"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <select
              required
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="input-field"
            >
              <option>Phnom Penh</option>
              <option>Siem Reap</option>
              <option>Sihanoukville</option>
              <option>Battambang</option>
              <option>Kampot</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Address *
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={3}
              placeholder="Street, Building, Apartment..."
              className="input-field"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
              placeholder="Any special instructions..."
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Method</h2>

        <div className="space-y-3">
          {['Cash on Delivery', 'ABA Bank', 'Wing', 'Credit Card'].map((method) => (
            <label
              key={method}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.paymentMethod === method
                  ? 'border-accent-500 bg-accent-50'
                  : 'border-gray-200 hover:border-accent-300'
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method}
                checked={formData.paymentMethod === method}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                className="w-4 h-4 text-accent-500 focus:ring-accent-500"
              />
              <span className="ml-3 font-medium text-gray-900">{method}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent-500 hover:bg-accent-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
      </button>
    </form>
  );
}
