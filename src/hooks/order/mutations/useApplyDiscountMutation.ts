import { useMutation } from '@tanstack/react-query';
import { OrderService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import { ApplyDiscountParams, DiscountResponse } from 'types';
import SnackbarUtils from 'utils/SnackbarUtils';
import { useTranslations } from 'next-intl';

export function useApplyDiscountMutation() {
  const t = useTranslations('Payment');

  const mutation = useMutation<DiscountResponse, Error, ApplyDiscountParams>({
    mutationKey: [OrderService.discount.mutationKey],
    mutationFn: OrderService.discount.request,
    onSuccess: response => {
      if (!response.isValid) {
        SnackbarUtils.error(response.message || t('invalidDiscount'));
        return;
      }
    },
  });

  const onApplyDiscount = async (payload: ApplyDiscountParams) => {
    const response = await mutation.mutateAsync(payload);
    return response;
  };

  const { isLoading } = useIsLoadingMutation(OrderService.discount.mutationKey);

  return {
    ...mutation,
    isLoading,
    onApplyDiscount,
  };
}
