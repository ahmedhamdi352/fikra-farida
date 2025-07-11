import { useQuery } from '@tanstack/react-query';
import { ProfileService } from 'api';

export function useGetProfilesQuery() {
  const query = useQuery({
    queryKey: [ProfileService.getProfiles.queryKey],
    queryFn: async () => {
      try {
        const response = await ProfileService.getProfiles.request();
        return response;
      } catch (error) {
        console.error('Profiles fetch error:', error);
        throw error;
      }
    },
  });

  const onGetProfiles = () => {
    try {
      query.refetch();
    } catch (error) {
      console.error('Error triggering profiles fetch:', error);
    }
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    onGetProfiles,
  };
}
