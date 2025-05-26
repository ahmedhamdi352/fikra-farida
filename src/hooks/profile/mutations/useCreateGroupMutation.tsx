import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import { GroupForCreateDTO } from 'types';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.addGroup.mutationKey],
    mutationFn: ProfileService.addGroup.request,
    onSuccess: async response => {
      if (!response) {
        SnackbarUtils.error('Failed to create group');
        return;
      }

      // Invalidate and refetch the groups list
      await queryClient.invalidateQueries({
        queryKey: [ProfileService.getGroups.mutationKey],
      });

      SnackbarUtils.success('Group Created Successfully');
    },
  });

  const onAddGroup = (payload: GroupForCreateDTO) => {
    return mutation.mutate(payload);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.addGroup.mutationKey);

  return {
    ...mutation,
    isLoading,
    onAddGroup,
  };
}
