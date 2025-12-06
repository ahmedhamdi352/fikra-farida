'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from 'types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLinkQRToProductMutation } from 'hooks/profile/mutations';

interface ProductCardProps {
  product: Product;
  qrKey?: string;
}

export function ProductCard({ product, qrKey }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const selectedColor = product.colors[0];
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const productName = locale === 'ar' ? product.arName || product.name : product.name;
  
  const { linkQrCode, isLoading } = useLinkQRToProductMutation();
  
  const handleProductClick = (e: React.MouseEvent) => {
    if (qrKey) {
      e.preventDefault();
      setShowModal(true);
    }
  };
  
  const handleCreateNewAccount = () => {
    router.push(`/register?product=${encodeURIComponent(product.name)}${qrKey ? `&key=${qrKey}` : ''}`);
  };
  
  const handleConnectWithExistingAccount = () => {
    if (qrKey) {
      linkQrCode({
        key: qrKey,
        productId: product.name
      });
      // After linking, redirect to profile or home page
      router.push('/profile');
    }
  };

  return (
    <>
      <Link
        href={`/register?product=${encodeURIComponent(product.name)}`}
        className="block bg-transparent rounded-lg shadow-xl overflow-hidden relative group h-full"
        onClick={handleProductClick}
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
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
    
    {/* Account Options Modal */}
    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <h3 className="text-xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
            I Already Have An Account
          </h3>
          
          <div className="space-y-4">
            <button
              onClick={handleCreateNewAccount}
              className="w-full py-3 px-4 bg-white text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Create a new account
            </button>
            
            <button
              onClick={handleConnectWithExistingAccount}
              className="w-full py-3 px-4 bg-[#FFC700] text-black rounded-lg hover:bg-[#E5B000] transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect with my account'}
            </button>
            
            <button
              onClick={() => setShowModal(false)}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
