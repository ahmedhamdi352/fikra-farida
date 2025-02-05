'use client';
import { useTranslations } from 'next-intl';
import { useCart } from 'context/CartContext';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextInput from 'components/forms/text-input';
import TextArea from 'components/forms/text-area';

interface PaymentFormData {
  fullName: string;
  email: string;
  country: string;
  city: string;
  governorate: string;
  address: string;
  phone: string;
  note: string;
  paymentMethod: 'card' | 'wallet';
  cardNumber: string;
  cardExpiry: string;
  cvv: string;
  cardName: string;
  walletPhone: string;
}

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().optional().email('Invalid email format'),
  country: yup.string().required('Country is required'),
  city: yup.string().required('City is required'),
  governorate: yup.string().required('Governorate is required'),
  address: yup.string().required('Address is required'),
  phone: yup.string().required('Phone is required'),
  note: yup.string().default(''),
  paymentMethod: yup.string().oneOf(['card', 'wallet'] as const).required(),
  cardNumber: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('Card number is required'),
    otherwise: (schema) => schema.default('')
  }),
  cardExpiry: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('Card expiry is required'),
    otherwise: (schema) => schema.default('')
  }),
  cvv: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('CVV is required'),
    otherwise: (schema) => schema.default('')
  }),
  cardName: yup.string().when('paymentMethod', {
    is: 'card',
    then: (schema) => schema.required('Card name is required'),
    otherwise: (schema) => schema.default('')
  }),
  walletPhone: yup.string().when('paymentMethod', {
    is: 'wallet',
    then: (schema) => schema.required('Wallet phone number is required'),
    otherwise: (schema) => schema.default('')
  })
}) as yup.ObjectSchema<PaymentFormData>;

