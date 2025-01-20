'use client';

import React from 'react';

interface NewsletterFormProps {
  withTitle?: boolean;
}

export const NewsletterForm: React.FC<NewsletterFormProps> = ({ withTitle = false }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="mt-8">
      {withTitle && (
        <p className="text-gray-300 mb-4">Subscribe to our newsletter</p>
      )}
      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="E-Mail"
          className="flex-1 bg-transparent border border-[#FEC400] rounded-[10px] px-4 py-3 text-white placeholder:text-[#FEC400] focus:outline-none"
          required
        />
        <button
          type="submit"
          className="bg-[#FEC400] text-white text-[18px] font-semibold leading-normal capitalize px-8 py-2 rounded-[10px] hover:opacity-90 transition-opacity"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
};
