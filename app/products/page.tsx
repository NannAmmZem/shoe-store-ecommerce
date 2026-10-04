/**
 * Products Listing Page
 * Features: Search, filters by category/price, sorting
 */

import { query } from '@/lib/db';
import ProductCard from '@/components/ProductCard';
import { Product, Category } from '@/lib/types';
import Link from 'next/link';

interface SearchParams {
  category?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
}

async function getProducts(params: SearchParams): Promise<Product[]> {
  try {
    let sql = 'SELECT p.* FROM products p WHERE 1=1';
    const values: any[] = [];
    let paramCount = 0;

    // Category filter
    if (params.category) {
      paramCount++;
      sql += ` AND p.category_id = (SELECT id FROM categories WHERE slug = $${paramCount})`;
      values.push(params.category);
    }

    // Search filter
    if (params.search) {
      paramCount++;
      sql += ` AND (p.name ILIKE $${paramCount} OR p.description ILIKE $${paramCount} OR p.brand ILIKE $${paramCount})`;
      values.push(`%${params.search}%`);
    }

    // Price filters
    if (params.minPrice) {
      paramCount++;
      sql += ` AND p.price >= $${paramCount}`;
      values.push(parseFloat(params.minPrice));
    }

    if (params.maxPrice) {
      paramCount++;
      sql += ` AND p.price <= $${paramCount}`;
      values.push(parseFloat(params.maxPrice));
    }

    // Sorting
    switch (params.sort) {
      case 'price_asc':
        sql += ' ORDER BY p.price ASC';
        break;
      case 'price_desc':
        sql += ' ORDER BY p.price DESC';
        break;
      case 'newest':
        sql += ' ORDER BY p.created_at DESC';
        break;
      default:
        sql += ' ORDER BY p.created_at DESC';
    }

    const result = await query(sql, values);
    return result.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name');
    return result.rows;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);

  const currentCategory = categories.find(c => c.slug === searchParams.category);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentCategory ? currentCategory.name : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {currentCategory ? currentCategory.description : 'Browse our complete collection of premium footwear'}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="font-bold text-lg mb-4">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <form action="/products" method="get">
                  {searchParams.category && (
                    <input type="hidden" name="category" value={searchParams.category} />
                  )}
                  <input
                    type="text"
                    name="search"
                    defaultValue={searchParams.search}
                    placeholder="Search products..."
                    className="input-field"
                  />
                  <button type="submit" className="btn-primary w-full mt-2">
                    Search
                  </button>
                </form>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  <Link
                    href="/products"
                    className={`block px-3 py-2 rounded-lg transition-colors ${!searchParams.category
                        ? 'bg-accent-500 text-white'
                        : 'hover:bg-gray-100'
                      }`}
                  >
                    All Products
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.slug}`}
                      className={`block px-3 py-2 rounded-lg transition-colors ${searchParams.category === category.slug
                          ? 'bg-accent-500 text-white'
                          : 'hover:bg-gray-100'
                        }`}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <form action="/products" method="get" className="space-y-3">
                  {searchParams.category && (
                    <input type="hidden" name="category" value={searchParams.category} />
                  )}
                  {searchParams.search && (
                    <input type="hidden" name="search" value={searchParams.search} />
                  )}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Min Price</label>
                    <input
                      type="number"
                      name="minPrice"
                      defaultValue={searchParams.minPrice}
                      placeholder="$0"
                      className="input-field"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Max Price</label>
                    <input
                      type="number"
                      name="maxPrice"
                      defaultValue={searchParams.maxPrice}
                      placeholder="$500"
                      className="input-field"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Apply
                  </button>
                </form>
              </div>

              {/* Clear Filters */}
              {(searchParams.category || searchParams.search || searchParams.minPrice || searchParams.maxPrice) && (
                <Link
                  href="/products"
                  className="block text-center text-accent-500 hover:text-accent-600 font-medium"
                >
                  Clear All Filters
                </Link>
              )}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sorting and Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">{products.length}</span> products found
              </p>

              <form action="/products" method="get" className="flex items-center gap-2">
                {searchParams.category && (
                  <input type="hidden" name="category" value={searchParams.category} />
                )}
                {searchParams.search && (
                  <input type="hidden" name="search" value={searchParams.search} />
                )}
                {searchParams.minPrice && (
                  <input type="hidden" name="minPrice" value={searchParams.minPrice} />
                )}
                {searchParams.maxPrice && (
                  <input type="hidden" name="maxPrice" value={searchParams.maxPrice} />
                )}
                <label htmlFor="sort" className="text-sm text-gray-600">
                  Sort by:
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={searchParams.sort}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </form>
            </div>

            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.price}
                    image_url={product.image_url}
                    stock={product.stock}
                    brand={product.brand}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Link href="/products" className="btn-primary">
                  View All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
