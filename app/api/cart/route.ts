/**
 * Cart API Routes
 * GET: Get cart items
 * POST: Add item to cart
 * PATCH: Update item quantity
 * DELETE: Remove item from cart
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET cart items
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const result = await query(
      `SELECT c.*, p.name as product_name, p.price as product_price, 
              p.image_url as product_image, p.stock as product_stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1
       ORDER BY c.added_at DESC`,
      [user.id]
    );

    return NextResponse.json({
      success: true,
      items: result.rows,
    });
  } catch (error) {
    console.error('Cart fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// POST - Add to cart
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
    const { productId, quantity, size } = body;

    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      );
    }

    // Check if item already exists in cart
    const existing = await query(
      'SELECT id, quantity FROM cart WHERE user_id = $1 AND product_id = $2 AND size = $3',
      [user.id, productId, size || null]
    );

    if (existing.rows.length > 0) {
      // Update existing item
      const newQuantity = existing.rows[0].quantity + quantity;
      await query(
        'UPDATE cart SET quantity = $1 WHERE id = $2',
        [newQuantity, existing.rows[0].id]
      );
    } else {
      // Insert new item
      await query(
        'INSERT INTO cart (user_id, product_id, quantity, size) VALUES ($1, $2, $3, $4)',
        [user.id, productId, quantity, size || null]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Add to cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

// PATCH - Update quantity
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || !quantity) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID and quantity are required' },
        { status: 400 }
      );
    }

    await query(
      'UPDATE cart SET quantity = $1 WHERE id = $2 AND user_id = $3',
      [quantity, cartItemId, user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { cartItemId } = body;

    if (!cartItemId) {
      return NextResponse.json(
        { success: false, error: 'Cart item ID is required' },
        { status: 400 }
      );
    }

    await query(
      'DELETE FROM cart WHERE id = $1 AND user_id = $2',
      [cartItemId, user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}
