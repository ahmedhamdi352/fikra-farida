import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';
import { useQueryClient } from '@tanstack/react-query';

export function useUpdateBulkLinksSortMutation() {

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.updateBulkLinksSort.mutationKey],
    mutationFn: ProfileService.updateBulkLinksSort.request,
    onSuccess: async (response: unknown) => {
      if ((response as unknown as { sucess: boolean }).sucess) {
        await queryClient.invalidateQueries({
          queryKey: [ProfileService.getProfile.queryKey],
        });
      } else {
        SnackbarUtils.error((response as unknown as { message: string }).message || 'Failed to update links sort');
      }
    },
    onError: () => {
      SnackbarUtils.error('Failed to update links sort');
    },
  });

  const onUpdateBulkLinksSort = (payload: { pk: number; sort: number }[]) => {
    return mutation.mutate(payload);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.updateBulkLinksSort.mutationKey);

  return {
    ...mutation,
    isLoading,
    onUpdateBulkLinksSort,
  };
}
