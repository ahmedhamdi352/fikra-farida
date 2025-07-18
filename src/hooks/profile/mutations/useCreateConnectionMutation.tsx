import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import { ConnectionForCreateDTO } from 'types';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useCreateConnectionMutation() {

  const mutation = useMutation({
    mutationKey: [ProfileService.addConnection.mutationKey],
    mutationFn: ProfileService.addConnection.request,
    onSuccess: async response => {
      if (!response) {
        SnackbarUtils.error('Failed to create connection');
        return;
      }

      SnackbarUtils.success('Connection Created Successfully');
    },
  });

  const onAddConnection = (payload: ConnectionForCreateDTO) => {
    return mutation.mutate(payload);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.addConnection.mutationKey);

  return {
    ...mutation,
    isLoading,
    onAddConnection,
  };
}
