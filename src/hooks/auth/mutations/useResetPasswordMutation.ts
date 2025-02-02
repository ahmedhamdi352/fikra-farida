import { useMutation } from '@tanstack/react-query';
import { AuthService } from 'api';
import { useIsLoadingMutation } from 'hooks';
import SnackbarUtils from 'utils/SnackbarUtils';

interface ResetPasswordPayload {
  newPassword: string;
  token: string;
}

export function useResetPasswordMutation() {
  const mutation = useMutation({
    mutationKey: [AuthService.resetPassword.mutationKey],
    mutationFn: AuthService.resetPassword.request,
    onSuccess: () => {
      SnackbarUtils.success('Password reset successfully');
    },
  });

  const onResetPassword = (payload: ResetPasswordPayload) => {
    return mutation.mutate(payload);
  };
  const { isLoading } = useIsLoadingMutation(AuthService.resetPassword.mutationKey);

  return {
    ...mutation,
    isLoading,
    onResetPassword,
  };
}
