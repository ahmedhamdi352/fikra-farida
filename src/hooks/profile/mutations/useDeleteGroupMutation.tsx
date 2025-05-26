import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.deleteGroup.mutationKey],
    mutationFn: ProfileService.deleteGroup.request,
    onSuccess: async () => {
      try {
        // Invalidate and refetch the groups list
        await queryClient.invalidateQueries({
          queryKey: [ProfileService.getGroups.mutationKey],
        });
        SnackbarUtils.success('Group deleted successfully');
      } catch (err) {
        console.error('Failed to refresh groups list:', err);
        SnackbarUtils.error('Failed to refresh groups list');
      }
    },
    onError: () => {
      SnackbarUtils.error('Failed to delete group');
    },
  });

  const onDeleteGroup = (payload: number) => {
    return mutation.mutate(payload);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.deleteGroup.mutationKey);

  return {
    ...mutation,
    isLoading,
    onDeleteGroup,
  };
}
