import { useQuery } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

export function useGetProfileByKeyQuery(key: string) {
  const query = useQuery({
    queryKey: [ProfileService.getProfileByKey.mutationKey, key],
    queryFn: async () => {
      try {
        const response = await ProfileService.getProfileByKey.request(key);
        return response;
      } catch (error) {
        console.error('Profile by key fetch error:', error);
        throw error;
      }
    },
  });

  const onGetProfileByKey = () => {
    try {
      query.refetch();
    } catch (error) {
      console.error('Error triggering profile by key fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getProfileByKey.mutationKey);
  return {
    data: query.data,
    isLoading,
    error: query.error,
    onGetProfileByKey,
  };
}
