-- ============================================
-- Seed Data for Shoe Store E-Commerce
-- Sample products and categories
-- ============================================

-- Insert Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Sneakers', 'sneakers', 'Trendy and stylish sneakers for everyday wear', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800'),
('Running', 'running', 'High-performance running shoes for athletes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'),
('Casual', 'casual', 'Comfortable casual shoes for daily activities', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'),
('Formal', 'formal', 'Elegant formal shoes for business and events', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800'),
('Kids', 'kids', 'Fun and durable shoes for children', 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800');

-- Insert Demo Users with bcrypt hashed passwords
-- IMPORTANT: Run 'node fix-passwords.js' after first setup to set proper passwords
-- Default passwords (will be updated by fix-passwords.js):
--   Admin:    admin@shoestore.com / admin123
--   Customer: john@example.com / john123
--   Customer: sarah@example.com / sarah123
INSERT INTO users (name, email, password_hash, role, phone, address) VALUES
('Admin User', 'admin@shoestore.com', '$2a$10$placeholder.hash.will.be.replaced.by.fix.passwords.script', 'admin', '+855123456789', 'Phnom Penh, Cambodia'),
('John Doe', 'john@example.com', '$2a$10$placeholder.hash.will.be.replaced.by.fix.passwords.script', 'customer', '+855987654321', 'Street 123, Phnom Penh'),
('Sarah Smith', 'sarah@example.com', '$2a$10$placeholder.hash.will.be.replaced.by.fix.passwords.script', 'customer', '+855456789123', 'Street 456, Phnom Penh');

-- Insert Sample Products - SNEAKERS
INSERT INTO products (name, slug, description, price, stock, image_url, category_id, brand, sizes, colors) VALUES
('Air Max Classic White', 'air-max-classic-white', 'Iconic sneaker with visible Air cushioning and premium leather upper. Perfect for everyday style.', 89.99, 50, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', 1, 'Nike', '38,39,40,41,42,43,44', 'White,Black,Red'),
('Urban Street Sneaker Black', 'urban-street-sneaker-black', 'Modern street-style sneaker with comfortable mesh design and rubber sole.', 65.99, 40, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800', 1, 'Adidas', '38,39,40,41,42,43', 'Black,White,Grey'),
('Retro Classic Canvas', 'retro-classic-canvas', 'Timeless canvas sneaker with vintage appeal. Lightweight and versatile.', 45.99, 60, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800', 1, 'Converse', '36,37,38,39,40,41,42', 'White,Navy,Black,Red'),
('High-Top Basketball Style', 'high-top-basketball-style', 'Premium high-top sneaker inspired by basketball culture. Superior ankle support.', 95.99, 30, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 1, 'Nike', '39,40,41,42,43,44,45', 'Black,White,Blue');

-- Insert Sample Products - RUNNING
INSERT INTO products (name, slug, description, price, stock, image_url, category_id, brand, sizes, colors) VALUES
('Marathon Pro Runner', 'marathon-pro-runner', 'Professional running shoe with advanced cushioning technology. Built for long distances.', 125.99, 35, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 2, 'Nike', '39,40,41,42,43,44', 'Blue,Orange,Black'),
('Speed Trainer 3000', 'speed-trainer-3000', 'Lightweight running shoe designed for speed training and track performance.', 109.99, 28, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800', 2, 'Adidas', '38,39,40,41,42,43,44', 'Black,White,Green'),
('Trail Runner All-Terrain', 'trail-runner-all-terrain', 'Durable trail running shoe with aggressive tread pattern and water-resistant upper.', 115.99, 25, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800', 2, 'Salomon', '39,40,41,42,43,44,45', 'Grey,Orange,Black'),
('Daily Jogger Comfort', 'daily-jogger-comfort', 'Versatile running shoe perfect for daily jogs and gym workouts. Breathable mesh upper.', 79.99, 45, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800', 2, 'Puma', '38,39,40,41,42,43', 'White,Blue,Black');

-- Insert Sample Products - CASUAL
INSERT INTO products (name, slug, description, price, stock, image_url, category_id, brand, sizes, colors) VALUES
('Comfort Slip-On Loafer', 'comfort-slip-on-loafer', 'Easy slip-on casual shoe with memory foam insole. Perfect for everyday comfort.', 55.99, 50, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800', 3, 'Skechers', '38,39,40,41,42,43,44', 'Brown,Black,Grey'),
('Canvas Deck Shoe Navy', 'canvas-deck-shoe-navy', 'Classic boat-style casual shoe with non-marking sole. Great for summer wear.', 49.99, 40, 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800', 3, 'Sperry', '38,39,40,41,42,43', 'Navy,Brown,Grey'),
('Leather Weekend Walker', 'leather-weekend-walker', 'Premium leather casual shoe with cushioned footbed. Stylish and comfortable.', 75.99, 35, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800', 3, 'Clarks', '39,40,41,42,43,44', 'Brown,Black,Tan'),
('Urban Lifestyle Sneaker', 'urban-lifestyle-sneaker', 'Modern casual sneaker combining style with all-day comfort. Perfect for city life.', 68.99, 42, 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800', 3, 'Vans', '37,38,39,40,41,42,43', 'Black,White,Grey,Navy');

-- Insert Sample Products - FORMAL
INSERT INTO products (name, slug, description, price, stock, image_url, category_id, brand, sizes, colors) VALUES
('Executive Oxford Black', 'executive-oxford-black', 'Classic oxford formal shoe in premium leather. Perfect for business meetings.', 135.99, 30, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800', 4, 'Allen Edmonds', '39,40,41,42,43,44', 'Black,Brown'),
('Business Dress Derby', 'business-dress-derby', 'Elegant derby style formal shoe with leather sole. Ideal for professional settings.', 129.99, 25, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800', 4, 'Cole Haan', '39,40,41,42,43,44,45', 'Black,Brown,Burgundy'),
('Wedding Loafer Premium', 'wedding-loafer-premium', 'Sophisticated penny loafer in Italian leather. Perfect for special occasions.', 145.99, 20, 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800', 4, 'Gucci', '40,41,42,43,44', 'Black,Brown'),
('Formal Monk Strap', 'formal-monk-strap', 'Distinguished monk strap shoe with double buckle. Contemporary formal style.', 139.99, 22, 'https://images.unsplash.com/photo-1582897085656-c5ab347d3150?w=800', 4, 'Hugo Boss', '39,40,41,42,43,44', 'Black,Brown,Tan');

-- Insert Sample Products - KIDS
INSERT INTO products (name, slug, description, price, stock, image_url, category_id, brand, sizes, colors) VALUES
('Junior Sport Sneaker', 'junior-sport-sneaker', 'Durable and colorful sneaker for active kids. Easy velcro closure.', 39.99, 55, 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800', 5, 'Nike Kids', '28,29,30,31,32,33,34,35', 'Blue,Red,Black,Pink'),
('Kids Light-Up Runner', 'kids-light-up-runner', 'Fun sneaker with LED lights in the sole. Kids love the flash with every step!', 45.99, 48, 'https://images.unsplash.com/photo-1556217477-d325251ece38?w=800', 5, 'Skechers Kids', '27,28,29,30,31,32,33', 'Pink,Blue,Purple,Black'),
('School Everyday Shoe', 'school-everyday-shoe', 'Practical and comfortable school shoe. Durable construction for daily wear.', 35.99, 60, 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=800', 5, 'Clarks Kids', '28,29,30,31,32,33,34,35,36', 'Black,Navy,Brown'),
('Toddler First Walker', 'toddler-first-walker', 'Soft and flexible shoe designed for toddlers learning to walk. Non-slip sole.', 32.99, 40, 'https://images.unsplash.com/photo-1508423134147-addf71308178?w=800', 5, 'Stride Rite', '20,21,22,23,24,25,26,27', 'White,Pink,Blue,Grey');

-- Insert Sample Orders (for demonstration)
INSERT INTO orders (user_id, total_amount, status, payment_method, shipping_address, shipping_phone, customer_name) VALUES
(2, 89.99, 'delivered', 'ABA Bank', 'Street 123, Phnom Penh, Cambodia', '+855987654321', 'John Doe'),
(2, 135.99, 'shipped', 'Wing', 'Street 123, Phnom Penh, Cambodia', '+855987654321', 'John Doe'),
(3, 205.98, 'processing', 'Cash on Delivery', 'Street 456, Phnom Penh, Cambodia', '+855456789123', 'Sarah Smith');

-- Insert Order Items
INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, size) VALUES
(1, 1, 1, 89.99, '42'),
(2, 13, 1, 135.99, '41'),
(3, 5, 1, 125.99, '40'),
(3, 9, 1, 79.99, '39');

-- Insert Payment Records
INSERT INTO payments (order_id, amount, method, status, transaction_id, paid_at) VALUES
(1, 89.99, 'ABA Bank', 'completed', 'ABA-' || uuid_generate_v4(), NOW() - INTERVAL '5 days'),
(2, 135.99, 'Wing', 'completed', 'WING-' || uuid_generate_v4(), NOW() - INTERVAL '2 days'),
(3, 205.98, 'Cash on Delivery', 'pending', 'COD-' || uuid_generate_v4(), NULL);

-- ============================================
-- SEED DATA COMPLETE
-- ============================================
