/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';


export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.updateProfile.mutationKey],
    mutationFn: ProfileService.updateProfile.request,
    onSuccess: async (response: any) => {
      try {
        if (response.sucess) {
          await queryClient.invalidateQueries({
            queryKey: [ProfileService.getProfile.queryKey],
          });
          // Use the message from the API response
          SnackbarUtils.success(response.message || 'Profile updated successfully');
        } else {
          SnackbarUtils.error(response.message || 'Failed to update profile');
        }
      } catch (error) {
        console.error('Failed to update profile:', error);
        SnackbarUtils.error('Failed to update profile');
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update profile';
      SnackbarUtils.error(errorMessage);
    },
  });

  const onUpdateProfile = (data: any) => {
    return mutation.mutate(data);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.updateProfile.mutationKey);

  return {
    onUpdateProfile,
    isLoading,
  };
}
