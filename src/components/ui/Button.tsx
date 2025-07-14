'use client';

import React from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { useTranslations } from 'next-intl';

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  className?: string;
  withArrow?: boolean;
  translationNamespace?: string;
  style?: React.CSSProperties;
} & (
    | { translationKey: string; children?: never }
    | { translationKey?: never; children: React.ReactNode }
  );

export const Button: React.FC<ButtonProps> = ({
  href,
  onClick,
  children,
  className,
  withArrow = false,
  translationKey,
  translationNamespace = 'common',
  style,
}) => {
  const t = useTranslations(translationNamespace);
  const baseStyles = "inline-flex items-center justify-between px-8 py-3 rounded-[10px] hover:opacity-80 transition-all w-full sm:w-auto capitalize";
  const gradientBorderStyles = "relative border border-transparent [border-image-source:linear-gradient(90deg,#F1911B,#FEC400,#8B5410)] [border-image-slice:1]";
  const textStyles = "text-center font-poppins text-[20px] font-semibold leading-[23px]";

  const Arrow = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="32" viewBox="0 0 33 32" fill="none" className="ml-2 rtl:rotate-180">
      <path d="M20.1095 7.05703C19.5888 6.53633 18.7446 6.53633 18.2239 7.05703C17.7032 7.57773 17.7032 8.42195 18.2239 8.94265L23.9477 14.6665H5.83333C5.09695 14.6665 4.5 15.2635 4.5 15.9998C4.5 16.7362 5.09695 17.3332 5.83333 17.3332H23.9477L18.2239 23.057C17.7032 23.5777 17.7032 24.4219 18.2239 24.9426C18.7446 25.4633 19.5888 25.4633 20.1095 24.9426L28.1095 16.9426C28.6302 16.4219 28.6302 15.5777 28.1095 15.057L20.1095 7.05703Z" fill="#F1911B" />
    </svg>
  );

  const content = (
    <div className='flex gap-4 justify-between items-center'>
      <span className={textStyles}>
        {translationKey ? t(translationKey) : children}
      </span>
      {withArrow && <Arrow />}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={twMerge(baseStyles, gradientBorderStyles, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button style={style} onClick={onClick} className={twMerge(baseStyles, gradientBorderStyles, className)}>
      {content}
    </button>
  );
};
