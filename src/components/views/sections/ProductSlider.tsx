'use client';

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Product } from 'app/actions';
import { ProductCard } from './ProductCard';

interface ProductSliderProps {
  products: Product[];
}

export function ProductSlider({ products }: ProductSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const firstSixProducts = products.slice(0, 6);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(firstSixProducts.length / itemsPerPage);

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
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true
  });

  return (
    <div className="relative">
      <button
        onClick={prevSlide}
        className="hidden md:block absolute md:left-10 xl:left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10  hover:bg-black hover:bg-opacity-50 transition-colors"
        aria-label="Previous products"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="51" viewBox="0 0 50 51" fill="none">
          <path d="M29.1667 35.9168L18.75 25.5002L29.1667 15.0835V35.9168Z" fill="#FEC400" />
        </svg>
      </button>

      {/* Desktop View - 3 items per page */}
      <div className="hidden md:block overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
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

      {/* Mobile View - Single item with swipe */}
      <div {...handlers} className="md:hidden overflow-hidden max-w-full">
        <div
          className="transition-transform duration-300 ease-in-out max-w-full overflow-hidden"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            // width: `${firstSixProducts.length * 100}%`,
            display: 'flex'
          }}
        >
          {firstSixProducts.map((product) => (
            <div
              key={product.id}
              className="w-full max-w-full flex-shrink-0 px-2"
              style={{ width: "100%", }}
            >
              <div className="max-w-[90vw] mx-auto">
                <ProductCard product={product} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Arrow - Hidden on mobile */}
      <button
        onClick={nextSlide}
        className="hidden md:block absolute md:right-10 xl:right-0  top-1/2 -translate-y-1/2 translate-x-12 z-10  hover:bg-black hover:bg-opacity-50 transition-colors"
        aria-label="Next products"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="51" viewBox="0 0 50 51" fill="none">
          <path d="M20.8333 35.9168V15.0835L31.2499 25.5002L20.8333 35.9168Z" fill="#FEC400" />
        </svg>
      </button>

      {/* Page indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {Array.from({ length: window.innerWidth >= 768 ? totalPages : firstSixProducts.length }).map((_, index) => (
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
