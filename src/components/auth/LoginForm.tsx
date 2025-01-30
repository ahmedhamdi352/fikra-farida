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
import { useApi } from 'hooks';
import { LoginCredentials, } from 'services/api.service';
import { authApi } from 'services/api.service';


interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email format'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

export default function LoginForm() {
  const { execute: login, data: loginData, isLoading } = useApi<LoginCredentials>();

  const [rememberMe, setRememberMe] = useState(false);
  const t = useTranslations('auth');

  const {
    control,
    handleSubmit,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(() => authApi.login({ email: data.email, password: data.password }));
      console.log(loginData);
    } catch (err) {
      console.error(err)
    }
  };

  return (
    <div className="min-h-[70vh] lg:min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
            {t('login.welcome')}
          </h2>
        </div>

        <form noValidate className="mt-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput
              control={control}
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t('login.emailPlaceholder')}
              icon={
                <svg className="w-5 h-5 text-[var(--main-color1)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              }
            />
            <TextInput
              control={control}
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={t('login.passwordPlaceholder')}
              icon={
                <svg className="w-5 h-5 text-[var(--main-color1)]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[var(--main-color1)] focus:ring-[var(--main-color1)] border-gray-600 rounded bg-black/40"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm  ">
                {t('login.rememberMe')}
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="/forget-password"
                className="font-medium text-[var(--main-color1)] hover:text-[var(--liner-primary)]"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>
          </div>


          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-[var(--main-color1)] hover:bg-[var(--liner-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--main-color1)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Loading...' : t('login.submit')}
            </button>
          </div>

          {/* <div className="text-center text-sm">
            <span >{t('login.noAccount')} </span>
            <Link
              href="/register"
              className="font-medium text-[var(--main-color1)] hover:text-[var(--liner-primary)]"
            >
              {t('login.signUp')}
            </Link>
          </div> */}
        </form>
      </div>
    </div>
  );
}
