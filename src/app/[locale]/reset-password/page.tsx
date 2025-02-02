import { Metadata } from 'next';
import ResetPasswordForm from 'components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password | Fikra Farida',
  description: 'Reset your password don&apos;t worry at Fikra Farida',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
