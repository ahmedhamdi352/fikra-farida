"use client";

import { useParams } from 'next/navigation';
import FloatingActionButtons from 'components/FloatingActionButtons';

type Props = {
  whatsappNumber: string | null;
  phoneNumber: string | null;
  email: string | null;
};

export default function ConditionalFloatingActionButtons(props: Props) {
  const params = useParams<{ locale?: string; username?: string }>();

  const usernameParam = params?.username;
  const isUsernameRoute = typeof usernameParam === 'string' && usernameParam.length > 0;

  if (isUsernameRoute) return null;

  return (
    <FloatingActionButtons
      whatsappNumber={props.whatsappNumber || ''}
      phoneNumber={props.phoneNumber || ''}
      email={props.email || ''}
    />
  );
}