const PaymentPage = () => {
  const t = useTranslations('Payment');
  const { items, updateQuantity } = useCart();
  const params = useParams();
  const locale = params.locale as string;

  const {
    control,
    handleSubmit,
    watch,
  } = useForm<PaymentFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      paymentMethod: 'card'
    }
  });

  const paymentMethod = watch('paymentMethod');

  const total = items.reduce((sum, item) => sum + (parseFloat(item.finalPrice || item.price) * item.quantity), 0);
  const shippingCost = 349;
  const finalTotal = total + shippingCost;

  const onSubmit = (data: PaymentFormData) => {
    console.log(data);
    // Handle payment submission
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:py-10">
        {/* Left Column - Form */}
        <div className="space-y-6">
          <div className="lg:hidden rounded-[10px] bg-[rgba(217,217,217,0.05)] p-6 space-y-4 shadow-[0px_0px_0px_1px_rgba(217,217,217,0.50)] backdrop-blur-[25px] mb-6">
            <h2 className="text-xl font-semibold">{t('orderSummary')}</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[#FEC400]">
                <span>Subtotal :</span>
                <span className="text-white">{(total - shippingCost).toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between items-center text-[#FEC400]">
                <span>Shipping :</span>
                <span className="text-white">{shippingCost.toFixed(2)} EGP</span>
              </div>
              <div className="h-[1px] bg-white/10 my-2"></div>
              <div className="flex justify-between items-center text-[#FEC400]">
                <span>Total :</span>
                <span className="text-white text-xl font-medium">{finalTotal.toFixed(2)} EGP</span>
              </div>
            </div>
          </div>

          <form id="payment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <div className="grid grid-cols-3 gap-4">
                <TextInput
                  control={control}
                  name="country"
                  placeholder={t('country')}
                  icon={
                    <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  }
                />
                <TextInput
                  control={control}
                  name="city"
                  placeholder={t('city')}
                  icon={
                    <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm0-4H5V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z" />
                    </svg>
                  }
                />
                <TextInput
                  control={control}
                  name="governorate"
                  placeholder={t('governorate')}
                  icon={
                    <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  }
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
              <TextInput
                control={control}
                name="phone"
                type="tel"
                placeholder={t('phone')}
                icon={
                  <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                }
              />
              <TextArea
                control={control}
                name="note"
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

              <div className="space-y-4">
                <div className="flex gap-4">
                  <label
                    className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${paymentMethod === 'card' ? 'border-[#FEC400]' : 'border-gray-600'}`}
                  >
                    <input
                      type="radio"
                      {...control.register('paymentMethod')}
                      value="card"
                      className="hidden"
                    />
                    <span className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'card' ? 'bg-[#FEC400] border-[#FEC400]' : 'border-gray-600'}`} />
                    {t('card')}
                  </label>
                  <label
                    className={`flex items-center gap-2 p-3 border rounded-md cursor-pointer ${paymentMethod === 'wallet' ? 'border-[#FEC400]' : 'border-gray-600'}`}
                  >
                    <input
                      type="radio"
                      {...control.register('paymentMethod')}
                      value="wallet"
                      className="hidden"
                    />
                    <span className={`w-4 h-4 rounded-full border-2 ${paymentMethod === 'wallet' ? 'bg-[#FEC400] border-[#FEC400]' : 'border-gray-600'}`} />
                    {t('wallet')}
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <TextInput
                      control={control}
                      name="cardNumber"
                      placeholder={t('cardNumber')}
                      icon={
                        <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v6z" />
                        </svg>
                      }
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        control={control}
                        name="cardExpiry"
                        placeholder="MM/YY"
                        icon={
                          <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                        }
                      />
                      <TextInput
                        control={control}
                        name="cvv"
                        placeholder="CVV"
                        icon={
                          <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                          </svg>
                        }
                      />
                    </div>
                    <TextInput
                      control={control}
                      name="cardName"
                      placeholder={t('cardName')}
                      icon={
                        <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      }
                    />
                  </div>
                )}

                {paymentMethod === 'wallet' && (
                  <div className="space-y-4">
                    <TextInput
                      control={control}
                      name="walletPhone"
                      type="tel"
                      placeholder={t('walletPhone')}
                      icon={
                        <svg className="w-5 h-5 text-[#FEC400]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                        </svg>
                      }
                    />
                  </div>
                )}
              </div>
            </section>
          </form>
          <button
            type="submit"
            form="payment-form"
            className="w-full py-3 bg-[#FEC400] text-black font-semibold rounded-[10px] hover:bg-[#FEC400]/90 transition-colors lg:hidden"
          >
            {t('pay')} {finalTotal.toFixed(2)} EGP
          </button>
        </div>

        {/* Right Column - Order Summary */}
        <div className="hidden lg:block rounded-[10px] bg-[rgba(217,217,217,0.05)] p-6 space-y-4 shadow-[0px_0px_0px_1px_rgba(217,217,217,0.50)] backdrop-blur-[25px] max-h-[calc(100vh-4rem)] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/20 [&::-webkit-scrollbar-thumb]:bg-[#FEC400]/80 [&::-webkit-scrollbar-thumb]:rounded-full">
          <h2 className="text-xl font-semibold">{t('orderSummary')}</h2>
          <div className="flex-1 overflow-y-auto my-4 pr-2 scrollbar-thin scrollbar-thumb-[#FEC400] scrollbar-track-transparent">
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
                        <span className="text-lg font-bold">{(price * item.quantity).toFixed(2)} EGP</span>
                        {item.finalPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {(parseFloat(item.price) * item.quantity).toFixed(2)} EGP
                          </span>
                        )}
                      </div>

                    </div>

                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1 h-fit">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="text-[#FEC400] w-8 h-8 flex items-center justify-center hover:bg-black/20 rounded"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
              <span>Subtotal :</span>
              <span className="text-white">{(total - shippingCost).toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between items-center text-[#FEC400]">
              <span>Shipping :</span>
              <span className="text-white">{shippingCost.toFixed(2)} EGP</span>
            </div>
            <div className="h-[1px] bg-white/10 my-4"></div>
            <div className="flex justify-between items-center text-[#FEC400]">
              <span>Total :</span>
              <span className="text-white text-xl font-medium">{finalTotal.toFixed(2)} EGP</span>
            </div>
          </div>

          <button
            type="submit"
            form="payment-form"
            className="w-full py-3 bg-[#FEC400] text-black font-semibold rounded-[10px] hover:bg-[#FEC400]/90 transition-colors"
          >
            {t('pay')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
