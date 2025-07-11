import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

interface LockStatusResponse {
  success?: boolean;
  sucess?: boolean; // Handle potential typo in API response
  errorcode: number;
  message: string;
}

export function useUpdateLockStatusMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.updateLockStatus.mutationKey],
    mutationFn: ProfileService.updateLockStatus.request,
    onSuccess: async (response: LockStatusResponse) => {
      try {
        await queryClient.invalidateQueries({
          queryKey: [ProfileService.getProfile.queryKey],
        });
        // Use the message from the API response
        SnackbarUtils.success(response.message || 'Lock status updated successfully');
      } catch (error) {
        console.error('Failed to refresh profile:', error);
        SnackbarUtils.error('Failed to refresh profile');
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update lock status';
      SnackbarUtils.error(errorMessage);
    },
  });

  const onUpdateLockStatus = (data: { isLocked: boolean }) => {
    return mutation.mutate(data);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.updateLockStatus.mutationKey);

  return {
    onUpdateLockStatus,
    isLoading,
  };
}
