import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

interface LinkQrCodeResponse {
  success?: boolean;
  sucess?: boolean; // Handle potential typo in API response
  errorcode: number;
  message: string;
}

interface LinkQrCodeParams {
  key: string;
  productId: string;
}

export function useLinkQRToProductMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: [ProfileService.linkQrCode.mutationKey],
    mutationFn: ProfileService.linkQrCode.request,
    onSuccess: async (response: LinkQrCodeResponse) => {
      try {
        // Invalidate relevant queries to refresh data
        await queryClient.invalidateQueries({
          queryKey: [ProfileService.getProfile.mutationKey],
        });
        
        // Use the message from the API response
        SnackbarUtils.success(response.message || 'QR code linked successfully');
      } catch (error) {
        console.error('Failed to refresh profile data:', error);
        SnackbarUtils.error('Failed to refresh profile data');
      }
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const errorMessage = error?.response?.data?.message || 'Failed to link QR code to product';
      SnackbarUtils.error(errorMessage);
    },
  });

  const onLinkQrCode = (params: LinkQrCodeParams) => {
    return mutation.mutate(params);
  };

  const { isLoading } = useIsLoadingMutation(ProfileService.linkQrCode.mutationKey);

  return {
    linkQrCode: onLinkQrCode,
    isLoading,
    error: mutation.error,
  };
};
