'use client';
import { useTranslations } from 'next-intl';
import { useCart } from 'context/CartContext';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextInput from 'components/forms/text-input';
import Select from 'components/forms/select';
import TextArea from 'components/forms/text-area';
import Link from 'next/link'
import { PhoneInput } from 'components/forms/phone-input';
import { useState, useEffect } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useCreateOrderMutation } from 'hooks';
import { OrderPayloadForCreateDto } from 'types';
import { useSiteData } from 'context/SiteContext';
import { getCityNames, type EgyptCity } from 'assets/constants/cities';
import { getShippingPrice, getZoneInfo } from 'assets/constants/shipping';

interface PaymentFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: EgyptCity;
  country: string;
  notes?: string;
  paymentMethod: 'online' | 'cash';
}

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
  city: yup.string<EgyptCity>().required('City is required'),
  country: yup.string().required('Country is required'),
  notes: yup.string(),
  paymentMethod: yup.string().oneOf(['online', 'cash']).required(),
}) satisfies yup.ObjectSchema<PaymentFormData>;

const PaymentPage = () => {
  const t = useTranslations('Payment');
  const { items, updateQuantity } = useCart();
  const { isLoading, onCreateOrder } = useCreateOrderMutation()
  const params = useParams();
  const locale = params.locale as string;
  const siteData = useSiteData();

  const [isLoadingOnline, setIsLoadingOnline] = useState(false);
  const [error, setError] = useState('');
  const [shippingInfo, setShippingInfo] = useState<{ zoneName: string; price: number } | null>(null);

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<PaymentFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      paymentMethod: 'online',
      country: siteData.name
    }
  });

  const paymentMethod = watch('paymentMethod');

  const selectedCity = watch('city');
  useEffect(() => {
    if (selectedCity) {
      setShippingInfo(getZoneInfo(selectedCity));
    } else {
      setShippingInfo(null);
    }
  }, [selectedCity]);

  const total = items.reduce((sum, item) => {
    const itemPrice = parseFloat(item.finalPrice || item.price);
    const itemTotal = itemPrice * item.quantity;
    return sum + itemTotal;
  }, 0);

  const hasFreeShipping = items.some(item =>
    item.Categories?.some(cat => cat.Code === 'Free Shipping')
  );

  const subtotal = total;
  const shippingCost = hasFreeShipping ? 0 : (shippingInfo ? shippingInfo.price : getShippingPrice(selectedCity));
  const finalTotal = subtotal + shippingCost;
  const discount = 0;


  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="bg-[rgba(217,217,217,0.05)] p-8 rounded-lg shadow-[0px_0px_0px_1px_rgba(217,217,217,0.50)] backdrop-blur-[25px]">
            <svg className="w-20 h-20 mx-auto mb-6 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <h2 className="text-2xl font-semibold mb-4">{t('cartEmpty')}</h2>
            <p className="text-gray-400 mb-8">{t('cartEmptyMessage')}</p>
            <Link
              href={`/products`}
              className="inline-block py-3 px-6 bg-[#FEC400] text-black font-semibold rounded-lg hover:bg-[#FEC400]/90 transition-colors"
            >
              {t('browseProducts')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: PaymentFormData) => {
    try {
      // Prepare order data
      const orderData: OrderPayloadForCreateDto = {
        total: finalTotal,
        subTotal: subtotal,
        discount: discount,
        shipping: shippingCost,
        activeStep: 3,
        totalItems: items.length,
        status: paymentMethod === 'cash' ? 'success' : 'pending',
        items: items.map(item => ({
          name: item.name,
          colors: item.colors[item.selectedColorIndex].name,
          price: parseFloat(item.finalPrice || item.price),
          quantity: item.quantity
        })),
        billing: {
          name: data.fullName,
          address: data.address,
          phoneNumber: data.phone,
          email: data.email
        },
        countryCode: locale,
        domain: window.location.hostname
      };

      if (paymentMethod === 'cash') {
        // For cash payment, just create the order
        await onCreateOrder(orderData);
      } else {
        // For online payment, first create the order then initiate payment
        setIsLoadingOnline(true);

        // Create order first
        const orderResponse = await onCreateOrder(orderData);

        if (!orderResponse?.orderId) {
          throw new Error(t('orderCreationFailed'));
        }

        // Then initiate online payment
        const response = await fetch('/api/kashier/initiate-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: finalTotal,
            currency: 'EGP',
            orderId: orderResponse.orderId,
            email: data.email,
            firstName: data.fullName.split(' ')[0],
            lastName: data.fullName.split(' ').slice(1).join(' '),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Payment failed');
        }

        const result = await response.json();

        if (result.redirectUrl) {
          // Redirect to Kashier's payment page
          window.location.href = result.redirectUrl;
        } else if (result.error) {
          throw new Error(result.error);
        } else {
          throw new Error('Invalid payment response');
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Payment failed. Please try again.');
      }
    } finally {
      setIsLoadingOnline(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:py-10">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="lg:hidden rounded-[10px] bg-[rgba(217,217,217,0.05)] p-6 space-y-4 shadow-[0px_0px_0px_1px_rgba(217,217,217,0.50)] backdrop-blur-[25px] mb-6">
            <h2 className="text-xl font-semibold">{t('orderSummary')}</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[#FEC400]">
                <span>{t('subtotal')} :</span>
                <span>{(subtotal).toFixed(2)} {siteData.currency}</span>
              </div>
              {!hasFreeShipping && (
                <div className="flex justify-between items-center text-[#FEC400]">
                  <span>{t('shipping')} :</span>
                  <span>{shippingCost.toFixed(2)} {siteData.currency}</span>
                </div>
              )}
              <div className="h-[1px] bg-white/10 my-2"></div>
              <div className="flex justify-between items-center  text-[#FEC400]">
                <span>{t('total')} :</span>
                <span className=" text-xl font-medium">{finalTotal.toFixed(2)} {siteData.currency}</span>
              </div>
            </div>
          </div>

          <form noValidate id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">{t('personalInformation')}</h2>
              <TextInput
                control={control}
                name="fullName"
                placeholder={t('fullName')}
                icon={
                  <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                }
              />
              <TextInput
                control={control}
                name="email"
                type="email"
                placeholder={t('email')}
                icon={
                  <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                }
              />
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">{t('deliveryInformation')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <TextInput
                  control={control}
                  name="country"
                  placeholder={t('country')}
                  disabled
                  icon={
                    <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  }
                />

                <Select
                  control={control}
                  name="city"
                  placeholder={t('city')}
                  options={getCityNames().map(city => ({ value: city, label: city }))}
                  icon={
                    <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm0-4H5V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
                    </svg>
                  }
                  required
                />
              </div>
              <TextInput
                control={control}
                name="address"
                placeholder={t('address')}
                icon={
                  <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                }
              />

              <PhoneInput
                name="phone"
                control={control}
                required
                defaultCountry={siteData.code.toLocaleLowerCase() || 'eg'}
                placeholder={t('phone')}
                disableDropdown={true}
              />
              <TextArea
                control={control}
                name="notes"
                placeholder={t('note')}
                icon={
                  <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                }
              />
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">{t('paymentInformation')}</h2>
              <p className="text-sm text-gray-400">{t('secureTransaction')}</p>

              <div className="space-y-2">

                <label
                  className={`flex items-center w-full p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'online'
                    ? 'border-[#FEC400] bg-[rgba(254,196,0,0.1)]'
                    : 'border-gray-600 hover:border-[#FEC400]/50'
                    }`}
                >
                  <input
                    type="radio"
                    {...control.register('paymentMethod')}
                    value="online"
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mx-3 flex items-center justify-center ${paymentMethod === 'online'
                    ? 'border-[#FEC400]'
                    : 'border-gray-600'
                    }`}>
                    {paymentMethod === 'online' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FEC400]" />
                    )}
                  </div>
                  <span className="text-gray-300">{t('onlinePayment')}</span>
                  <div className="flex items-center gap-1 rtl:mr-auto ltr:ml-auto">
                    <Image src="/visa.png" alt="Visa" width={35} height={22} className="object-contain" />
                    <Image src="/mastercard.png" alt="Mastercard" width={35} height={22} className="object-contain" />
                    <Image src="/mada.png" alt="Mada" width={35} height={22} className="object-contain" />
                  </div>
                </label>

                <label
                  className={`flex items-center w-full p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cash'
                    ? 'border-[#FEC400] bg-[rgba(254,196,0,0.1)]'
                    : 'border-gray-600 hover:border-[#FEC400]/50'
                    }`}
                >
                  <input
                    type="radio"
                    {...control.register('paymentMethod')}
                    value="cash"
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 mx-3 flex items-center justify-center ${paymentMethod === 'cash'
                    ? 'border-[#FEC400]'
                    : 'border-gray-600'
                    }`}>
                    {paymentMethod === 'cash' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FEC400]" />
                    )}
                  </div>
                  <span className="text-gray-300">{t('cashOnDelivery')}</span>
                  <div className="flex items-center gap-1 rtl:mr-auto ltr:ml-auto">
                    <FaMoneyBillWave className="text-[#FEC400] text-2xl" />
                  </div>
                </label>
              </div>
            </section>
          </form>
          <button
            type="submit"
            form="payment-form"
            disabled={isLoading || isLoadingOnline}
            className="w-full py-3 bg-[#FEC400] text-black font-semibold rounded-[10px] hover:bg-[#FEC400]/90 transition-colors disabled:bg-gray-400"
          >
            {(isLoading || isLoadingOnline) ? t('processing') : t('pay')} {finalTotal.toFixed(2)} EGP
          </button>
        </div>

        {/* Right Column - Order Summary */}
        <div className="hidden lg:block rounded-[10px] bg-[rgba(217,217,217,0.05)] p-6 space-y-4 shadow-[0px_0px_0px_1px_rgba(217,217,217,0.50)] backdrop-blur-[25px] max-h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-[#FEC400]/80 [&::-webkit-scrollbar-thumb]:rounded-full">
          <h2 className="text-xl font-semibold">{t('orderSummary')}</h2>
          <div className="flex-1 overflow-y-auto my-4 p-2 scrollbar-thin scrollbar-thumb-[#FEC400] scrollbar-track-transparent">
            {items.map((item) => {
              const price = parseFloat(item.finalPrice || item.price);
              const selectedColor = item.colors[item.selectedColorIndex];

              return (
                <div
                  key={item.id}
                  className="rounded-[10px] bg-[rgba(217,217,217,0.05)] p-4 relative shadow-[0px_0px_0px_1px_rgba(217,217,217,0.50)] backdrop-blur-[25px] mb-4 last:mb-0"
                >
                  <div className="flex gap-4">
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

                    <Link href={`/products/${item.id}`} className="flex-1">
                      <p className="text-[#FEC400] text-sm mb-1">{item.id}</p>
                      <h3 className="text-lg font-semibold mb-2">
                        {locale === 'en' ? item.name : item.arName}
                      </h3>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{(price * item.quantity).toFixed(2)} EGP</span>
                          {item.finalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              {(parseFloat(item.price) * item.quantity).toFixed(2)} EGP
                            </span>
                          )}
                        </div>
                        {item.colors.length > 1 && (
                          <div
                            className="w-5 h-5 rounded-full border border-[#FEC400] scale-110"
                            style={{ backgroundColor: selectedColor.value }}
                            title={selectedColor.name}
                          />
                        )}
                      </div>

                    </Link>

                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1 h-fit">
                      <button
                        onClick={() => updateQuantity(item.id, item.selectedColorIndex, Math.max(1, item.quantity - 1))}
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
              );
            })}
          </div>

          <div className="border-t border-[rgba(217,217,217,0.50)] pt-4 space-y-2 mt-auto">
            <div className="flex justify-between items-center text-[#FEC400]">
              <span>{t('subtotal')} :</span>
              <span >{(subtotal).toFixed(2)} {siteData.currency}</span>
            </div>
            {!hasFreeShipping && (
              <div className="flex justify-between items-center text-[#FEC400]">
                <span>{t('shipping')} :</span>
                <span >{shippingCost.toFixed(2)} {siteData.currency}</span>
              </div>
            )}
            <div className="h-[1px] bg-white/10 my-4"></div>
            <div className="flex justify-between items-center text-[#FEC400]">
              <span>{t('total')} :</span>
              <span className="text-xl font-medium">{finalTotal.toFixed(2)} {siteData.currency}</span>
            </div>
          </div>

          {/* <button
            type="submit"
            form="payment-form"
            disabled={isLoading || isLoadingOnline}
            className="w-full py-3 bg-[#FEC400] text-black font-semibold rounded-[10px] hover:bg-[#FEC400]/90 transition-colors disabled:bg-gray-400"
          >
            {(isLoading || isLoadingOnline) ? t('processing') : t('pay')} {finalTotal.toFixed(2)} EGP
          </button> */}
        </div>
      </div>
    </div >
  );
};

export default PaymentPage;
