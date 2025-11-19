'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import fikraLogo from 'assets/images/fikra-Logo.png';
import TextInput from 'components/forms/text-input';
import { useCreateProfileMutation } from 'hooks/profile';
import { useSiteData } from 'context/SiteContext';
import { useTheme } from 'components/ThemeProvider';
import { PhoneInput } from 'components/forms/phone-input';

interface ProfileFormData {
  username: string;
  fullName: string;
  phoneNumber1: string;
}

export default function ProfileForm() {
  const t = useTranslations('auth');
  const siteData = useSiteData();
  const { theme } = useTheme();
  const { isLoading, onAddProfile } = useCreateProfileMutation();

  const schema = yup.object().shape({
    username: yup
      .string()
      .required(t('register.validation.usernameRequired'))
      .matches(/^[a-zA-Z0-9!@#$%^&*()\-_+=[\]{}|\\:;"'<>,.?/]*$/, t('register.validation.usernameEnglishOnly')),
    fullName: yup.string().required(t('register.validation.fullNameRequired')),
    phoneNumber1: yup.string().required(t('register.validation.phoneRequired')),
  });

  const { control, handleSubmit } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ProfileFormData) => {
    const registrationData = {
      fullname: data.fullName,
      username: data.username,
      phoneNumber1: data.phoneNumber1,
    };
    await onAddProfile(registrationData);
  };

  return (
    <div className="h-[80vh] lg:h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 card-container">
        <div className="flex flex-col items-center">
          <Image
            src={siteData?.siteLogo || fikraLogo}
            alt="Fikra Farida"
            width={80}
            height={60}
            className={`mb-6 ${theme === 'light' ? 'brightness-0' : 'brightness-0 invert'}`}
            priority
          />
          <h2 className="text-2xl font-bold text-[var(--main-color1)] mb-2">{t('addNewProfile')}</h2>
        </div>

        <form noValidate className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              control={control}
              name="username"
              type="text"
              placeholder={t('register.usernamePlaceholder')}
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
              name="fullName"
              type="text"
              placeholder={t('register.fullNamePlaceholder')}
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

            <PhoneInput
              name="phoneNumber1"
              control={control}
              required
              defaultCountry={'eg'}
              placeholder='phone'
              disableDropdown={false}
            />

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('registering') : t('addProfile')}
          </button>


        </form>
      </div>
    </div>
  );
}
