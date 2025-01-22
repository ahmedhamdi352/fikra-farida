'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as yup from 'yup';
import TextInput from '../forms/text-input';
import TextArea from '../forms/text-area'; // Import TextArea component

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
}

const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email format'),
  phone: yup.string().required('Phone number is required'),
  message: yup.string().required('Message is required').min(10, 'Message must be at least 10 characters'),
});

export default function ContactFormFields() {
  const t = useTranslations('contact');

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<ContactFormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      console.log('Form data:', data);
      // Add your form submission logic here
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 sm:gap-4 lg:gap-6 w-full">
      <TextInput
        control={control}
        name="fullName"
        placeholder={t('form.fullName')}
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        }
      />

      <TextInput
        control={control}
        name="email"
        type="email"
        placeholder={t('form.email')}
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        }
      />

      <TextInput
        control={control}
        name="phone"
        type="tel"
        placeholder={t('form.phone')}
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2c-2.83-1.44-5.15-3.75-6.59-6.59l2.2-2.21c.28-.26.36-.65.25-1C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2c0-4.97-4.03-9-9-9v2c3.87 0 7 3.13 7 7z" />
          </svg>
        }
      />

      <TextArea
        control={control}
        name="message"
        placeholder={t('form.message')}
        icon={
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        }
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-[var(--main-color1)] text-white rounded-lg hover:bg-[#e08616] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : t('form.submit')}
      </button>
    </form>
  );
}
