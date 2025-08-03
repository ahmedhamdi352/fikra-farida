import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useUploadProfileImageMutation() {

  const mutation = useMutation({
    mutationKey: [ProfileService.uploadProfileImage.mutationKey],
    mutationFn: ProfileService.uploadProfileImage.request,
    onSuccess: async () => {
      SnackbarUtils.success('Profile image uploaded successfully');
    },
  });

  const onUploadProfileImage = (payload: FormData) => {
    return mutation.mutate(payload);
  };

  return {
    ...mutation,
    isLoading: mutation.isPending,
    onUploadProfileImage,
  };
}
