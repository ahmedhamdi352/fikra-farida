import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AuthService } from 'api';
import { LoginPayloadForCreateDto } from 'types';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';
import { useAuth } from 'context/AuthContext';

export function useLoginMutation() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const mutation = useMutation({
    mutationKey: [AuthService.login.mutationKey],
    mutationFn: AuthService.login.request,
    onSuccess: response => {
      if (response.sucess) {
        setAuth(response.token!);
        SnackbarUtils.success('Login successful!');
        router.push('/profile');
        router.refresh();
      } else {
        SnackbarUtils.error(response.message || 'Login failed');
      }
    },
  });

  const onLogin = (payload: LoginPayloadForCreateDto) => {
    return mutation.mutate(payload);
  };
  const { isLoading } = useIsLoadingMutation(AuthService.login.mutationKey);

  return {
    ...mutation,
    isLoading,
    onLogin,
  };
}
