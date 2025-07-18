import { useQuery } from '@tanstack/react-query';
import { ProfileService } from 'api';
export function useGetProfileQuery() {
  const query = useQuery({
    queryKey: [ProfileService.getProfile.queryKey],
    queryFn: async () => {
      try {
        const response = await ProfileService.getProfile.request();
        return response;
      } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
    },
  });

  const onGetProfile = () => {
    try {
      query.refetch();
    } catch (error) {
      console.error('Error triggering profile fetch:', error);
    }
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    onGetProfile,
  };
}
