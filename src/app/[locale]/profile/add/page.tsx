import { Metadata } from 'next';
import ProfileForm from '../components/ProfileForm';

export const metadata: Metadata = {
  title: 'Add Profile | Fikra Farida',
  description: 'Add a new profile at Fikra Farida',
};

export default function AddProfilePage() {
  return <ProfileForm />;
}
