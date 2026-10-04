/**
 * Admin Dashboard Page
 * Overview with statistics and recent orders
 */

import { query } from '@/lib/db';
import { formatPrice, formatDateTime, getOrderStatusColor } from '@/lib/utils';
import Link from 'next/link';

async function getDashboardStats() {
  try {
    // Get total sales
    const salesResult = await query(
      `SELECT COALESCE(SUM(total_amount), 0) as total_sales
       FROM orders
       WHERE status != 'cancelled'`
    );

    // Get total orders
    const ordersResult = await query('SELECT COUNT(*) as total_orders FROM orders');

    // Get total customers
    const customersResult = await query(
      "SELECT COUNT(*) as total_customers FROM users WHERE role = 'customer'"
    );

    // Get pending orders
    const pendingResult = await query(
      "SELECT COUNT(*) as pending_orders FROM orders WHERE status = 'pending'"
    );

    // Get top products
    const topProductsResult = await query(
      `SELECT p.id, p.name, SUM(oi.quantity) as total_sold, 
              SUM(oi.quantity * oi.price_at_purchase) as revenue
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       GROUP BY p.id, p.name
       ORDER BY total_sold DESC
       LIMIT 5`
    );

    // Get recent orders
    const recentOrdersResult = await query(
      `SELECT o.*, u.name as user_name, u.email as user_email,
              COUNT(oi.id) as item_count
       FROM orders o
       JOIN users u ON o.user_id = u.id
       LEFT JOIN order_items oi ON o.id = oi.order_id
       GROUP BY o.id, u.name, u.email
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    return {
      totalSales: parseFloat(salesResult.rows[0].total_sales),
      totalOrders: parseInt(ordersResult.rows[0].total_orders),
      totalCustomers: parseInt(customersResult.rows[0].total_customers),
      pendingOrders: parseInt(pendingResult.rows[0].pending_orders),
      topProducts: topProductsResult.rows,
      recentOrders: recentOrdersResult.rows,
    };
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return {
      totalSales: 0,
      totalOrders: 0,
      totalCustomers: 0,
      pendingOrders: 0,
      topProducts: [],
      recentOrders: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-3xl font-bold text-green-600">{formatPrice(stats.totalSales)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Customers</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalCustomers}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pendingOrders}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Selling Products</h2>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.map((product: any, index: number) => (
                <div key={product.id} className="flex items-center justify-between pb-4 border-b last:border-b-0">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-gray-400 mr-4">#{index + 1}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.total_sold} sold</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-600">{formatPrice(parseFloat(product.revenue))}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No sales data yet</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-accent-500 hover:text-accent-600 font-semibold text-sm">
              View All →
            </Link>
          </div>
          {stats.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{order.user_name} • {order.item_count} items</p>
                    <p className="text-xs text-gray-400">{formatDateTime(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 mb-1">{formatPrice(order.total_amount)}</p>
                    <span className={`badge text-xs ${getOrderStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
