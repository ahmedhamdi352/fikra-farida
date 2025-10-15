'use client';

import { useTranslations } from 'next-intl';
import { PhoneInput } from 'components/forms/phone-input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextInput from 'components/forms/text-input';
import TextArea from 'components/forms/text-area';
import { useCreateConnectionMutation, useGetConnectionQuery } from 'hooks/profile';

interface AutoConnectFormData {
  fullname: string;
  company?: string;
  email?: string;
  phone: string;
  title?: string;
  message?: string;
}

export default function AutoConnectForm({ userPk, onClose }: { userPk: number, onClose: () => void }) {
  const t = useTranslations('auth');
  const tProfile = useTranslations('profile.connectionsPage');

  const { isLoading, onAddConnection } = useCreateConnectionMutation();
  const { onGetConnections } = useGetConnectionQuery();


  const schema = yup.object().shape({
    fullname: yup.string().required(t('register.validation.fullNameRequired')),
    company: yup.string().optional(),
    email: yup.string().optional().email(t('register.validation.emailInvalid')),
    phone: yup.string().required(t('register.validation.phoneNumberRequired')),
    title: yup.string().optional(),
    message: yup.string().optional(),
  });

  const { control, handleSubmit } = useForm<AutoConnectFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: AutoConnectFormData) => {
    const connectionData = {
      ...data,
      userpk: userPk,
    };
    await onAddConnection(connectionData);
    await onGetConnections();
    onClose();
  };

  return (


    <form noValidate className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <TextInput
          control={control}
          name="fullname"
          type="text"
          placeholder={tProfile('name')}
          icon={
            <svg
              className="h-5 w-5 text-[var(--main-color1)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          }
        />

        <TextInput
          control={control}
          name="company"
          type="text"
          placeholder={tProfile('company')}
          icon={
            <svg
              className="h-5 w-5 text-[var(--main-color1)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <TextInput
          control={control}
          name="email"
          type="email"
          placeholder={tProfile('email')}
          icon={
            <svg
              className="h-5 w-5 text-[var(--main-color1)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <PhoneInput
          name="phone"
          control={control}
          required
          defaultCountry={'eg'}
          placeholder={tProfile('phone')}
          disableDropdown={false}
        />

        <TextInput
          control={control}
          name="title"
          type="text"
          placeholder={tProfile('jobTitle')}
          icon={
            <svg
              className="h-5 w-5 text-[var(--main-color1)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <TextArea
          control={control}
          name="message"
          placeholder={tProfile('message')}
          icon={
            <svg
              className="h-5 w-5 text-[var(--main-color1)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? tProfile('registering') : tProfile('share')}
      </button>
    </form>

  );
}
