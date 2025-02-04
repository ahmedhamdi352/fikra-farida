import { useMutation } from '@tanstack/react-query';
import { ContactService } from 'api';
import { useIsLoadingMutation } from 'hooks';
import { ContactPayloadForCreateDto } from 'types';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useContactUsMutation() {
  const mutation = useMutation({
    mutationKey: [ContactService.contact.mutationKey],
    mutationFn: ContactService.contact.request,
    onSuccess: response => {
      if (!response.sucess) {
        SnackbarUtils.error(response.message || 'Failed to send message');
        return;
      }
      SnackbarUtils.success('Thank You for Reaching out we will return to you Soon');
    },
  });

  const onContactUs = (payload: ContactPayloadForCreateDto) => {
    return mutation.mutate(payload);
  };
  const { isLoading } = useIsLoadingMutation(ContactService.contact.mutationKey);

  return {
    ...mutation,
    isLoading,
    onContactUs,
  };
}
