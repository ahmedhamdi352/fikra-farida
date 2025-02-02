'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Product } from 'types';
import ShoppingCard from 'assets/icons/ShoppingProduct.svg';
import { useCart } from 'context/CartContext';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const selectedColor = product.colors[selectedColorIndex];
  const { addToCart, removeFromCart, items } = useCart();

  const isInCart = items.some(item => item.id === product.id);

  const handleCartClick = () => {
    setIsAnimating(true);
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product, selectedColorIndex);
    }
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <div className="bg-transparent rounded-lg overflow-hidden relative group">
      {/* Cart Status Indicator */}
      {isInCart && (
        <div className="absolute top-4 right-2 z-10">
          <div className="bg-[#FEC400] text-white text-xs px-2 py-1 rounded-full animate-fadeIn">
            In Cart
          </div>
        </div>
      )}

      {/* Image Section */}
      <div className={`relative h-[280px] w-full bg-white transition-transform duration-300 ${isAnimating ? 'animate-bounce-once' : ''}`}>
        {/* Product Label */}
        {product.label && (
          <div className="absolute left-0 top-4 z-10">
            <div className="bg-[#FEC400] text-white text-xs px-3 py-1.5 rounded-r-full font-medium">
              {product.label}
            </div>
          </div>
        )}

        {selectedColor?.Media[0] ? (
          <Image
            src={selectedColor.Media[0]}
            alt={product.name}
            fill
            className="object-contain p-4 "
            priority
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="text-white p-4 rounded-b-[10px] border border-white/10 shadow-xl bg-gradient-to-tr from-[rgba(217,217,217,0.05)] from-[4.53%] to-[rgba(115,115,115,0.05)] to-[92.45%] backdrop-blur-[10px]">
        {/* Header */}
        <div className='flex justify-between'>
          <div className="mb-4">
            <h2 className="text-sm text-gray-300 mb-1">{product.id}</h2>
            <div className="text-xl font-medium">{product.name} </div>
          </div>
          <button
            onClick={handleCartClick}
            className="relative transition-all duration-300 hover:scale-110 p-2 hover:bg-white/5 rounded-full"
            title={isInCart ? 'Remove from cart' : 'Add to cart'}
          >
            {isInCart && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FEC400] rounded-full animate-fadeIn" />
            )}
            <Image
              src={ShoppingCard}
              alt={isInCart ? 'Remove from cart' : 'Add to cart'}
              className="transition-transform duration-300"
            />
          </button>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <svg key={index} className="w-5 h-5" viewBox="0 0 24 24" fill="#FEC400">
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
            </svg>
          ))}
          {Array.from({ length: 2 }).map((_, index) => (
            <svg key={`empty-${index}`} className="w-5 h-5" viewBox="0 0 24 24" fill="#9CA3AF">
              <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
            </svg>
          ))}
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex justify-center items-center gap-2">
              <span className="text-2xl font-bold">{product.finalPrice}</span>
              {product.price !== "0" && (
                <span className="text-sm text-gray-400 line-through">{product.price}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Color Options */}
            {product.colors.length > 1 && (
              <div className="flex items-center gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColorIndex(index);
                    }}
                    className={`w-5 h-5 rounded-full border transition-all ${selectedColorIndex === index ? 'border-[#FEC400] scale-110' : 'border-white'
                      }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
