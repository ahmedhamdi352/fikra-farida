'use client';

import Image from 'next/image';
import { Product } from 'types';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const selectedColor = product.colors[0];
  const params = useParams();
  const locale = params.locale as string;
  const productName = locale === 'ar' ? product.arName || product.name : product.name;

  return (
    <Link
      href={`/register?product=${encodeURIComponent(product.name)}`}
      className="block bg-transparent rounded-lg shadow-xl overflow-hidden relative group h-full"
    >
      <div className="flex flex-col h-full">

        <div className="relative w-full pt-[100%] md:pt-[60%] rounded-t-[15px]  bg-white shadow-2xl border border-[#F4DD94]/50">
          <div className="absolute inset-0 transition-transform duration-300">
            {selectedColor?.Media[0] ? (
              <Image
                src={selectedColor.Media[0]}
                alt={productName}
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
              <h2 className="text-center text-[var(--main-color1)] text-xs md:text-base font-medium md:line-clamp-2 truncate md:leading-normal"> {productName}</h2>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
