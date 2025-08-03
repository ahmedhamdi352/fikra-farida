import { useMutation } from '@tanstack/react-query';
import { ProfileService } from 'api/services';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useUploadCoverImageMutation() {

  const mutation = useMutation({
    mutationKey: [ProfileService.uploadCoverImage.mutationKey],
    mutationFn: ProfileService.uploadCoverImage.request,
    onSuccess: async () => {
      SnackbarUtils.success('Cover image uploaded successfully');
    },
  });

  const onUploadCoverImage = (payload: FormData) => {
    return mutation.mutate(payload);
  };

  return {
    ...mutation,
    isLoading: mutation.isPending,
    onUploadCoverImage,
  };
}
