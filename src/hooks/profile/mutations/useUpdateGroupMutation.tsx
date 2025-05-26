import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.updateGroup.mutationKey],
    mutationFn: ProfileService.updateGroup.request,
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({
          queryKey: [ProfileService.getGroups.mutationKey],
        });
        SnackbarUtils.success('Group updated successfully');
      } catch (error) {
        console.error('Failed to refresh groups list:', error);
        SnackbarUtils.error('Failed to refresh groups list');
      }
    },
    onError: () => {
      SnackbarUtils.error('Failed to update group');
    },
  });

  const onUpdateGroup = (payload: { GroupId: number } & Record<string, unknown>) => {
    return mutation.mutate(payload);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.updateGroup.mutationKey);

  return {
    onUpdateGroup,
    isLoading,
  };
}
