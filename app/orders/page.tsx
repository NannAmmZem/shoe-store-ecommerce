/**
 * My Orders Page
 * Display user's order history
 */

import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { formatPrice, formatDateTime, getOrderStatusColor } from '@/lib/utils';
import Link from 'next/link';

async function getUserOrders(userId: number) {
  try {
    const ordersResult = await query(
      `SELECT o.*, 
              json_agg(json_build_object(
                'id', oi.id,
                'product_name', p.name,
                'quantity', oi.quantity,
                'price', oi.price_at_purchase,
                'size', oi.size
              )) as items
       FROM orders o
       LEFT JOIN order_items oi ON o.id = oi.order_id
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return ordersResult.rows;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/orders');
  }

  const orders = await getUserOrders(user.id);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <Link href="/products" className="btn-primary inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{formatDateTime(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`badge ${getOrderStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-primary-900">
                      {formatPrice(order.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-3">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{item.product_name}</p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity}
                            {item.size && ` | Size: ${item.size}`}
                          </p>
                        </div>
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Shipping Address</p>
                      <p className="text-sm text-gray-600 mt-1">{order.shipping_address}</p>
                      {order.shipping_phone && (
                        <p className="text-sm text-gray-600">Phone: {order.shipping_phone}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Payment Method</p>
                      <p className="text-sm text-gray-600 mt-1">{order.payment_method}</p>
                      {order.tracking_number && (
                        <>
                          <p className="text-sm font-medium text-gray-700 mt-2">Tracking Number</p>
                          <p className="text-sm text-accent-500 font-mono">{order.tracking_number}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
