'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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
        <p className="text-gray-300 mb-4">Subscribe to our newsletter</p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-4 relative">
          <input
            type="email"
            placeholder="E-Mail"
            {...register('email')}
            className={`flex-1 bg-transparent border ${errors.email ? 'border-red-500' : 'border-[#FEC400]'} rounded-[10px] px-4 py-3 text-white placeholder:text-[#FEC400] focus:outline-none`}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#FEC400] text-white text-[18px] font-semibold leading-normal capitalize px-8 py-2 rounded-[10px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
        {errors.email && (
          <div className="flex items-start mx-2">

            <p className="text-red-500 m-0">
              {errors.email.message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
