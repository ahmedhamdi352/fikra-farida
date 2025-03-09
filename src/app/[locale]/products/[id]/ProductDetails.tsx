'use client';

import { Product } from 'types';
import Image from 'next/image';
import { useCart } from 'context/CartContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

interface ProductDetailsProps {
  products: Product[];
  id: string;
  params?: {
    locale: string;
  };
}

export function ProductDetails({ products, id, params }: ProductDetailsProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [originalQuantity, setOriginalQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { addToCart, removeFromCart, items, updateQuantity } = useCart();
  const locale = params?.locale as string;
  const router = useRouter();
  const t = useTranslations('products');


  useEffect(() => {
    if (products?.length > 0) {
      const decodedId = decodeURIComponent(id);
      const foundProduct = products.find(p => p.id === decodedId);
      setProduct(foundProduct || null);
      setSelectedImageIndex(0); // Reset image index when product changes

      // Set quantity from cart if item exists with current color
      const cartItem = items.find(item =>
        item.id === decodedId &&
        item.selectedColorIndex === selectedColorIndex
      );
      if (cartItem) {
        setQuantity(cartItem.quantity);
        setOriginalQuantity(cartItem.quantity);
      } else {
        setQuantity(1);
        setOriginalQuantity(1);
      }
    }
  }, [products, id, items, selectedColorIndex]);

  const isInCart = items.some(item =>
    item.id === product?.id &&
    item.selectedColorIndex === selectedColorIndex
  );
  const hasQuantityChanged = quantity !== originalQuantity;

  const isOutOfStock = product?.Categories.some(
    category => category.Code === 'Out of Stock'
  );

  const handleCartClick = () => {
    if (!product || isOutOfStock) return;

    if (isInCart) {
      removeFromCart(product.id, selectedColorIndex);
      setQuantity(1);
      setOriginalQuantity(1);
    } else {
      addToCart(product, quantity, selectedColorIndex);
      setOriginalQuantity(quantity);
    }
  };

  const handleUpdateCart = () => {
    if (!product || isOutOfStock) return;
    updateQuantity(product.id, selectedColorIndex, quantity);
    setOriginalQuantity(quantity);
  };

  const handleColorChange = (index: number) => {
    setSelectedColorIndex(index);
    // Reset quantity when switching colors unless it's in cart
    const cartItem = items.find(
      item => item.id === product?.id && item.selectedColorIndex === index
    );
    if (cartItem) {
      setQuantity(cartItem.quantity);
      setOriginalQuantity(cartItem.quantity);
    } else {
      setQuantity(1);
      setOriginalQuantity(1);
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setSelectedImageIndex(prev =>
        prev < selectedColor.Media.length - 1 ? prev + 1 : 0
      );
    }

    if (isRightSwipe) {
      setSelectedImageIndex(prev =>
        prev > 0 ? prev - 1 : selectedColor.Media.length - 1
      );
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-[400px] bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  const selectedColor = product.colors[selectedColorIndex];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row lg:gap-12 gap-2">
        {/* Left Side - Product Images */}
        <div className="flex-1">
          {/* Main Image */}
          <div
            className="relative aspect-square lg:h-[500px] rounded-lg overflow-hidden bg-white shadow-2xl  mb-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Product Labels */}
            <div className="absolute left-5 rtl:right-5 top-5 md:left-5 md:top-3 z-10 inline-flex items-center space-x-1 rtl:space-x-reverse">
              {product.Categories
                .filter(category => category.IsLabel)
                .slice(0, 2)
                .map((category) => (
                  <div
                    key={category.PK}
                    className="text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 font-bold rounded-md"
                    style={{ backgroundColor: category.LabelColorCode }}
                  >
                    {locale === 'en' ? category.Name : category.NameAr}
                  </div>
                ))}
            </div>
            <Image
              src={selectedColor.Media[selectedImageIndex]}
              alt={`${params?.locale === 'en' ? product.name : product.arName} - View ${selectedImageIndex + 1}`}
              fill
              className="object-contain p-4"
              priority
              draggable={false}
            />
            {/* Mobile Swipe Navigation */}
            <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2 lg:hidden">
              {(locale === 'ar' ? [...selectedColor.Media].reverse() : selectedColor.Media).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(locale === 'ar' ? selectedColor.Media.length - 1 - index : index)}
                  className={`w-2 h-2 rounded-full transition-all ${selectedImageIndex === (locale === 'ar' ? selectedColor.Media.length - 1 - index : index)
                    ? 'bg-[#FEC400] w-4'
                    : 'bg-gray-400'
                    }`}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Thumbnail Grid */}
          <div className="hidden lg:grid grid-cols-4 gap-2 max-w-[80%] mx-auto">
            {selectedColor.Media.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-24 h-24 rounded-lg overflow-hidden bg-black/30 border-2 transition-all duration-300 ${selectedImageIndex === index ? 'border-[#FEC400] scale-110 shadow-lg z-10' : 'border-transparent hover:border-gray-600'
                  }`}
              >
                <Image
                  src={image}
                  alt={`${params?.locale === 'en' ? product.name : product.arName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="flex-1">
          {/* Title and Rating */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">
              {params?.locale === 'en' ? product.name : product.arName}
            </h1>
          </div>

          {/* Colors */}
          {product.colors.length > 1 && (
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">{t('colors')}</h3>
                <div className="flex gap-3">
                  {product.colors.map((color, index) => {
                    const colorInCart = items.some(
                      item => item.id === product.id && item.selectedColorIndex === index
                    );
                    return (
                      <button
                        key={color.name}
                        onClick={() => handleColorChange(index)}
                        className={`relative w-8 h-8 rounded-full border-2 transition-all ${selectedColorIndex === index ? 'border-[#FEC400] scale-110' : 'border-white'
                          }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      >
                        {colorInCart && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {/* Model Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{t('model')}</h3>
              <div>
                <button className="px-4 py-2 rounded-full bg-[#FEC400] text-sm">
                  {product.id}
                </button>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">{t('quantity')}</h3>
              <div className="flex items-center bg-black/70 dark:bg-black/20 rounded-lg p-1">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className={`text-[#FEC400] w-8 h-8 flex items-center justify-center rounded ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/20'
                    }`}
                  disabled={isOutOfStock}
                >
                  -
                </button>
                <span className="w-8 text-center  text-white">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className={`text-[#FEC400] w-8 h-8 flex items-center justify-center rounded ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black/20'
                    }`}
                  disabled={isOutOfStock}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isInCart && hasQuantityChanged ? (
              <button
                onClick={handleUpdateCart}
                className={`flex-1 py-3 bg-green-500 text-white rounded-lg transition-colors ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                disabled={isOutOfStock}
              >
                {t('updateCart')}
              </button>
            ) : (
              <button
                onClick={handleCartClick}
                className={`flex-1 py-3 ${isInCart ? 'bg-red-500' : 'bg-[#FEC400]'}
                  text-white rounded-lg transition-colors ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? t('outOfStock') : isInCart ? t('removeFromCart') : t('addToCart')}
              </button>
            )}
            {!isOutOfStock && (
              <button
                onClick={() => {
                  if (isOutOfStock) return;
                  if (!isInCart) {
                    addToCart(
                      product,
                      quantity,
                      selectedColorIndex
                    );
                  }
                  router.push('/checkout');
                }}
                className='flex-1 py-3 bg-[#FEC400] text-white rounded-lg'
              >
                {t('buyNow')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mt-8 lg:mt-12 text-white">
        <div className="flex justify-between items-center border-b border-gray-700 relative">
          <div className="flex items-center relative z-10">
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="flex gap-8 px-2 py-2 border-b-2 border-[#FEC400] text-[#FEC400]">
              {t('description')}

              <svg
                className={`w-6 h-6 transform transition-transform ${isDescriptionExpanded ? 'rotate-45' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>

        </div>
        <div className={`transition-all duration-300 overflow-hidden ${isDescriptionExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="prose prose-invert max-w-none py-6">
            <p className="dark:text-gray-400 text-gray-600 text-sm lg:text-base">
              {params?.locale === 'en' ? product.description : product.arDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
