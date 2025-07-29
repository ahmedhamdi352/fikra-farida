import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';
import { useQueryClient } from '@tanstack/react-query';

export function useDeleteConnectionMutation() {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.deleteConnection.mutationKey],
    mutationFn: ProfileService.deleteConnection.request,
    onSuccess: async response => {
      if (!response.sucess) {
        SnackbarUtils.error('Failed to delete connection');
        return;
      }
      queryClient.invalidateQueries({
        queryKey: [ProfileService.getConnections.mutationKey],
      });
      SnackbarUtils.success('Connection Deleted Successfully');
    },
  });

  const onDeleteConnection = (payload: { ConnectionId: number }) => {
    return mutation.mutate(payload);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.deleteConnection.mutationKey);

  return {
    ...mutation,
    isLoading,
    onDeleteConnection,
  };
}
