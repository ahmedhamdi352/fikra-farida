import { Metadata } from 'next';
import ForgetPasswordForm from 'components/auth/ForgetPasswordForm';

export const metadata: Metadata = {
  title: 'Forget Password | Fikra Farida',
  description: 'Forget your password don&apos;t worry at Fikra Farida',
};

export default function RegisterPage() {
  return <ForgetPasswordForm />;
}
