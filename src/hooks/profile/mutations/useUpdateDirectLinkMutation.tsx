import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

interface DirectLinkResponse {
  success?: boolean;
  sucess?: boolean; // Handle potential typo in API response
  errorcode: number;
  message: string;
}

export function useUpdateDirectLinkMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.updateDirectLink.mutationKey],
    mutationFn: ProfileService.updateDirectLink.request,
    onSuccess: async (response: DirectLinkResponse) => {
      try {
        await queryClient.invalidateQueries({
          queryKey: [ProfileService.getProfile.mutationKey],
        });
        // Use the message from the API response
        SnackbarUtils.success(response.message || 'Direct link updated successfully');
      } catch (error) {
        console.error('Failed to refresh profile:', error);
        SnackbarUtils.error('Failed to refresh profile');
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update direct link';
      SnackbarUtils.error(errorMessage);
    },
  });

  const onUpdateDirectLink = (data: { directurl: string }) => {
    return mutation.mutate(data);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.updateDirectLink.mutationKey);

  return {
    onUpdateDirectLink,
    isLoading,
  };
}
