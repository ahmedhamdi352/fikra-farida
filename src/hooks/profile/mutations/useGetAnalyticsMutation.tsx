import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useGetAnalyticsMutation() {

  const mutation = useMutation({
    mutationKey: [ProfileService.getAnalytics.mutationKey],
    mutationFn: ProfileService.getAnalytics.request,
    // onSuccess: async () => {
    //   try {

    //     SnackbarUtils.success('Group deleted successfully');
    //   } catch (err) {
    //     console.error('Failed to refresh groups list:', err);
    //     SnackbarUtils.error('Failed to refresh groups list');
    //   }
    // },
    onError: () => {
      SnackbarUtils.error('Failed to get analytics');
    },
  });

  const onGetAnalytics = (payload: { StartDate: string; EndDate: string }) => {
    return mutation.mutate(payload);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getAnalytics.mutationKey);

  return {
    ...mutation,
    isLoading,
    onGetAnalytics,
  };
}
