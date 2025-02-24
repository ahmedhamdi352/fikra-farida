'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import fikraLogo from 'assets/images/fikra-Logo.png';
import TextInput from '../forms/text-input';
import { useResetPasswordMutation } from 'hooks';
import { useSearchParams } from 'next/navigation';
import { useSiteData } from 'context/SiteContext';
import { useTheme } from '../ThemeProvider';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordForm() {
  const t = useTranslations('auth');
  const siteData = useSiteData();
  const { theme } = useTheme();
  const searchParams = useSearchParams();
  const { isLoading, onResetPassword } = useResetPasswordMutation();

  const schema = yup.object().shape({
    password: yup
      .string()
      .required(t('login.validation.passwordRequired'))
      .min(8, t('login.validation.passwordMin')),
    confirmPassword: yup
      .string()
      .required(t('login.validation.passwordRequired'))
      .oneOf([yup.ref('password')], t('login.validation.passwordMatch')),
  });

  const {
    control,
    handleSubmit,
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    const token = searchParams.get('token');
    if (!token) {
      console.error('No token found in URL');
      return;
    }

    onResetPassword({
      newPassword: data.password,
      token
    });
  };

  return (
    <div className="min-h-[70vh] lg:min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-2xl font-bold text-[var(--main-color1)] mb-2">
            {t('reset.title')}
          </h2>
        </div>

        <form noValidate className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              control={control}
              name="password"
              type="password"
              placeholder={t('reset.newPasswordPlaceholder')}
              icon={
                <svg className="h-5 w-5 text-[var(--main-color1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>

          <div className="space-y-4">
            <TextInput
              control={control}
              name="confirmPassword"
              type="password"
              placeholder={t('reset.confirmPasswordPlaceholder')}
              icon={
                <svg className="h-5 w-5 text-[var(--main-color1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-yellow-500 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : t('reset.submit')}
          </button>

        </form>
      </div>
    </div>
  );
}
