'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from 'context/CartContext';
import { Button } from 'components';
import { useParams, useRouter } from 'next/navigation';


export default function CheckoutPage() {
  const { items, removeFromCart, updateQuantity } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [total, setTotal] = useState(0);
  const params = useParams();
  const router = useRouter();

  const locale = params.locale as string;
  const shipping = 349;

  useEffect(() => {
    const subtotal = items.reduce((acc, item) => {
      const price = parseFloat(item.finalPrice || item.price);
      return acc + price * item.quantity;
    }, 0);
    setTotal(subtotal + shipping);
  }, [items, shipping]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg p-6 text-white text-center">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <Button href="/products">Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-auto py-12">
      <div className="flex flex-col gap-8 ">
        <div className="flex-1">
          <div className="hidden lg:grid grid-cols-5 gap-4 mb-4">
            <div className="col-span-2">PRODUCT NAME</div>
            <div>UNIT PRICE</div>
            <div>QUANTITY</div>
            <div>TOTAL</div>
          </div>
          <div className="hidden lg:block w-full h-[1px] bg-[rgba(254,196,0,0.50)] mb-8"></div>

          <div className="max-h-[calc(70vh-10rem)] h-auto overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-[#FEC400]/80 [&::-webkit-scrollbar-thumb]:rounded-full">
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
                            <span className="text-gray-400 text-sm">No image</span>
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
                      <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
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
                            alt={item.name}
                            fill
                            className="object-contain rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
                            <span className="text-gray-400 text-sm">No image</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-[#FEC400] text-sm mb-1">{item.id}</p>
                        <h3 className="text-lg font-semibold">{item.name}</h3>
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
                    <div className="flex items-center gap-2 rounded-lg p-1">
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
                    <div >{(price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full self-end lg:w-[500px] h-fit sticky top-8 bg-gradient-to-tr from-[rgba(217,217,217,0.05)] from-[4.53%] to-[rgba(115,115,115,0.05)] to-[92.45%] backdrop-blur-[10px] border border-white/10 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6 w-full">
            <input
              type="text"
              placeholder="Discount Code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="bg-[rgba(217,217,217,0.05)] border border-white/10 rounded-lg px-4 py-3  flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-[var(--main-color1)] focus:border-transparent placeholder:text-gray-400"
            />
            <button className="shrink-0 px-6 py-3 rounded-lg bg-[#4A4A4A]  hover:bg-[#4A4A4A]/90 transition-colors">
              Apply
            </button>
          </div>

          <div className="space-y-4 text-[#FEC400]">
            <div className="flex justify-between items-center">
              <span>Subtotal :</span>
              <span className="text-white">{(total - shipping).toFixed(2)} </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping :</span>
              <span className="text-white">{shipping.toFixed(2)} </span>
            </div>
            <div className="h-[1px] bg-white/10 my-4"></div>
            <div className="flex justify-between items-center">
              <span>Total :</span>
              <span className="text-white text-xl font-medium">{total.toFixed(2)} </span>
            </div>
          </div>

          <button
            onClick={() => router.push('/payment')}
            className="w-full mt-8 py-4 bg-[#FEC400] text-black text-lg font-medium hover:bg-[#FEC400]/90 rounded-lg">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}