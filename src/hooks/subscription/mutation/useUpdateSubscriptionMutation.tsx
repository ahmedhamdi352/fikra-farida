import { useMutation } from '@tanstack/react-query';
import { SubscriptionService } from 'api/services';
import { subscriptionForCreateDTO } from 'types';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useUpdateSubscriptionMutation() {
  const mutation = useMutation({
    mutationKey: [SubscriptionService.updateSubscription.mutationKey],
    mutationFn: SubscriptionService.updateSubscription.request,
    onSuccess: response => {
      if (!response.sucess) {
        SnackbarUtils.error(response.message || 'Failed to send message');
        return;
      }
      SnackbarUtils.success('Thank You for Reaching out we will return to you Soon');
    },
  });

  const onUpdateSubscription = (payload: subscriptionForCreateDTO) => {
    return mutation.mutate(payload);
  };

  return {
    ...mutation,
    isLoading: mutation.isPending,
    onUpdateSubscription,
  };
}
