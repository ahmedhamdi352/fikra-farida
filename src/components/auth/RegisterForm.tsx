'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import fikraLogo from 'assets/images/fikra-Logo.png';
import TextInput from '../forms/text-input';
import { PhoneInput } from 'components/forms/phone-input';
import { useRegisterMutation } from 'hooks';
import { useSiteData } from 'context/SiteContext';
import { useTheme } from '../ThemeProvider';
import { useSearchParams } from 'next/navigation';

interface RegisterFormData {
  username: string;
  fullName: string;
  email: string;
  phoneNumber1: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const t = useTranslations('auth');
  const siteData = useSiteData();
  const { theme } = useTheme();
  const { isLoading, onRegister } = useRegisterMutation();
  const searchParams = useSearchParams();
  const productName = searchParams.get('product');
  const qrKey = searchParams.get('key');

  const schema = yup.object().shape({
    username: yup
      .string()
      .required(t('register.validation.usernameRequired'))
      .matches(/^[a-zA-Z0-9!@#$%^&*()\-_+=[\]{}|\\:;"'<>,.?/]*$/, t('register.validation.usernameEnglishOnly')),
    fullName: yup.string().required(t('register.validation.fullNameRequired')),
    email: yup.string().required(t('register.validation.emailRequired')).email(t('register.validation.emailInvalid')),
    phoneNumber1: yup.string().required(t('register.validation.phoneRequired')),
    password: yup
      .string()
      .required(t('register.validation.passwordRequired'))
      .min(6, t('register.validation.passwordMin')),
    confirmPassword: yup
      .string()
      .required(t('register.validation.passwordRequired'))
      .oneOf([yup.ref('password')], t('register.validation.passwordMatch')),
  });

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    const registrationData = {
      ...data,
      productId: productName || undefined,
      key: qrKey || undefined,
    };
    await onRegister(registrationData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-2xl font-bold text-[var(--main-color1)] mb-2">{t('register.title')}</h2>
          {productName && (
            <div className="mt-2 text-center">
              <p className="text-sm ">{t('register.selectedProduct')}:</p>
              <p className="text-lg font-medium text-[var(--main-color1)]">{productName}</p>
            </div>
          )}
        </div>

        <form noValidate className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <TextInput<RegisterFormData>
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

            <TextInput<RegisterFormData>
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

            <TextInput<RegisterFormData>
              control={control}
              name="email"
              type="email"
              placeholder={t('register.emailPlaceholder')}
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

            <PhoneInput<RegisterFormData>
              name="phoneNumber1"
              control={control}
              required
              defaultCountry={'eg'}
              placeholder='phone'
              disableDropdown={false}
            />

            <TextInput<RegisterFormData>
              control={control}
              name="password"
              type="password"
              placeholder={t('register.passwordPlaceholder')}
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

            <TextInput<RegisterFormData>
              control={control}
              name="confirmPassword"
              type="password"
              placeholder={t('register.confirmPasswordPlaceholder')}
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
            {isLoading ? 'Registering...' : t('register.submit')}
          </button>

          <div className="flex justify-between text-center text-sm mt-4">
            <span className="h4">{t('register.haveAccount')} </span>
            <Link href="/login" className="font-medium text-[var(--main-color1)] hover:text-[var(--liner-primary)]">
              {t('register.login')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
