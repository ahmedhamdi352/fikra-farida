import React from 'react';
import { Control, Controller, FieldError, Path, PathValue } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { useLocale } from 'next-intl';

export type TextInputProps<T extends FieldValues = FieldValues> = Omit<React.ComponentPropsWithoutRef<'input'>, 'name'> & {
  name: Path<T>;
  parseError?: (error: FieldError) => string;
  control?: Control<T>;
  loading?: boolean;
  maxLength?: number;
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  type?: string;
  textColor?: string;
};

export default function TextInput<TFieldValues extends FieldValues = FieldValues>({
  type,
  name,
  control,
  label,
  disabled,
  className = '',
  icon,
  endIcon,
  placeholder,

  ...rest
}: TextInputProps<TFieldValues>) {
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
        const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
          const fieldValue =
            type === 'file'
              ? event.target.files?.[0]
              : event.target.value;
          onChange(fieldValue as PathValue<string, string>);
          if (typeof rest.onChange === 'function') {
            rest.onChange(event);
          }
        };

        return (
          <div className="relative w-full">
            {label && (
              <label htmlFor={name} className="block text-sm font-medium text-[var(--main-color1)] mb-1">
                {label}
              </label>
            )}
            <div className="relative flex gap-5">
              {icon && (
                <span className={`absolute inset-y-0 ${isRTL ? 'right-3' : 'left-0'} flex items-center ${isRTL ? 'pl-3 ml-10' : 'pl-3 mr-10'} text-yellow-500`}>
                  {icon}
                </span>
              )}
              <input
                type={type}
                id={name}
                placeholder={handlePlaceholder(placeholder)}
                className={`w-full ${icon ? (isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4') : 'px-4'} ${endIcon ? (isRTL ? 'pl-12' : 'pr-12') : ''} py-4 bg-[#F5F5F5] dark:bg-[rgba(0,0,0,0.25)] rounded-lg focus:outline-none ${error ? 'ring-2 ring-red-500 border-red-500' : 'focus:ring-2 focus:ring-[var(--main-color1)]'} text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${className}`}
                value={type !== 'file' ? value ?? '' : undefined}
                onChange={onChangeHandler}
                onBlur={event => {
                  if (typeof rest.onBlur === 'function') {
                    rest.onBlur(event);
                  }
                  onBlur();
                }}
                disabled={disabled}
                ref={ref}
                {...rest}
              />
              {endIcon && (
                <span className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center ${isRTL ? 'pr-3 mr-10' : 'pr-3 ml-10'} text-yellow-500`}>
                  {endIcon}
                </span>
              )}
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
