/**
 * Product Detail Page
 * Shows complete product information with add to cart functionality
 */

import { query } from '@/lib/db';
import { ProductWithCategory } from '@/lib/types';
import { formatPrice, getStockStatus, parseList } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartForm from './AddToCartForm';

async function getProduct(slug: string): Promise<ProductWithCategory | null> {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(categoryId: number, currentProductId: number): Promise<ProductWithCategory[]> {
  try {
    const result = await query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.category_id = $1 AND p.id != $2 AND p.stock > 0
       ORDER BY RANDOM()
       LIMIT 4`,
      [categoryId, currentProductId]
    );

    return result.rows;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category_id, product.id);
  const stockStatus = getStockStatus(product.stock);
  const sizes = parseList(product.sizes);
  const colors = parseList(product.colors);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-accent-500">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-accent-500">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category_slug}`}
            className="hover:text-accent-500"
          >
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative h-96 md:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-32 h-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                  {product.brand}
                </p>
              )}

              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Category Badge */}
              <Link
                href={`/products?category=${product.category_slug}`}
                className="inline-block w-fit px-3 py-1 bg-primary-900 text-white text-sm font-semibold rounded-full mb-4 hover:bg-primary-800 transition-colors"
              >
                {product.category_name}
              </Link>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-primary-900">
                  {formatPrice(product.price)}
                </p>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                <p className={`text-lg font-semibold ${stockStatus.color}`}>
                  {stockStatus.label}
                  {product.stock > 0 && product.stock < 10 && (
                    <span className="text-sm ml-2">
                      ({product.stock} left)
                    </span>
                  )}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h2 className="font-semibold text-lg mb-2">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Sizes */}
              {sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Available Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <span
                        key={size}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:border-accent-500 transition-colors"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Available Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <span
                        key={color}
                        className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Form */}
              <AddToCartForm
                productId={product.id}
                productSlug={product.slug}
                stock={product.stock}
                sizes={sizes}
              />

              {/* Product Features */}
              <div className="mt-8 pt-8 border-t">
                <h3 className="font-semibold mb-4">Product Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Authentic and high-quality materials
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Comfortable fit for all-day wear
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Free shipping across Cambodia
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    30-day return policy
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div key={relatedProduct.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                  <Link href={`/product/${relatedProduct.slug}`}>
                    <div className="relative h-48 bg-gray-100">
                      {relatedProduct.image_url ? (
                        <Image
                          src={relatedProduct.image_url}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-bold text-primary-900">
                        {formatPrice(relatedProduct.price)}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
