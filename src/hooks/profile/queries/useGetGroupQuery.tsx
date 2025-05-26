import { useQuery } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

export function useGetGroupQuery() {
  const query = useQuery({
    queryKey: [ProfileService.getGroups.mutationKey],
    queryFn: async () => {
      try {
        const response = await ProfileService.getGroups.request();
        return response;
      } catch (error) {
        console.error('groups fetch error:', error);
        throw error;
      }
    },
  });

  const onGetGroups = () => {
    try {
      query.refetch();
    } catch (error) {
      console.error('Error triggering groups fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getGroups.mutationKey);

  return {
    data: query.data,
    isLoading,
    error: query.error,
    onGetGroups,
  };
}
