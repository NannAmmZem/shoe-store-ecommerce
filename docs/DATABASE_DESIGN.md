# 🗄️ DATABASE DESIGN DOCUMENTATION
## StepUp Shoe Store E-Commerce Platform

---

## 1. DATABASE OVERVIEW

### Database Management System
**PostgreSQL 16** - Advanced open-source relational database

### Design Principles
- **Normalization:** Tables are normalized to 3NF to eliminate redundancy
- **Referential Integrity:** Foreign key constraints maintain data consistency
- **Indexing:** Strategic indexes for optimal query performance
- **Scalability:** Designed to handle growing data and traffic
- **Security:** Password hashing, SQL injection prevention

---

## 2. ENTITY RELATIONSHIP DIAGRAM (ERD)

### ERD Description

```
┌─────────────┐
│   USERS     │
│─────────────│
│ id (PK)     │───┐
│ name        │   │
│ email       │   │ 1:N
│ password    │   │
│ role        │   │
│ phone       │   │
│ address     │   │
└─────────────┘   │
                  │
                  │         ┌─────────────────┐
                  ├─────────│     ORDERS      │
                  │         │─────────────────│
                  │         │ id (PK)         │───┐
                  │         │ user_id (FK)    │   │
                  │         │ total_amount    │   │ 1:N
                  │         │ status          │   │
                  │         │ payment_method  │   │
                  │         │ shipping_addr   │   │
                  │         │ created_at      │   │
                  │         └─────────────────┘   │
                  │                               │
                  │                               │
                  │         ┌─────────────────────┴───────┐
                  │         │     ORDER_ITEMS             │
                  │         │─────────────────────────────│
                  │         │ id (PK)                     │
                  │         │ order_id (FK) ──────────────┤
                  │         │ product_id (FK) ────┐       │
                  │         │ quantity            │       │
                  │         │ price_at_purchase   │       │
                  │         │ size                │       │
                  │         └─────────────────────┘       │
                  │                      │                │
                  │         ┌────────────┴────────┐       │
                  │         │                     │       │
┌─────────────────┴──┐      │    ┌─────────────────────┐ │
│      CART          │      │    │     PRODUCTS        │ │
│────────────────────│      │    │─────────────────────│ │
│ id (PK)            │      │    │ id (PK)             │◄┘
│ user_id (FK) ──────┤      │    │ name                │
│ product_id (FK) ───┼──────┘    │ slug                │
│ quantity           │           │ description         │
│ size               │           │ price               │
│ added_at           │           │ stock               │
└────────────────────┘           │ image_url           │
                                 │ category_id (FK) ───┐
┌─────────────────┐              │ brand               │
│   PAYMENTS      │              │ sizes               │
│─────────────────│              │ colors              │
│ id (PK)         │              └─────────────────────┘
│ order_id (FK) ──┤                       │
│ amount          │                       │ N:1
│ method          │                       │
│ status          │              ┌────────┴────────┐
│ transaction_id  │              │   CATEGORIES    │
│ paid_at         │              │─────────────────│
└─────────────────┘              │ id (PK)         │
                                 │ name            │
                                 │ slug            │
                                 │ description     │
                                 │ image_url       │
                                 └─────────────────┘
```

### Relationship Summary

1. **Users ↔ Orders** (1:N)
   - One user can have multiple orders
   - Each order belongs to one user

2. **Users ↔ Cart** (1:N)
   - One user can have multiple cart items
   - Each cart item belongs to one user

3. **Orders ↔ Order Items** (1:N)
   - One order can have multiple items
   - Each order item belongs to one order

4. **Orders ↔ Payments** (1:1)
   - Each order has one payment record
   - Each payment belongs to one order

5. **Products ↔ Order Items** (1:N)
   - One product can appear in multiple orders
   - Each order item references one product

6. **Products ↔ Cart** (1:N)
   - One product can be in multiple carts
   - Each cart item references one product

7. **Categories ↔ Products** (1:N)
   - One category contains multiple products
   - Each product belongs to one category

---

## 3. TABLE SPECIFICATIONS

### 3.1 USERS Table

