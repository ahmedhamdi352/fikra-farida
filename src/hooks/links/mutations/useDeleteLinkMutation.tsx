import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LinksService } from 'api/services/LinksService';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

/**
 * Hook for deleting a link
 */
export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [LinksService.deleteLink.mutationKey],
    mutationFn: LinksService.deleteLink.request,
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({
          queryKey: ['get-profile'],
        });
        SnackbarUtils.success('Link deleted successfully');
      } catch (error) {
        console.error('Failed to refresh profile after deleting link:', error);
      }
    },
  });

  const onDeleteLink = (pk: string | number) => {
    return mutation.mutate(pk);
  };

  const { isLoading } = useIsLoadingMutation(LinksService.deleteLink.mutationKey);

  return {
    onDeleteLink,
    isLoading,
  };
}
