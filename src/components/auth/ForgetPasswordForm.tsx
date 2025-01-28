'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import fikraLogo from 'assets/images/fikra-Logo.png';
import TextInput from '../forms/text-input';
import { useApi } from 'hooks';
import { ForgetData } from 'services/api.service';
import { authApi } from 'services/api.service';

interface ForgetPasswordFormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email format'),
});

export default function ForgetPasswordForm() {
  const t = useTranslations('auth');
  const { execute: forgetPassword, data: forgetPasswordData, isLoading } = useApi<ForgetData>();

  const {
    control,
    handleSubmit,
  } = useForm<ForgetPasswordFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: ForgetPasswordFormData) => {
    try {
      await forgetPassword(() => authApi.forgetPassword({ email: data.email, redirectUrl: window.location.href }));
      console.log(forgetPasswordData);
    } catch (err) {
      console.error(err)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-[#F1911B]/20">
        <div className="flex flex-col items-center">
          <Image
            src={fikraLogo}
            alt="Fikra Farida"
            width={180}
            height={60}
            className="mb-6"
            priority
          />
          <h2 className="text-2xl font-bold text-[var(--main-color1)] mb-2">
            {t('forget.title')}
          </h2>
        </div>

        <form noValidate className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              control={control}
              name="email"
              type="email"
              placeholder={t('register.emailPlaceholder')}
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
            {isLoading ? 'Loading...' : t('forget.submit')}
          </button>

          <div className="text-center text-sm mt-4">
            <span className="text-white">{t('forget.rememberPassword')} </span>
            <Link href="/login" className="font-medium text-[var(--main-color1)] hover:text-[var(--liner-primary)]">
              {t('register.login')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
