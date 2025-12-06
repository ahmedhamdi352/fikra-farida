'use client';

import { Control, Controller, FieldError, Path, } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import 'react-international-phone/style.css';
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
  CountryIso2,
  PhoneInputProps,
} from 'react-international-phone';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useLocale } from 'next-intl';

type PhoneFieldProps<T extends FieldValues = FieldValues> = Omit<React.ComponentPropsWithoutRef<'input'>, 'name'> &
  PhoneInputProps & {
    name: Path<T>;
    parseError?: (error: FieldError) => string;
    control?: Control<T>;
    loading?: boolean;
    defaultCountry?: string;
    defaultMask?: string;
    withFormat?: boolean;
    onlyCountries?: CountryIso2[];
    disableDropdown?: boolean;
    label?: string;
    placeholder?: string;
  };

function PhoneInputField<TFieldValues extends FieldValues = FieldValues>({
  name,
  label,
  control,
  disabled,
  defaultCountry,
  defaultMask,
  onlyCountries,
  disableDropdown,
  placeholder,
  ...rest
}: PhoneFieldProps<TFieldValues>) {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const countriesOptions = () => {
    if (onlyCountries) {
      const countries = defaultCountries.filter(country => {
        const { iso2 } = parseCountry(country);
        return onlyCountries.includes(iso2);
      });
      return countries;
    } else return defaultCountries;
  };

  const initialValue = (rest.defaultValue || rest.value || '') as string;

  const { inputValue, handlePhoneValueChange, country, setCountry } = usePhoneInput({
    defaultCountry: defaultCountry ?? 'eg',
    countries: countriesOptions(),
    defaultMask,
    forceDialCode: false,
    disableDialCodeAndPrefix: true,
    value: initialValue,
  });

  return (
    <Controller<TFieldValues>
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, ref }, fieldState: { error } }) => {
        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          handlePhoneValueChange(e);
          // Remove any non-digit characters
          const cleanValue = e.target.value.replace(/[^\d]/g, '');
          // Include country code in the final value
          const fullNumber = `+${country.dialCode}${cleanValue}`;
          onChange(fullNumber);

          if (typeof rest.onChange === 'function') {
            rest.onChange(e);
          }
        };

        return (
          <div className="relative w-full">
            {label && (
              <label htmlFor={name} className="block text-sm font-medium text-[var(--main-color1)] mb-1">
                {label}
              </label>
            )}
            <div className="relative flex w-full">
              <div className="relative w-full">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0' : 'left-0'} flex items-center z-10`}>
                  <div className="relative">
                    <button
                      type="button"
                      disabled={disabled || disableDropdown}
                      onClick={() => setIsOpen(!isOpen)}
                      className={`h-full min-w-[200px] flex items-center gap-2 px-4 text-black dark:text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${error ? 'text-red-500' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <FlagImage iso2={country.iso2} className="w-6 h-4 rounded-[1px] object-cover" />
                        <span className="text-base">+{country.dialCode}</span>
                      </div>
                      <ChevronDownIcon className={`h-5 w-5 text-black dark:text-white/70 ${isRTL ? 'mr-2' : 'ml-2'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {/* Custom Dropdown */}
                    {isOpen && (
                      <div className={`absolute top-full ${isRTL ? 'right-0' : 'left-0'} mt-1 w-full max-h-60 overflow-auto bg-[#F5F5F5] dark:bg-black/90 backdrop-blur-sm rounded-lg shadow-lg z-50`}>
                        {countriesOptions().map((option, index) => {
                          const countryData = parseCountry(option);
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => {
                                setCountry(countryData.iso2);
                                setIsOpen(false);
                                // Update form value when country changes
                                const currentValue = inputValue.replace(/^\+\d+\s/, '').replace(/[^\d]/g, '');
                                onChange(`+${countryData.dialCode}${currentValue}`);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-black/50"
                            >
                              <FlagImage iso2={countryData.iso2} className="w-6 h-4 rounded-[1px] object-cover" />
                              <span className="text-black dark:text-white text-base font-medium">{countryData.name}</span>
                              <span className={`text-gray-400 dark:text-gray-500 ${isRTL ? 'mr-auto' : 'ml-auto'} text-base`}>+{countryData.dialCode}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                <input
                  type="tel"
                  id={name}
                  placeholder={placeholder}
                  className={`w-full ${isRTL ? 'pr-[130px] pl-4' : 'pl-[130px] pr-4'} py-4 bg-[#F5F5F5] dark:bg-[rgba(0,0,0,0.25)] rounded-lg focus:outline-none ${error ? 'ring-2 ring-red-500 border-red-500' : 'focus:ring-2 focus:ring-[var(--main-color1)]'
                    } text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={onBlur}
                  disabled={disabled}
                  ref={ref}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  {...rest}
                />
              </div>
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

export default PhoneInputField;
