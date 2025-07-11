import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

interface CollectInfoResponse {
  success?: boolean;
  sucess?: boolean; // Handle potential typo in API response
  errorcode: number;
  message: string;
}

export function useUpdateCollectInfoMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.updateCollectInfo.mutationKey],
    mutationFn: ProfileService.updateCollectInfo.request,
    onSuccess: async (response: CollectInfoResponse) => {
      try {
        await queryClient.invalidateQueries({
          queryKey: [ProfileService.getProfile.queryKey],
        });
        // Use the message from the API response
        SnackbarUtils.success(response.message || 'Collect info updated successfully');
      } catch (error) {
        console.error('Failed to refresh profile:', error);
        SnackbarUtils.error('Failed to refresh profile');
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update collect info';
      SnackbarUtils.error(errorMessage);
    },
  });

  const onUpdateCollectInfo = (data: { autoconnect: boolean }) => {
    return mutation.mutate(data);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.updateCollectInfo.mutationKey);

  return {
    onUpdateCollectInfo,
    isLoading,
  };
}
