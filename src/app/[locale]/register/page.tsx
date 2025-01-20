import { Metadata } from 'next';
import RegisterForm from 'components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Register | Fikra Farida',
  description: 'Create your account at Fikra Farida',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
