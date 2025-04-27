import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

export function useGetProfileQuery() {
  const mutation = useMutation({
    mutationKey: [ProfileService.getProfile.mutationKey],
    mutationFn: async () => {
      try {
        const response = await ProfileService.getProfile.request();
        return response;
      } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
    }
  });

  const onGetProfile = () => {
    try {
      mutation.mutate();
    } catch (error) {
      console.error('Error triggering profile fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getProfile.mutationKey);

  return {
    data: mutation.data,
    isLoading,
    error: mutation.error,
    onGetProfile,
  };
}
