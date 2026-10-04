/**
 * Orders API Routes
 * POST: Create new order from cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { generateTransactionId } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { customerName, email, phone, address, city, notes, paymentMethod } = body;

    if (!customerName || !email || !phone || !address || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Get cart items
    const cartResult = await query(
      `SELECT c.*, p.price, p.stock, p.name
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user.id]
    );

    if (cartResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart is empty' },
        { status: 400 }
      );
    }

    const cartItems = cartResult.rows;

    // Check stock availability
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return NextResponse.json(
          { success: false, error: `Insufficient stock for ${item.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate total
    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const shippingAddress = `${address}, ${city}`;
    const orderResult = await query(
      `INSERT INTO orders (user_id, total_amount, status, payment_method, shipping_address, shipping_phone, customer_name, notes)
       VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7)
       RETURNING id`,
      [user.id, totalAmount, paymentMethod, shippingAddress, phone, customerName, notes || null]
    );

    const orderId = orderResult.rows[0].id;

    // Create order items and update stock
    for (const item of cartItems) {
      await query(
        `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, size)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, item.product_id, item.quantity, item.price, item.size || null]
      );

      // Update product stock
      await query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Create payment record
    const transactionId = generateTransactionId(
      paymentMethod === 'Cash on Delivery' ? 'COD' :
      paymentMethod === 'ABA Bank' ? 'ABA' :
      paymentMethod === 'Wing' ? 'WING' : 'CARD'
    );

    const paymentStatus = paymentMethod === 'Cash on Delivery' ? 'pending' : 'completed';
    const paidAt = paymentMethod === 'Cash on Delivery' ? null : new Date();

    await query(
      `INSERT INTO payments (order_id, amount, method, status, transaction_id, paid_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [orderId, totalAmount, paymentMethod, paymentStatus, transactionId, paidAt]
    );

    // Update order status if payment is completed
    if (paymentStatus === 'completed') {
      await query(
        'UPDATE orders SET status = $1 WHERE id = $2',
        ['paid', orderId]
      );
    }

    // Clear cart
    await query('DELETE FROM cart WHERE user_id = $1', [user.id]);

    return NextResponse.json({
      success: true,
      orderId,
      transactionId,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
