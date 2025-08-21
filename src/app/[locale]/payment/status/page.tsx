'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BsCheckCircleFill } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import { TiCancel } from 'react-icons/ti';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from 'context/CartContext';

interface PaymentDetails {
  paymentStatus: string;
  cardDataToken?: string;
  maskedCard?: string;
  merchantOrderId: string;
  orderId: string;
  cardBrand?: string;
  orderReference?: string;
  transactionId: string;
  amount: string;
  currency: string;
  mode: string;
  signature?: string;
}

export default function PaymentStatusPage() {
  const t = useTranslations('Payment');
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const { clearCart } = useCart();
  useEffect(() => {
    // Get all query parameters
    const params = Object.fromEntries(searchParams.entries());
    const {
      paymentStatus,
      cardDataToken,
      maskedCard,
      merchantOrderId,
      orderId,
      cardBrand,
      orderReference,
      transactionId,
      amount,
      currency,
      mode,
      signature
    } = params;

    // Store payment details
    setPaymentDetails({
      paymentStatus,
      cardDataToken,
      maskedCard,
      merchantOrderId,
      orderId,
      cardBrand,
      orderReference,
      transactionId: transactionId || orderId,
      amount,
      currency,
      mode: mode || 'CASH', // Default to CASH if not provided
      signature
    });

    if (paymentDetails?.paymentStatus === 'SUCCESS') {
      clearCart();
    }

  }, [searchParams]);


  if (!paymentDetails) {
    return null;
  }

  const getStatusConfig = () => {
    switch (paymentDetails.paymentStatus) {
      case 'SUCCESS':
        clearCart();
        return {
          icon: <BsCheckCircleFill className="text-[#FEC400] text-6xl" />,
          title: paymentDetails.mode === 'CASH' ? t('cashPaymentSuccessful') : t('paymentSuccessful'),
          message: paymentDetails.mode === 'CASH'
            ? t('cashPaymentSuccessMessage')
            : t('onlinePaymentSuccessMessage'),
          orderDetails: true
        };
      case 'FAILED':
        return {
          icon: <BiErrorCircle className="text-red-500 text-6xl" />,
          title: t('paymentFailed'),
          message: t('paymentFailureMessage'),
          orderDetails: false
        };
      default:
        return {
          icon: <TiCancel className="text-gray-400 text-6xl" />,
          title: t('paymentCancelled'),
          message: t('paymentCancelMessage'),
          orderDetails: false
        };
    }
  };

  const { icon, title, message, orderDetails } = getStatusConfig();

  return (
    <div className="h-full flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full bg-white/20 shadow-2xl rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">{icon}</div>
          <h1 className="text-2xl font-bold  mb-4">{title}</h1>
          <p className="text-gray-400">{message}</p>
        </div>

        {orderDetails && (
          <div className="border-t border-gray-700 pt-6 mb-8">
            <h2 className="text-lg font-semibold  mb-4">
              {t('orderDetails')}
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('orderNumber')}</span>
                <span>{paymentDetails.merchantOrderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('amount')}</span>
                <span>
                  {(Number(paymentDetails.amount)).toLocaleString('en-US', {
                    style: 'currency',
                    currency: paymentDetails.currency
                  })}
                </span>
              </div>
              {paymentDetails.mode === 'CASH' ? (
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('paymentMethod')}</span>
                  <span >{t('cashOnDelivery')}</span>
                </div>
              ) : paymentDetails.cardBrand && (
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('paymentMethod')}</span>
                  <span >
                    {paymentDetails.cardBrand} {paymentDetails.maskedCard}
                  </span>
                </div>
              )}
              {paymentDetails.mode !== 'CASH' && (
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('transactionId')}</span>
                  <span >{paymentDetails.transactionId}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {paymentDetails.paymentStatus === 'FAILED' && (
            <Link
              href="/payment"
              locale={searchParams.get('locale') || 'ar'}
              className="inline-block bg-[#FEC400] font-semibold px-6 py-3 rounded-lg hover:bg-[#FEC400]/90 transition-colors w-full text-center"
            >
              {t('tryAgain')}
            </Link>
          )}
          <Link
            href="/"
            locale={searchParams.get('locale') || 'ar'}
            className="inline-block bg-transparent border border-[#FEC400] font-semibold px-6 py-3 rounded-lg hover:bg-[#FEC400]/90 transition-colors w-full text-center"
          >
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
