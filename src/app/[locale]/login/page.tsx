import { Metadata } from 'next';
import LoginForm from 'components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login | Fikra Farida',
  description: 'Login to your Fikra Farida account',
};

export default function LoginPage() {
  return <LoginForm />;
}
