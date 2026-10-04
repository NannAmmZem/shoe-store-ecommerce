/**
 * TypeScript Type Definitions for Shoe Store
 */

// User & Authentication Types
export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'customer' | 'admin';
  phone?: string;
  address?: string;
  created_at: Date;
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: Date;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  image_url?: string;
  category_id: number;
  brand?: string;
  sizes?: string; // Comma-separated values
  colors?: string; // Comma-separated values
  created_at: Date;
  updated_at: Date;
}

export interface ProductWithCategory extends Product {
  category_name: string;
  category_slug: string;
}

// Cart Types
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  size?: string;
  added_at: Date;
}

export interface CartItemWithProduct extends CartItem {
  product_name: string;
  product_price: number;
  product_image: string;
  product_stock: number;
}

// Order Types
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: OrderStatus;
  payment_method: string;
  shipping_address: string;
  shipping_phone?: string;
  customer_name?: string;
  notes?: string;
  tracking_number?: string;
  created_at: Date;
  updated_at: Date;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
  size?: string;
  created_at: Date;
}

export interface OrderItemWithProduct extends OrderItem {
  product_name: string;
  product_image?: string;
}

export interface OrderWithItems extends Order {
  items: OrderItemWithProduct[];
  user_name?: string;
  user_email?: string;
}

// Payment Types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'Cash on Delivery' | 'ABA Bank' | 'Wing' | 'Credit Card';

export interface Payment {
  id: number;
  order_id: number;
  amount: number;
  method: string;
  status: PaymentStatus;
  transaction_id?: string;
  paid_at?: Date;
  created_at: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Filter & Search Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  brand?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
}

// Dashboard Statistics
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  topProducts: Array<{
    id: number;
    name: string;
    total_sold: number;
    revenue: number;
  }>;
  recentOrders: OrderWithItems[];
}

// Checkout Form Data
export interface CheckoutFormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}
