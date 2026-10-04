# 👟 StepUp Shoe Store - Complete E-Commerce Platform

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

A modern, full-stack e-commerce platform for selling shoes in Cambodia. Built with Next.js 14, TypeScript, PostgreSQL, and Docker for easy deployment and scalability.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [Team](#team)
- [License](#license)

## ✨ Features

### Customer Features
- 🏠 **Modern Homepage** with hero section, category cards, and featured products
- 🔍 **Advanced Product Search** with filters (category, price range) and sorting
- 👟 **Product Detail Pages** with size selection, color options, and stock status
- 🛒 **Shopping Cart** with quantity management and real-time updates
- 💳 **Multiple Payment Methods** (Cash on Delivery, ABA Bank, Wing, Credit Card)
- 📦 **Order Tracking** with status updates and order history
- 🔐 **User Authentication** (Login/Register with JWT sessions)
- 📱 **Fully Responsive** design for mobile, tablet, and desktop

### Admin Features
- 📊 **Dashboard** with sales statistics, top products, and recent orders
- 📦 **Product Management** (Add, Edit, Delete products with stock control)
- 🛍️ **Order Management** (View orders, update status, track shipments)
- 👥 **Customer Overview** with user statistics
- 🎨 **Modern Admin UI** with intuitive navigation

### Technical Features
- ⚡ **Server-Side Rendering** (SSR) with Next.js 14
- 🔒 **Secure Authentication** with bcrypt and JWT
- 🗄️ **PostgreSQL Database** with optimized queries and indexes
- 🐳 **Docker Support** for easy deployment
- 🎨 **Beautiful UI** with Tailwind CSS and custom Navy & Orange theme
- 🚀 **Performance Optimized** with Next.js Image optimization
- 📱 **Mobile-First Design** approach

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - Modern state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **PostgreSQL 16** - Relational database
- **Node-Postgres (pg)** - Database connection pooling
- **JWT** - Secure authentication tokens
- **Bcrypt** - Password hashing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd shoe-store
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start PostgreSQL Database

```bash
# Start Docker containers
docker compose up -d

# Verify database is running
docker ps
```

The database will be automatically initialized with:
- All required tables (users, products, categories, cart, orders, etc.)
- Sample data (20+ products across 5 categories)
- Demo admin account

### 4. Configure Environment Variables

The `.env` file is already configured. For production, update these values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shoe_store
DB_USER=shoe_admin
DB_PASSWORD=shoe1234
DATABASE_URL=postgresql://shoe_admin:shoe1234@localhost:5432/shoe_store
SESSION_SECRET=your-secret-key-change-in-production
```

### 5. Start Development Server

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

### 6. Login with Demo Accounts

**Customer Account:**
- Email: `john@example.com`
- Password: `password123`

**Admin Account:**
- Email: `admin@shoestore.com`
- Password: `admin123`

## 📁 Project Structure

```
shoe-store/
├── app/                      # Next.js App Router
│   ├── (customer pages)/
│   │   ├── page.tsx         # Homepage
│   │   ├── products/        # Products listing
│   │   ├── product/[slug]/  # Product detail
│   │   ├── cart/            # Shopping cart
│   │   ├── checkout/        # Checkout flow
│   │   └── orders/          # Order history
│   ├── admin/               # Admin panel
│   │   ├── page.tsx         # Dashboard
│   │   ├── products/        # Product management
│   │   └── orders/          # Order management
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication
│   │   ├── cart/            # Cart operations
│   │   ├── orders/          # Order creation
│   │   └── admin/           # Admin operations
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── ...
├── lib/                     # Utility libraries
│   ├── db.ts               # Database connection
│   ├── auth.ts             # Authentication helpers
│   ├── types.ts            # TypeScript types
│   └── utils.ts            # Helper functions
├── init-db/                 # Database initialization
│   ├── 01-create-tables.sql
│   └── 02-seed-data.sql
├── docker-compose.yml       # Docker configuration
├── .env                     # Environment variables
├── package.json             # Dependencies
└── README.md               # This file
```

## 🗄️ Database Schema

### Core Tables

1. **users** - Customer and admin accounts
2. **categories** - Product categories (Sneakers, Running, Formal, etc.)
3. **products** - Shoe inventory with pricing and stock
4. **cart** - Shopping cart items
5. **orders** - Customer orders
6. **order_items** - Items within each order
7. **payments** - Payment transaction records

### Relationships

- 1 Category → N Products
- 1 User → N Orders
- 1 User → N Cart Items
- 1 Order → N Order Items
- 1 Order → 1 Payment

See `init-db/01-create-tables.sql` for complete schema.

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PATCH /api/cart` - Update quantity
- `DELETE /api/cart` - Remove item

### Orders
- `POST /api/orders` - Create new order

### Admin
- `PATCH /api/admin/orders` - Update order status

## 📸 Screenshots

> Add screenshots here after deployment

- Homepage with categories
- Product listing with filters
- Product detail page
- Shopping cart
- Checkout flow
- Admin dashboard
- Order management

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `shoe_store` |
| `DB_USER` | Database user | `shoe_admin` |
| `DB_PASSWORD` | Database password | `shoe1234` |
| `SESSION_SECRET` | JWT secret key | Required |
| `NODE_ENV` | Environment | `development` |

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Start database
npm run db:up

# Stop database
npm run db:down

# Reset database (caution: deletes all data)
npm run db:reset
```

### Database Management

```bash
# Connect to database
docker exec -it shoe_store_db psql -U shoe_admin -d shoe_store

# View logs
docker logs shoe_store_db

# Backup database
docker exec shoe_store_db pg_dump -U shoe_admin shoe_store > backup.sql

# Restore database
docker exec -i shoe_store_db psql -U shoe_admin shoe_store < backup.sql
```

## 🚢 Deployment

### Docker Deployment

```bash
# Build production image
docker build -t shoe-store .

# Run with docker-compose
docker-compose up -d
```

### Vercel Deployment

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Configure external PostgreSQL (e.g., Supabase, Railway)
5. Deploy

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Browse products and categories
- [ ] Add items to cart
- [ ] Update cart quantities
- [ ] Complete checkout process
- [ ] View order history
- [ ] Admin login
- [ ] View dashboard statistics
- [ ] Update order status
- [ ] Search and filter products

### Test Accounts

See [Quick Start](#quick-start) section for demo credentials.

## 👥 Team

**Project:** Shoe E-Commerce Platform  
**Institution:** [Your University Name]  
**Course:** [Course Name]  
**Year:** 2024

**Team Members:**
- [Your Name] - Full Stack Development
- [Team Member 2] - Frontend Development
- [Team Member 3] - Backend Development
- [Team Member 4] - Database Design

## 📄 License

This project is created for educational purposes.

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🆘 Support

For issues and questions:
1. Check existing documentation
2. Review error logs: `docker logs shoe_store_db`
3. Ensure all dependencies are installed
4. Verify environment variables are set correctly

## 🎯 Future Enhancements

- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Multi-language support (Khmer/English)
- [ ] Real payment gateway integration
- [ ] Image upload for products
- [ ] Inventory alerts
- [ ] Customer support chat

---

**Made with ❤️ in Cambodia** 🇰🇭

**StepUp Shoe Store** - Your Premium Footwear Destination