**Purpose:** Store customer and administrator account information

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email address (login) |
| password_hash | VARCHAR(255) | NOT NULL | Hashed password (bcrypt) |
| role | VARCHAR(20) | DEFAULT 'customer' | User role (customer/admin) |
| phone | VARCHAR(20) | NULL | Contact number |
| address | TEXT | NULL | Home address |
| created_at | TIMESTAMP | DEFAULT NOW() | Registration date |

**Indexes:**
- `idx_users_email` on `email` (login lookup)
- `idx_users_role` on `role` (filter by role)

**Sample Data:**
```sql
INSERT INTO users (name, email, password_hash, role, phone, address) VALUES
('John Doe', 'john@example.com', '$2a$10$...', 'customer', '+855987654321', 'Phnom Penh'),
('Admin User', 'admin@shoestore.com', '$2a$10$...', 'admin', '+855123456789', 'Phnom Penh');
```

---

### 3.2 CATEGORIES Table

**Purpose:** Organize products into categories

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(100) | UNIQUE, NOT NULL | Category name |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly name |
| description | TEXT | NULL | Category description |
| image_url | VARCHAR(500) | NULL | Category image |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |

**Indexes:**
- `idx_categories_slug` on `slug` (URL routing)

**Sample Data:**
```sql
INSERT INTO categories (name, slug, description) VALUES
('Sneakers', 'sneakers', 'Trendy and stylish sneakers'),
('Running', 'running', 'High-performance running shoes'),
('Formal', 'formal', 'Elegant formal shoes');
```

---

### 3.3 PRODUCTS Table

**Purpose:** Store product inventory information

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(200) | NOT NULL | Product name |
| slug | VARCHAR(200) | UNIQUE, NOT NULL | URL-friendly name |
| description | TEXT | NULL | Product description |
| price | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Product price in USD |
| stock | INTEGER | DEFAULT 0, CHECK >= 0 | Available quantity |
| image_url | VARCHAR(500) | NULL | Product image |
| category_id | INTEGER | FOREIGN KEY → categories.id | Category reference |
| brand | VARCHAR(100) | NULL | Brand name |
| sizes | VARCHAR(100) | NULL | Available sizes (CSV) |
| colors | VARCHAR(100) | NULL | Available colors (CSV) |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

**Indexes:**
- `idx_products_category` on `category_id` (filter by category)
- `idx_products_slug` on `slug` (URL routing)
- `idx_products_price` on `price` (price range filters)

**Sample Data:**
```sql
INSERT INTO products (name, slug, price, stock, category_id, brand, sizes, colors) VALUES
('Air Max Classic White', 'air-max-classic-white', 89.99, 50, 1, 'Nike', '38,39,40,41,42', 'White,Black'),
('Marathon Pro Runner', 'marathon-pro-runner', 125.99, 35, 2, 'Nike', '39,40,41,42,43', 'Blue,Orange');
```

---

### 3.4 CART Table

**Purpose:** Store user shopping cart items

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY → users.id | User reference |
| product_id | INTEGER | FOREIGN KEY → products.id | Product reference |
| quantity | INTEGER | NOT NULL, CHECK > 0 | Item quantity |
| size | VARCHAR(10) | NULL | Selected size |
| added_at | TIMESTAMP | DEFAULT NOW() | Date added to cart |

**Constraints:**
- UNIQUE(user_id, product_id, size) - Prevent duplicate entries

**Indexes:**
- `idx_cart_user` on `user_id` (fetch user cart)

**Sample Data:**
```sql
INSERT INTO cart (user_id, product_id, quantity, size) VALUES
(2, 1, 1, '42'),
(2, 5, 2, '40');
```

---

### 3.5 ORDERS Table

**Purpose:** Store customer orders

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| user_id | INTEGER | FOREIGN KEY → users.id | Customer reference |
| total_amount | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Order total in USD |
| status | VARCHAR(20) | DEFAULT 'pending' | Order status |
| payment_method | VARCHAR(50) | NOT NULL | Payment method |
| shipping_address | TEXT | NOT NULL | Delivery address |
| shipping_phone | VARCHAR(20) | NULL | Contact number |
| customer_name | VARCHAR(100) | NULL | Recipient name |
| notes | TEXT | NULL | Order notes |
| tracking_number | VARCHAR(100) | NULL | Shipment tracking |
| created_at | TIMESTAMP | DEFAULT NOW() | Order date |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update |

**Status Values:** pending, paid, processing, shipped, delivered, cancelled

