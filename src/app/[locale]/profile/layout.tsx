import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile | Fikra Farida',
  description: 'your profile account at Fikra Farida',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
