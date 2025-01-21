'use client';

import React from 'react';
import { Control, Controller, FieldError, Path } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';

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
  return (
    <Controller<TFieldValues>
      key={name}
      name={name}
      control={control}
      render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => {
        return (
          <div className="relative w-full">
            {label && (
              <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
                {label}
              </label>
            )}
            <div className="relative">
              {icon && (
                <span className="absolute top-4 left-0 flex items-start pl-3 text-yellow-500">
                  {icon}
                </span>
              )}
              <textarea
                id={name}
                rows={rows}
                placeholder={placeholder}
                className={`w-full ${icon ? 'pl-10' : 'pl-4'
                  } pr-4 py-3 bg-[rgba(0,0,0,0.25)] rounded-lg focus:outline-none ${error ? 'ring-2 ring-red-500 border-red-500' : 'focus:ring-2 focus:ring-yellow-500'} text-white placeholder-gray-400 resize-none ${className}`}
                value={value ?? ''}
                onChange={onChange}
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