**Indexes:**
- `idx_orders_user` on `user_id` (user order history)
- `idx_orders_status` on `status` (filter by status)
- `idx_orders_created` on `created_at DESC` (recent orders)

**Sample Data:**
```sql
INSERT INTO orders (user_id, total_amount, status, payment_method, shipping_address, customer_name) VALUES
(2, 89.99, 'delivered', 'ABA Bank', 'Street 123, Phnom Penh', 'John Doe'),
(3, 205.98, 'processing', 'Cash on Delivery', 'Street 456, Phnom Penh', 'Sarah Smith');
```

---

### 3.6 ORDER_ITEMS Table

**Purpose:** Store items within each order

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| order_id | INTEGER | FOREIGN KEY → orders.id | Order reference |
| product_id | INTEGER | FOREIGN KEY → products.id | Product reference |
| quantity | INTEGER | NOT NULL, CHECK > 0 | Item quantity |
| price_at_purchase | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Price when purchased |
| size | VARCHAR(10) | NULL | Selected size |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |

**Indexes:**
- `idx_order_items_order` on `order_id` (fetch order items)

**Sample Data:**
```sql
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, size) VALUES
(1, 1, 1, 89.99, '42'),
(2, 5, 1, 125.99, '40'),
(2, 9, 1, 79.99, '39');
```

---

### 3.7 PAYMENTS Table

**Purpose:** Track payment transactions

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| order_id | INTEGER | FOREIGN KEY → orders.id | Order reference |
| amount | DECIMAL(10,2) | NOT NULL, CHECK >= 0 | Payment amount |
| method | VARCHAR(50) | NOT NULL | Payment method |
| status | VARCHAR(20) | DEFAULT 'pending' | Payment status |
| transaction_id | VARCHAR(255) | UNIQUE | Transaction reference |
| paid_at | TIMESTAMP | NULL | Payment date |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation date |

**Status Values:** pending, completed, failed, refunded

**Indexes:**
- `idx_payments_order` on `order_id` (order payment lookup)
- `idx_payments_status` on `status` (filter by status)

**Sample Data:**
```sql
INSERT INTO payments (order_id, amount, method, status, transaction_id, paid_at) VALUES
(1, 89.99, 'ABA Bank', 'completed', 'ABA-1234-5678', NOW()),
(2, 205.98, 'Cash on Delivery', 'pending', 'COD-9876-5432', NULL);
```

---

## 4. DATABASE TRIGGERS

### Auto-Update Timestamp
Automatically update `updated_at` column when records are modified.

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 5. QUERY OPTIMIZATION

### Strategic Indexes

1. **Users Table**
   - Email index for fast login lookups
   - Role index for filtering admins vs customers

2. **Products Table**
   - Category index for filtering
   - Slug index for URL routing
   - Price index for range queries

3. **Orders Table**
   - User index for order history
   - Status index for admin filtering
   - Created_at index (DESC) for recent orders

4. **Cart Table**
   - User index for cart retrieval

### Connection Pooling
- Maximum 20 connections in pool
- 30-second idle timeout
- 2-second connection timeout

---

## 6. DATA SECURITY

### Password Security
- Passwords hashed using **bcrypt** (salt rounds: 10)
- Password hashes stored in `password_hash` column
- Never store plain text passwords

### SQL Injection Prevention
- Parameterized queries used throughout
- Input sanitization on all user inputs
- PostgreSQL's native prepared statements

### Data Validation
- CHECK constraints on numerical fields
- NOT NULL constraints on required fields
- UNIQUE constraints on email, slug, transaction_id
- Foreign key constraints maintain referential integrity

---

## 7. BACKUP & RECOVERY

### Backup Strategy
```bash
# Daily automated backup
docker exec shoe_store_db pg_dump -U shoe_admin shoe_store > backup_$(date +%Y%m%d).sql

# Restore from backup
docker exec -i shoe_store_db psql -U shoe_admin shoe_store < backup_20260921.sql
```

### Data Retention
- Order data: Permanent
- User data: Until account deletion
- Cart data: 30 days of inactivity
- Logs: 90 days

---

**Document Version:** 1.0  
**Database Version:** PostgreSQL 16  
**Last Updated:** September 2026  
**Prepared By:** StepUp Development Team
