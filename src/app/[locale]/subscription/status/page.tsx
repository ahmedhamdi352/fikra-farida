'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { BsCheckCircleFill } from 'react-icons/bs';
import { BiErrorCircle } from 'react-icons/bi';
import { TiCancel } from 'react-icons/ti';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { useUpdateSubscriptionMutation } from 'hooks';

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
  signature?: string;
}

export default function PaymentStatusPage() {
  const t = useTranslations('Payment');
  const searchParams = useSearchParams();
  // const { onUpdateSubscription, isLoading } = useUpdateSubscriptionMutation();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
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
      signature,
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
      signature,
    });

  }, [searchParams]);


  if (!paymentDetails) {
    return null;
  }


  const getStatusConfig = () => {
    switch (paymentDetails.paymentStatus) {
      case 'SUCCESS':
        return {
          icon: <BsCheckCircleFill className="text-[#FEC400] text-6xl" />,
          title: 'Welcome to Pro plan',
          message: 'Your subscription has been activated successfully',
          orderDetails: true
        };
      case 'FAILED':
        return {
          icon: <BiErrorCircle className="text-red-500 text-6xl" />,
          title: 'Payment Failed',
          message: 'Your subscription has not been activated successfully',
          orderDetails: false
        };
      default:
        return {
          icon: <TiCancel className="text-gray-400 text-6xl" />,
          title: 'Payment Cancelled',
          message: 'Your subscription has not been activated successfully',
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
                <span className="text-gray-400">{t('amount')}</span>
                <span>
                  {(Number(paymentDetails.amount)).toLocaleString('en-US', {
                    style: 'currency',
                    currency: paymentDetails.currency
                  })}
                </span>
              </div>


            </div>
          </div>
        )}

        <div className="space-y-4">
          {paymentDetails.paymentStatus === 'FAILED' && (
            <Link
              href="/profile"
              locale={searchParams.get('locale') || 'ar'}
              className="inline-block bg-[#FEC400] font-semibold px-6 py-3 rounded-lg hover:bg-[#FEC400]/90 transition-colors w-full text-center"
            >
              {t('tryAgain')}
            </Link>
          )}
          <Link
            href="/profile"
            locale={searchParams.get('locale') || 'ar'}
            className="inline-block bg-transparent border border-[#FEC400] font-semibold px-6 py-3 rounded-lg hover:bg-[#FEC400]/90 transition-colors w-full text-center"
          >
            {t('backToProfile')}
          </Link>
        </div>
      </div>
    </div>
  );
}
