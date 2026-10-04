/**
 * Category Card Component
 * Displays category with image and link
 */

import Link from 'next/link';
import Image from 'next/image';

interface CategoryCardProps {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  productCount?: number;
}

export default function CategoryCard({ name, slug, description, image_url, productCount }: CategoryCardProps) {
  return (
    <Link
      href={`/products?category=${slug}`}
      className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Category Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary-900 to-accent-500 overflow-hidden">
        {image_url ? (
          <Image
            src={image_url}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300 opacity-80"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white">
            <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        {/* Category Name Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-accent-400 transition-colors">
            {name}
          </h3>
          {productCount !== undefined && (
            <p className="text-sm text-gray-200">
              {productCount} {productCount === 1 ? 'Product' : 'Products'}
            </p>
          )}
        </div>
      </div>

      {/* Description (if provided) */}
      {description && (
        <div className="p-4">
          <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        </div>
      )}
    </Link>
  );
}
