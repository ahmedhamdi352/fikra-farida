/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';


export function useUpdateEmailMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.updateEmail.mutationKey],
    mutationFn: ProfileService.updateEmail.request,
    onSuccess: async (response: any) => {
      try {
        if (response.sucess) {
          await queryClient.invalidateQueries({
            queryKey: [ProfileService.getProfile.queryKey],
          });
          // Use the message from the API response
          SnackbarUtils.success(response.message || 'Email updated successfully');
        } else {
          SnackbarUtils.error(response.message || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Failed to update email:', error);
        SnackbarUtils.error('Failed to update profile');
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update profile';
      SnackbarUtils.error(errorMessage);
    },
  });

  const onUpdateEmail = (data: any) => {
    return mutation.mutate(data);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.updateEmail.mutationKey);

  return {
    onUpdateEmail,
    isLoading,
  };
}
