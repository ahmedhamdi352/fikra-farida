'use client';

import { UserLinks } from './UserLinks';
import { ProfileLink } from 'types/api/ProfileForReadDTO'


export default function ClientUserLinks({ profileLinks }: { profileLinks?: ProfileLink[] }) {
  return <UserLinks profileLinks={profileLinks} />;
}
