import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api';
import { useIsLoadingMutation } from 'hooks';

export function useGetOfflineQrCodeQuery() {
  const mutation = useMutation({
    mutationKey: [ProfileService.getOfflineQrCode.mutationKey],
    mutationFn: async (userpk: number) => {
      try {
        const response = await ProfileService.getOfflineQrCode.request(userpk);
        return response;
      } catch (error) {
        console.error('Offline QR code fetch error:', error);
        throw error;
      }
    },
  });

  const onGetOfflineQrCode = (userpk: number) => {
    try {
      mutation.mutate(userpk);
    } catch (error) {
      console.error('Error triggering offline QR code fetch:', error);
    }
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.getOfflineQrCode.mutationKey);

  return {
    data: mutation.data,
    isLoading,
    error: mutation.error,
    onGetOfflineQrCode,
  };
}
