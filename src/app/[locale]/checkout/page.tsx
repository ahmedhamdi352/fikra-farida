'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from 'context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, removeFromCart, updateQuantity } = useCart();
  // const [discountCode, setDiscountCode] = useState('');
  const [total, setTotal] = useState(0);
  const params = useParams();
  const router = useRouter();
  const t = useTranslations('checkout');
  const tPayment = useTranslations('Payment');

  const locale = params.locale as string;

  useEffect(() => {
    const total = items.reduce((sum, item) => {
      const itemPrice = parseFloat(item.finalPrice || item.price);
      const itemTotal = itemPrice * item.quantity;
      return sum + itemTotal;
    }, 0);
    const subtotal = total;
    setTotal(subtotal);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="bg-[rgba(217,217,217,0.05)] p-8 rounded-lg shadow-[0px_0px_0px_1px_rgba(217,217,217,0.50)] backdrop-blur-[25px]">
            <svg className="w-20 h-20 mx-auto mb-6 text-[#FEC400]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <h2 className="text-2xl font-semibold mb-4">{tPayment('cartEmpty')}</h2>
            <p className="text-gray-400 mb-8">{tPayment('cartEmptyMessage')}</p>
            <Link
              href={`/collections`}
              className="inline-block py-3 px-6 bg-[#FEC400] text-black font-semibold rounded-lg hover:bg-[#FEC400]/90 transition-colors"
            >
              {tPayment('browseProducts')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-auto py-12">
      <div className="flex flex-col gap-8 ">
        <div className="flex-1">
          <div className="hidden lg:grid grid-cols-5 gap-4 mb-4">
            <div className="col-span-2">{t('productName')}</div>
            <div>{t('unitPrice')}</div>
            <div>{t('quantity')}</div>
            <div>{t('total')}</div>
          </div>
          <div className="hidden lg:block w-full h-[1px] bg-[rgba(254,196,0,0.50)] mb-8"></div>

          <div className="max-h-[calc(70vh-10rem)] h-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-[#FEC400]/80 [&::-webkit-scrollbar-thumb]:rounded-full border border-[--main-color1] rounded-lg p-4">
            {items.map((item) => {
              const price = parseFloat(item.finalPrice || item.price);
              const selectedColor = item.colors[item.selectedColorIndex];

              return (
                <div
                  key={item.id}
                  className="bg-gradient-to-tr from-[rgba(217,217,217,0.05)] from-[4.53%] to-[rgba(115,115,115,0.05)] to-[92.45%] backdrop-blur-[10px] border border-white/10 rounded-lg p-4 mb-4 relative"
                >
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedColorIndex)}
                    className={`absolute top-0 ${locale === 'ar' ? 'left-1' : 'right-1'} flex items-center justify-center w-6 h-6 hover:bg-black text-[#FEC400] rounded-md`}
                  >
                    ×
                  </button>

                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 relative flex-shrink-0">
                        {selectedColor?.Media[0] ? (
                          <Image
                            src={selectedColor.Media[0]}
                            alt={locale === 'en' ? item.name : item.arName}
                            fill
                            className="object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-400 text-sm">{t('noImage')}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-[#FEC400] text-sm mb-1">{item.id}</p>
                        <h3 className="text-lg font-semibold mb-2">
                          {locale === 'en' ? item.name : item.arName}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{(price * item.quantity).toFixed(2)} </span>
                          {item.finalPrice && (
                            <span className="text-gray-400 line-through text-sm">{(parseFloat(item.price) * item.quantity).toFixed(2)} </span>
                          )}
                        </div>
                        {item.colors.length > 1 && (
                          <div className="flex items-center gap-2 mt-4">
                            <div
                              className="w-5 h-5 rounded-full border border-[#FEC400] scale-[1.2] origin-center"
                              style={{ backgroundColor: selectedColor.value }}
                              title={selectedColor.name}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-end">
                      <div className="flex items-center gap-2 text-white bg-black/50 dark:bg-white/20 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColorIndex, item.quantity - 1)}
                          className="text-[#FEC400] w-8 h-8 flex items-center justify-center hover:bg-black/20 rounded"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColorIndex, item.quantity + 1)}
                          className="text-[#FEC400] w-8 h-8 flex items-center justify-center hover:bg-black/20 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:grid grid-cols-5 gap-4 items-center">
                    <div className="col-span-2 flex items-center gap-4">
                      <div className="w-20 h-20 relative">
                        {selectedColor?.Media[0] ? (
                          <Image
                            src={selectedColor.Media[0]}
                            alt={locale === 'en' ? item.name : item.arName}
                            fill
                            className="object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-400 text-sm">{t('noImage')}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[#FEC400] text-sm mb-1">{item.id}</p>
                        <h3 className="text-lg font-semibold">{locale === 'en' ? item.name : item.arName}</h3>
                        {item.colors.length > 1 && (
                          <div className="flex items-center gap-2 mt-2">
                            <div
                              className="w-5 h-5 rounded-full border border-[#FEC400] scale-110"
                              style={{ backgroundColor: selectedColor.value }}
                              title={selectedColor.name}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-white">{price.toFixed(2)}</div>
                    <div className="flex items-center gap-2  rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColorIndex, item.quantity - 1)}
                        className="text-[#FEC400] w-8 h-8 flex items-center justify-center  bg-black/50 dark:bg-white/20 hover:bg-black/20 rounded"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColorIndex, item.quantity + 1)}
                        className="text-[#FEC400] w-8 h-8 flex items-center justify-center  bg-black/50 dark:bg-white/20 hover:bg-black/20 rounded"
                      >
                        +
                      </button>
                    </div>
                    <div>{(price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full self-end lg:w-[500px] h-fit sticky top-8 card-container p-6">
          {/* <div className="flex items-center gap-4 mb-6 w-full">
            <input
              type="text"
              placeholder={t('discountCode')}
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="bg-[rgba(217,217,217,0.05)] border border-white/10 rounded-lg px-4 py-3  flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-[var(--main-color1)] focus:border-transparent placeholder:text-gray-400"
            />
            <button className="shrink-0 px-6 py-3 rounded-lg text-black bg-[var(--main-color1)] hover:bg-transparent  dark:hover:text-white border border-[var(--main-color1)] transition-colors">
              {t('apply')}
            </button>
          </div> */}

          <div className="space-y-4 text-[#FEC400]">
            {/* <div className="flex justify-between items-center">
              <span>{t('subtotal')}</span>
              <span className="dark:text-white text-black">{(total).toFixed(2)} </span>
            </div> */}

            <div className="h-[1px] bg-white/10 my-4"></div>
            <div className="flex justify-between items-center">
              <span>{t('subtotal')}</span>
              <span className="dark:text-white text-black text-xl font-medium">{total.toFixed(2)} </span>
            </div>
          </div>

          <button
            onClick={() => router.push('/payment')}
            className="w-full mt-8 py-4 bg-[#FEC400] text-black text-lg font-medium hover:bg-[#FEC400]/90 rounded-lg">
            {t('checkout')}
          </button>
        </div>
      </div>
    </div>
  );
}