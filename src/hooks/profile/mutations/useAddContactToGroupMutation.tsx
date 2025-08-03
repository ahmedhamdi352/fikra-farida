import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useAddContactToGroupMutation() {

  const mutation = useMutation({
    mutationKey: [ProfileService.addContactToGroup.mutationKey],
    mutationFn: ProfileService.addContactToGroup.request,
    onSuccess: async () => {
      SnackbarUtils.success('Contact added to group successfully');
    },
  });

  const onAddContactToGroup = (payload: { groupId: number, connectionId: number }) => {
    return mutation.mutate(payload);
  };


  return {
    ...mutation,
    isLoading: mutation.isPending,
    onAddContactToGroup,
  };
}
