/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';


export function useUpdateUserVisitsMutation() {

  const mutation = useMutation({
    mutationKey: [ProfileService.updateUserVisits.mutationKey],
    mutationFn: ProfileService.updateUserVisits.request,
    onSuccess: async (response: any) => {
      try {
      } catch (error) {
        console.error('Failed to update user visits:', error);
        SnackbarUtils.error('Failed to update user visits');
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update user visits';
      SnackbarUtils.error(errorMessage);
    },
  });

  const onUpdateUserVisits = (data: any) => {
    return mutation.mutate(data);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.updateUserVisits.mutationKey);

  return {
    onUpdateUserVisits,
    isLoading,
  };
}
