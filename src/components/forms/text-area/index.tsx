'use client';

import React from 'react';
import { Control, Controller, FieldError, Path, PathValue } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { useLocale } from 'next-intl';

export type TextAreaProps<T extends FieldValues = FieldValues> = Omit<React.ComponentPropsWithoutRef<'textarea'>, 'name'> & {
  name: Path<T>;
  parseError?: (error: FieldError) => string;
  control?: Control<T>;
  loading?: boolean;
  maxLength?: number;
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  rows?: number;
};

export default function TextArea<TFieldValues extends FieldValues = FieldValues>({
  required,
  name,
  control,
  label,
  disabled,
  className = '',
  icon,
  placeholder,
  rows = 4,
  ...rest
}: TextAreaProps<TFieldValues>) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const handlePlaceholder = (placeholder?: string) => {
    if (!placeholder) return '';
    return isRTL ? `\u202B${placeholder}` : placeholder;
  };

  return (
    <Controller<TFieldValues>
      key={name}
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => {
        const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(event.target.value as PathValue<string, string>);
          if (typeof rest.onChange === 'function') {
            rest.onChange(event);
          }
        };

        return (
          <div className="relative w-full">
            {label && (
              <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
                {label}
              </label>
            )}
            <div className="relative flex gap-5">
              {icon && (
                <span className={`absolute top-4 ${isRTL ? 'right-3' : 'left-3'} text-yellow-500`}>
                  {icon}
                </span>
              )}
              <textarea
                id={name}
                rows={rows}
                placeholder={handlePlaceholder(placeholder)}
                className={`w-full ${icon ? (isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4') : 'px-4'} py-4 bg-[#F5F5F5] dark:bg-[rgba(0,0,0,0.25)] rounded-lg focus:outline-none ${error ? 'ring-2 ring-red-500 border-red-500' : 'focus:ring-2 focus:ring-[var(--main-color1)]'} text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${className}`}
                value={value ?? ''}
                onChange={onChangeHandler}
                onBlur={event => {
                  if (typeof rest.onBlur === 'function') {
                    rest.onBlur(event);
                  }
                  onBlur();
                }}
                required={required}
                disabled={disabled}
                ref={ref}
                {...rest}
              />
            </div>
            {error?.message && (
              <p className="mt-1 text-sm text-red-500">
                {error.message as string}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
