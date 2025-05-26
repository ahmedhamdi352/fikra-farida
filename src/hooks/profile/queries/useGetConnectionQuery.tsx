import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

export function useGetConnectionQuery() {
  const mutation = useMutation({
    mutationKey: [ProfileService.getConnections.mutationKey],
    mutationFn: async () => {
      try {
        const response = await ProfileService.getConnections.request();
        return response;
      } catch (error) {
        console.error('Connection fetch error:', error);
        throw error;
      }
    },
  });

  const onGetConnections = () => {
    try {
      mutation.mutate();
    } catch (error) {
      console.error('Error triggering Connection fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getConnections.mutationKey);

  return {
    data: mutation.data,
    isLoading,
    error: mutation.error,
    onGetConnections,
  };
}
