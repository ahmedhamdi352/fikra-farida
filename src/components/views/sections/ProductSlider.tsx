'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Product } from 'types';
import { ProductCard } from './ProductCard';
import { useParams } from 'next/navigation';

interface ProductSliderProps {
  products: Product[];
}

export function ProductSlider({ products }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const firstSixProducts = products.slice(0, 6);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(firstSixProducts.length / itemsPerPage);
  const params = useParams();
  const locale = params.locale as string;
  const isRTL = locale === 'ar';

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      if (window.innerWidth >= 768) { // desktop view
        return prev + 1 >= totalPages ? 0 : prev + 1;
      }
      return prev === firstSixProducts.length - 1 ? 0 : prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      if (window.innerWidth >= 768) { // desktop view
        return prev === 0 ? totalPages - 1 : prev - 1;
      }
      return prev === 0 ? firstSixProducts.length - 1 : prev - 1;
    });
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (isRTL) {
        prevSlide();
      } else {
        nextSlide();
      }
    },
    onSwipedRight: () => {
      if (isRTL) {
        nextSlide();
      } else {
        prevSlide();
      }
    },
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 10,
    swipeDuration: 500,
  });

  return (
    <div className="relative max-w-full">
      <button
        onClick={prevSlide}
        className={`hidden md:block absolute ${isRTL ? 'md:right-10 xl:right-0 translate-x-12' : 'md:left-10 xl:left-0 -translate-x-12'} top-1/2 -translate-y-1/2 z-10 hover:bg-black hover:bg-opacity-50 transition-colors`}
        aria-label="Previous products"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="51"
          viewBox="0 0 50 51"
          fill="none"
          className={isRTL ? 'rotate-180' : ''}
        >
          <path d="M29.1667 35.9168L18.75 25.5002L29.1667 15.0835V35.9168Z" fill="#FEC400" />
        </svg>
      </button>

      {/* Desktop View - 3 items per page */}
      <div className="hidden md:block overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(${isRTL ? '' : '-'}${currentIndex * 100}%)`,
          }}
        >
          {/* First Page */}
          <div className="flex-shrink-0 w-full">
            <div className="grid grid-cols-3 gap-6">
              {firstSixProducts.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Second Page */}
          <div className="flex-shrink-0 w-full">
            <div className="grid grid-cols-3 gap-6">
              {firstSixProducts.slice(3, 6).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View with Swipe */}
      <div className="block md:hidden w-full">
        <div
          {...handlers}
          className="overflow-hidden w-full pb-3"
        >
          <div
            className="flex transition-transform duration-300 ease-in-out w-full"
            style={{
              transform: `translateX(${isRTL ? '' : '-'}${currentIndex * 40}%)`,
            }}
          >
            <div className={`flex w-[600%] ${isRTL ? 'flex-row-reverse' : ''}`}>
              {firstSixProducts.map((product) => (
                <div
                  key={product.id}
                  className="w-[16.666%] h-full"
                >
                  <div className="px-4 h-full">
                    <div className="h-full flex flex-col">
                      <ProductCard product={product} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Arrow - Hidden on mobile */}
      <button
        onClick={nextSlide}
        className={`hidden md:block absolute ${isRTL ? 'md:left-10 xl:left-0 -translate-x-12' : 'md:right-10 xl:right-0 translate-x-12'} top-1/2 -translate-y-1/2 z-10 hover:bg-black hover:bg-opacity-50 transition-colors`}
        aria-label="Next products"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="51"
          viewBox="0 0 50 51"
          fill="none"
          className={isRTL ? 'rotate-180' : ''}
        >
          <path d="M20.8333 35.9168V15.0835L31.2499 25.5002L20.8333 35.9168Z" fill="#FEC400" />
        </svg>
      </button>

      {/* Page indicators */}
      <div className="flex justify-center mt-4 gap-2 md:hidden">
        {Array.from({ length: firstSixProducts.length }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${currentIndex === index ? 'bg-yellow-500' : 'bg-gray-300'
              }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
