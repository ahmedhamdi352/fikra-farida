'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from 'types';
import ShoppingCard from 'assets/icons/ShoppingProduct.svg';
import { useCart } from 'context/CartContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const selectedColor = product.colors[selectedColorIndex];
  const { addToCart, removeFromCart, items } = useCart();
  const params = useParams();
  const locale = params.locale as string;

  const isOutOfStock = product.Categories.some(
    category => category.Code === 'Out of Stock'
  );

  const isInCart = items.some(item =>
    item.id === product?.id &&
    item.selectedColorIndex === selectedColorIndex
  );

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;

    setIsAnimating(true);
    if (isInCart) {
      removeFromCart(product.id, selectedColorIndex);
    } else {
      addToCart(product, 1, selectedColorIndex);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="block bg-transparent rounded-lg shadow-xl overflow-hidden relative group h-full"
    >
      <div className="flex flex-col h-full">

        {/* Image Section */}
        <div className="relative w-full pt-[100%] md:pt-[60%] rounded-t-[15px]  bg-white shadow-2xl border border-[#F4DD94]/50">
          <div className={`absolute inset-0 transition-transform duration-300 ${isAnimating ? 'animate-bounce-once' : ''}`}>
            {/* Product Labels */}
            <div className=" absolute left-2 rtl:right-2 rtl:left-auto md:left-2 md:rtl:right-2 md:rtl:left-auto top-1 md:top-3 z-10 inline-flex items-center space-x-1 rtl:space-x-reverse">

              {product.Categories
                .filter(category => category.IsLabel)
                .slice(0, 2)
                .map((category) => (
                  <div
                    key={category.PK}
                    className="text-[6px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 font-bold text-white rounded-md"
                    style={{ backgroundColor: category.LabelColorCode }}
                  >
                    {locale === 'en' ? category.Name : category.NameAr}
                  </div>
                ))}
            </div>

            {selectedColor?.Media[0] ? (
              <Image
                src={selectedColor.Media[0]}
                alt={product.name}
                fill
                className="object-contain p-2 md:p-4"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400 text-xs md:text-sm">No image</span>
              </div>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col p-2.5 md:p-4 rounded-b-[10px]
          bg-white border-t border-[#F4DD94]/20 shadow-lg
          dark:border dark:border-white/10 dark:shadow-xl dark:bg-gradient-to-tr dark:from-[rgba(217,217,217,0.05)] dark:from-[4.53%] dark:to-[rgba(115,115,115,0.05)] dark:to-[92.45%] dark:backdrop-blur-[10px] dark:bg-white/5">
          {/* Header */}
          <div className='flex justify-between items-start gap-2'>
            <div className="flex-1 min-w-0 mb-2 md:mb-3">
              <h2 className="text-[10px] md:text-sm text-gray-400 mb-0.5 truncate">{product.id}</h2>
              <div className="text-xs md:text-base font-medium md:line-clamp-2 truncate md:leading-normal">
                {locale === 'ar' ? product.arName || product.name : product.name}
              </div>
            </div>
            <button
              onClick={handleCartClick}
              className={`relative flex-shrink-0 transition-all duration-300 p-1.5 rounded-full -mt-1 ${isOutOfStock
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-110 hover:bg-white/5'
                }`}
              title={isOutOfStock ? 'Out of stock' : isInCart ? 'Remove from cart' : 'Add to cart'}
              disabled={isOutOfStock}
            >
              {isInCart && !isOutOfStock && (
                <span className="absolute -top-1 -right-1 w-2 md:w-2.5 h-2 md:h-2.5 bg-[#FEC400] rounded-full animate-fadeIn" />
              )}
              <Image
                src={ShoppingCard}
                alt={isOutOfStock ? 'Out of stock' : isInCart ? 'Remove from cart' : 'Add to cart'}
                className={`w-4 md:w-5 h-4 md:h-5 transition-transform duration-300 ${isOutOfStock ? 'opacity-50' : ''}`}
              />
            </button>
          </div>

          {/* Rating */}
          {/* <div className="flex items-center gap-0.5 mb-2 md:mb-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <svg key={index} className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="#FEC400">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
              </svg>
            ))}
            {Array.from({ length: 2 }).map((_, index) => (
              <svg key={`empty-${index}`} className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="#9CA3AF">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
              </svg>
            ))}
          </div> */}

          {/* Price and Actions */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1 md:gap-2 min-w-0">
              <span className="text-base md:text-xl font-bold truncate">{product.finalPrice}</span>
              {product.price !== "0" && (
                <span className="text-[10px] md:text-sm text-gray-400 line-through truncate">
                  {product.price}
                </span>
              )}
            </div>
            {/* Color Options */}
            {product.colors.length > 1 && (
              <div className="flex items-center gap-2 md:gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColorIndex(index);
                    }}
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-full transition-all
                      ${selectedColorIndex === index ? 'ring-2 ring-[#FEC400] scale-110' : 'ring-1 ring-gray-200'}
                      ${color.value.toLowerCase() === '#ffffff' || color.value.toLowerCase() === 'white'
                        ? 'ring-1 ring-gray-300 border border-gray-200'
                        : 'border border-transparent'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
