import { useMutation } from '@tanstack/react-query';
import { AuthService } from 'api';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

export function useForgetPasswordMutation() {
  const mutation = useMutation({
    mutationKey: [AuthService.forgetPassword.mutationKey],
    mutationFn: AuthService.forgetPassword.request,
    onSuccess: response => {
      if (!response.sucess) {
        SnackbarUtils.error(response.message || 'Failed to forget password');
        return;
      }
      SnackbarUtils.success('Please check your email');
    },
  });

  const onForgetPassword = (payload: { email: string }) => {
    return mutation.mutate({
      ...payload,
      redirectUrl: `${process.env.NEXT_PUBLIC_FORGET_FIKRAFARIDA_DOMAIN}/reset-password`,
    });
  };
  const { isLoading } = useIsLoadingMutation(AuthService.forgetPassword.mutationKey);

  return {
    ...mutation,
    isLoading,
    onForgetPassword,
  };
}
