import { useQuery } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

export function useGetProfileQuery() {
  const query = useQuery({
    queryKey: [ProfileService.getProfile.mutationKey],
    queryFn: async () => {
      try {
        const response = await ProfileService.getProfile.request();
        console.log(response);
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

  const { isLoading } = useIsLoadingMutation(ProfileService.getProfile.mutationKey);
  console.log(query);
  return {
    data: query.data,
    isLoading,
    error: query.error,
    onGetProfile,
  };
}
