'use client';

import { Product } from 'types';
import { ProductCard } from './ProductCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation'

interface ProductsContentProps {
  products: Product[];
  totalPages: number;
}

export function ProductsContent({ products, totalPages }: ProductsContentProps) {
  const searchParams = useSearchParams()
  const params = useParams();
  const locale = params.locale as string;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const page = searchParams.get('page')
    setCurrentPage(page ? parseInt(page) : 1)

  }, [searchParams])

  // Recalculate items per page based on screen size
  const itemsPerPage = 20
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="border border-[var(--main-color1)] rounded-[5px] p-6 mb-8">
          {/* Products Grid */}
          <div className="grid grid-cols-2  lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {displayedProducts.map((product, index) => (
              <div key={`index-${index}`} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <Link
                href={`/products?page=${currentPage - 1}`}
                className={`p-2 rounded-full transition-colors ${currentPage === 1
                  ? 'pointer-events-none text-gray-500'
                  : 'text-yellow-500 hover:bg-white/5'
                  }`}
                aria-label="Previous page"
              >
                <svg
                  className={`w-6 h-6 ${locale === 'ar' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>

              {Array.from({ length: totalPages }).map((_, index) => (
                <Link
                  key={index}
                  href={`/products?page=${index + 1}`}
                  className={`w-8 h-8 rounded-full transition-colors flex items-center justify-center ${currentPage === index + 1
                    ? 'bg-yellow-500 text-black'
                    : 'text-white hover:bg-white/5'
                    }`}
                >
                  {index + 1}
                </Link>
              ))}

              <Link
                href={`/products?page=${currentPage + 1}`}
                className={`p-2 rounded-full transition-colors ${currentPage === totalPages
                  ? 'pointer-events-none text-gray-500'
                  : 'text-yellow-500 hover:bg-white/5'
                  }`}
                aria-label="Next page"
              >
                <svg
                  className={`w-6 h-6 ${locale === 'ar' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
