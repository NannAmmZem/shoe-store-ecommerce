/**
 * Product Card Component
 * Displays product information with image, price, and add-to-cart button
 */

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice, getStockStatus } from '@/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number | string;
  image_url?: string;
  stock: number;
  brand?: string;
}

export default function ProductCard({ id, name, slug, price, image_url, stock, brand }: ProductCardProps) {
  const stockStatus = getStockStatus(stock);
  const isOutOfStock = stock === 0;

  return (
    <div className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link href={`/product/${slug}`}>
        {/* Product Image */}
        <div className="relative h-64 bg-gray-100 overflow-hidden">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Sold Out
            </div>
          )}
          {!isOutOfStock && stock < 10 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Low Stock
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand */}
          {brand && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{brand}</p>
          )}

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-accent-500 transition-colors line-clamp-2 h-12">
            {name}
          </h3>

          {/* Price and Stock Status */}
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold text-primary-900">
              {formatPrice(price)}
            </p>
            <p className={`text-sm font-medium ${stockStatus.color}`}>
              {stockStatus.label}
            </p>
          </div>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        {isOutOfStock ? (
          <button
            disabled
            className="w-full bg-gray-300 text-gray-500 py-2 rounded-lg font-medium cursor-not-allowed"
          >
            Out of Stock
          </button>
        ) : (
          <Link
            href={`/product/${slug}`}
            className="block w-full bg-accent-500 hover:bg-accent-600 text-white py-2 rounded-lg font-medium text-center transition-colors"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
}
