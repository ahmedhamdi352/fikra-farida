'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import fikraLogo from 'assets/images/fikra-Logo.png';
import TextInput from '../forms/text-input';
import { useLoginMutation } from 'hooks';
import { useSiteData } from 'context/SiteContext';
import { useTheme } from '../ThemeProvider';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { isLoading, onLogin } = useLoginMutation();
  const siteData = useSiteData();
  const { theme } = useTheme();
  const t = useTranslations('auth.login');
  const [showPassword, setShowPassword] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(t('validation.emailRequired'))
      .email(t('validation.emailInvalid')),
    password: yup
      .string()
      .required(t('validation.passwordRequired'))
      .min(6, t('validation.passwordMin')),
  });

  const {
    control,
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const onSubmit = (data: LoginFormData) => {
    onLogin(data);
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
            {t('welcome')}
          </h2>
        </div>

        <form noValidate className="mt-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              control={control}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t('emailPlaceholder')}
              icon={
                <svg className="w-5 h-5 text-[var(--main-color1)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              }
            />
            <TextInput
              control={control}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder={t('passwordPlaceholder')}
              icon={
                <svg className="w-5 h-5 text-[var(--main-color1)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              }
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {!showPassword ? (
                    <svg className="w-5 h-5 text-[var(--main-color1)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-[var(--main-color1)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                    </svg>
                  )}
                </button>
              }
            />
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/forget-password"
              className="text-sm font-medium text-[var(--main-color1)] hover:text-[var(--liner-primary)]"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-[var(--main-color1)] hover:bg-[var(--liner-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-color1)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('submitting') : t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
