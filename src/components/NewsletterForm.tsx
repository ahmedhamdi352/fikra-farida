'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslations } from 'next-intl';

interface NewsletterFormProps {
  withTitle?: boolean;
}

interface NewsletterFormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup.string().required('Email is required').email('Invalid email format'),
});

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ withTitle = false }) => {
  const t = useTranslations('common');
  const tt = useTranslations('auth');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<NewsletterFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: NewsletterFormData) => {
    try {
      console.log('Form submitted with email:', data.email);
      // Add your newsletter subscription logic here
    } catch (error) {
      console.error('Error submitting newsletter form:', error);
    }
  };

  return (
    <div className="mt-8">
      {withTitle && (
        <p className="text-gray-300 mb-4">{t('actions.subscribeTitle')}</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2 w-full">
          <input
            type="email"
            placeholder={tt('login.emailPlaceholder')}
            {...register('email')}
            className={`flex-1 min-w-0 bg-transparent border ${errors.email ? 'border-red-500' : 'border-[#FEC400]'} rounded-[10px] px-4 py-2 text-sm sm:text-base text-white placeholder:text-[#FEC400] focus:outline-none`}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="shrink-0 bg-[#FEC400] text-black text-sm sm:text-base font-semibold leading-normal capitalize px-4 sm:px-8 py-2 rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'Subscribing...' : t('actions.subscribe')}
          </button>
        </div>
        {errors.email && (
          <div className="flex items-start">
            <p className="text-red-500 text-sm m-0">
              {errors.email.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
