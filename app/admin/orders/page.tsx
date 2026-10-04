/**
 * Admin Orders Management Page
 * View and update order status
 */

import { query } from '@/lib/db';
import { formatPrice, formatDateTime, getOrderStatusColor } from '@/lib/utils';
import OrderStatusUpdate from './OrderStatusUpdate';

async function getOrders() {
  try {
    const result = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email,
              COUNT(oi.id) as item_count
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id, u.name, u.email
       ORDER BY o.created_at DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Orders Management</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="font-semibold text-gray-900">#{order.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{order.user_name}</p>
                    <p className="text-sm text-gray-500">{order.user_email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {formatDateTime(order.created_at)}
                </td>
                <td className="px-6 py-4 text-gray-900">
                  {order.item_count} items
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">
                  {formatPrice(order.total_amount)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{order.payment_method}</span>
                </td>
                <td className="px-6 py-4">
                  <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md mt-4">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-8">
        {['pending', 'paid', 'processing', 'shipped', 'delivered'].map((status) => {
          const count = orders.filter((o: any) => o.status === status).length;
          return (
            <div key={status} className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-600 mb-1 capitalize">{status}</p>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
