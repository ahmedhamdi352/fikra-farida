import React from 'react';
import { Control, Controller, FieldError, Path, PathValue } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';

export type TextInputProps<T extends FieldValues = FieldValues> = Omit<React.ComponentPropsWithoutRef<'input'>, 'name'> & {
  name: Path<T>;
  parseError?: (error: FieldError) => string;
  control?: Control<T>;
  loading?: boolean;
  maxLength?: number;
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  type?: string;
};

export default function TextInput<TFieldValues extends FieldValues = FieldValues>({
  type,
  required,
  name,
  control,
  label,
  disabled,
  className = '',
  icon,
  placeholder,
  ...rest
}: TextInputProps<TFieldValues>) {

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
              <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
                {label}
              </label>
            )}
            <div className="relative">
              {icon && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-yellow-500">
                  {icon}
                </span>
              )}
              <input
                type={type}
                id={name}
                placeholder={placeholder}
                className={`w-full ${icon ? 'pl-10' : 'pl-4'
                  } pr-4 py-4 bg-[rgba(0,0,0,0.25)] rounded-lg focus:outline-none ${error ? 'ring-2 ring-red-500 border-red-500' : 'focus:ring-2 focus:ring-yellow-500'} text-white placeholder-gray-400 ${className}`}
                value={type !== 'file' ? value ?? '' : undefined}
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
