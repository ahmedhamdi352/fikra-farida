'use client';

import { Control, Controller, Path } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { useState, useRef, useEffect } from 'react';
import { ChevronUpDownIcon } from '@heroicons/react/24/outline';

interface Option {
  value: string;
  label: string;
}

type SelectProps<T extends FieldValues = FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  options: Option[];
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
};

export default function Select<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  options,
  placeholder = 'Select an option',
  label,
  icon,
  disabled,
  required,
}: SelectProps<TFieldValues>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const selectedOption = options.find(option => option.value === value);

        return (
          <div className="relative w-full">
            {label && (
              <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
            )}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`relative w-full cursor-pointer rounded-xl border ${error ? 'ring-2 ring-red-500 border-red-500' : 'focus:ring-2 focus:ring-yellow-500 border-yellow-500/20'
                  } dark:bg-[rgba(0,0,0,0.25)] bg-gray-100 pl-12 pr-10 py-4 text-left focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base`}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  {icon}
                </span>
                <span className={`block truncate ${!value ? 'text-gray-400' : 'dark:text-white'}`}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <ChevronUpDownIcon className={`h-5 w-5 text-white/70 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </span>
              </button>

              {isOpen && (
                <div className="absolute z-50 mt-1 w-full overflow-auto rounded-xl dark:bg-[#1a1a1a] bg-white border border-yellow-500/20 py-2 shadow-lg max-h-60">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      // className={`w-full ${icon ? (isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4') : 'px-4'} py-4 bg-[#F5F5F5] dark:bg-[rgba(0,0,0,0.25)] rounded-lg focus:outline-none ${error ? 'ring-2 ring-red-500 border-red-500' : 'focus:ring-2 focus:ring-[var(--main-color1)]'} text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${className}`}
                      className={`w-full text-left py-3 px-4 hover:bg-white/5 transition-colors ${option.value === value ? 'text-[var(--main-color1)]' : 'dar:text-white text-black'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
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
