import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AuthService } from 'api';
import { RegisterPayloadForCreateDto } from 'types';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useRegisterMutation() {
  const router = useRouter();

  const mutation = useMutation({
    mutationKey: [AuthService.register.mutationKey],
    mutationFn: AuthService.register.request,
    onSuccess: response => {
      if (response.sucess) {
        SnackbarUtils.success('Register successful!');
        router.push('/login');
      } else {
        SnackbarUtils.error(response.message || 'Register failed');
      }
    },
  });

  const onRegister = (payload: RegisterPayloadForCreateDto) => {
    return mutation.mutate(payload);
  };
  const { isLoading } = useIsLoadingMutation(AuthService.register.mutationKey);

  return {
    ...mutation,
    isLoading,
    onRegister,
  };
}
