'use client';

import { useTranslations } from 'next-intl';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  const t = useTranslations('products');

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 mb-4">
        <svg
          className="w-full h-full text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <h3 className="mt-2 text-lg font-medium text-white">
        {title || t('noProductsTitle')}
      </h3>
      <p className="mt-1 text-sm text-gray-400">
        {message || t('noProductsMessage')}
      </p>
    </div>
  );
}
