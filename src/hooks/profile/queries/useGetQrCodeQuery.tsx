import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

export function useGetQrCodeQuery() {
  const mutation = useMutation({
    mutationKey: [ProfileService.getQRCode.mutationKey],
    mutationFn: async (userpk: number) => {
      try {
        const response = await ProfileService.getQRCode.request(userpk);
        return response;
      } catch (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
    }
  });

  const onGetProfileQrCode = (userpk: number) => {
    try {
      mutation.mutate(userpk);
    } catch (error) {
      console.error('Error triggering profile fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getQRCode.mutationKey);

  return {
    data: mutation.data,
    isLoading,
    error: mutation.error,
    onGetProfileQrCode,
  };
}
