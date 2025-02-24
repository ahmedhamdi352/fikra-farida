'use client';

import { Product } from 'types';
import { ProductCard } from './ProductCard';
import { EmptyState } from './EmptyState';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';
import { useGetAllCategoriesMutation } from 'hooks';
import { useTranslations } from 'next-intl';

interface ProductsContentProps {
  products: Product[];
  totalPages: number;
}

export function ProductsContent({ products }: ProductsContentProps) {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations('products');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const { onGetCategories, getSelectOptions, isLoading: isCategoriesLoading } = useGetAllCategoriesMutation();

  useEffect(() => {
    const page = searchParams.get('page');
    setCurrentPage(page ? parseInt(page) : 1);
  }, [searchParams]);

  useEffect(() => {
    onGetCategories(locale);
  }, [locale]);

  // Recalculate items per page based on screen size
  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Filter products based on selected filter
  const filteredProducts = selectedCategory
    ? products.filter(product =>
      product.Categories.some(cat => cat.Code === selectedCategory)
    )
    : products;

  // Calculate total pages based on filtered products
  const totalFilteredPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const displayedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleCategorySelect = (categoryCode: string) => {
    setSelectedCategory(categoryCode);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        {/* Filters Section */}
        {!isCategoriesLoading && <div className="mb-8 flex flex-wrap items-center gap-4">
          {/* Categories Dropdown */}
          <div
            className="relative w-1/2"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                setIsOpen(false);
              }
            }}
          >
            <button
              type="button"
              className={`w-full md:w-64 h-[42px] px-4 rounded-lg  border border-[var(--main-color1)]
                hover:border-[var(--main-color1)] transition-colors duration-200 flex items-center justify-between
                focus:outline-none focus:ring-2 focus:ring-[var(--main-color1)] focus:ring-opacity-50
                ${isOpen ? 'border-[var(--main-color1)]' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              disabled={isCategoriesLoading}
            >
              <span className="truncate">
                {selectedCategory
                  ? getSelectOptions(locale).find(opt => opt.value === selectedCategory)?.label
                  : isCategoriesLoading
                    ? t('loading')
                    : t('allCategories')
                }
              </span>
              <svg
                className={`w-5 h-5 text-[var(--main-color1)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 dark:bg-[#3C3C3B] bg-white border border-[var(--main-color1)] rounded-lg shadow-lg max-h-60 overflow-auto">
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--main-color1)] hover:text-black transition-colors duration-150
                      ${!selectedCategory ? 'bg-[var(--main-color1)] bg-opacity-10' : ''}`}
                    onClick={() => {
                      handleCategorySelect('');
                    }}
                  >
                    {t('allCategories')}
                  </button>
                  {getSelectOptions(locale).map((option) => (
                    <button
                      key={option.value}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-[var(--main-color1)] hover:text-black transition-colors duration-150
                        ${selectedCategory === option.value ? 'bg-[var(--main-color1)] bg-opacity-10' : ''}`}
                      onClick={() => handleCategorySelect(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>}

        {/* Results count */}
        <div className="text-sm text-gray-400 mb-4">
          {t('showing')} {filteredProducts.length} {t('results')}
        </div>

        <div className="border border-[var(--main-color1)] rounded-[5px] p-6 mb-8">
          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {displayedProducts.map((product, index) => (
                  <div key={`index-${index}`} className="w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalFilteredPages > 1 && (
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

                  {Array.from({ length: totalFilteredPages }).map((_, index) => (
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
                    className={`p-2 rounded-full transition-colors ${currentPage === totalFilteredPages
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
            </>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
