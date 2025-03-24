import { useMutation } from '@tanstack/react-query';
import { OrderService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import { useTranslations } from 'next-intl';
import { OrderPayloadForCreateDto } from 'types';
import SnackbarUtils from 'utils/SnackbarUtils';
import { useRouter } from 'next/navigation';
import { useCart } from 'context/CartContext';

export function useCreateOrderMutation() {
  const t = useTranslations('Payment');
  const router = useRouter();
  const { clearCart } = useCart();

  const mutation = useMutation({
    mutationKey: [OrderService.order.mutationKey],
    mutationFn: OrderService.order.request,
    onSuccess: response => {
      if (response.status === 'success') {
        clearCart();
        const searchParams = new URLSearchParams({
          paymentStatus: 'SUCCESS',
          merchantOrderId: response.orderId,
          orderId: response.orderId,
          amount: (response.total * 100).toString(), // Convert to cents as expected by the status page
          currency: 'EGP',
          mode: 'CASH',
          transactionId: response.orderId,
        });
        router.push(`/payment/status?${searchParams.toString()}`);
        return;
      }
      if (!response.orderId) {
        SnackbarUtils.error(t('orderCreationFailed'));
        return;
      }
    },
  });

  const onCreateOrder = async (payload: OrderPayloadForCreateDto) => {
    const response = await mutation.mutateAsync(payload);
    return response;
  };

  const { isLoading } = useIsLoadingMutation(OrderService.order.mutationKey);

  return {
    ...mutation,
    isLoading,
    onCreateOrder,
  };
}
