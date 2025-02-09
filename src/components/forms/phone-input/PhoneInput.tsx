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
  const countriesOptions = () => {
    if (onlyCountries) {
      const countries = defaultCountries.filter(country => {
        const { iso2 } = parseCountry(country);
        return onlyCountries.includes(iso2);
      });
      return countries;
    } else return defaultCountries;
  };

  const { inputValue, handlePhoneValueChange, country, setCountry } = usePhoneInput({
    defaultCountry: defaultCountry ?? 'eg',
    countries: countriesOptions(),
    defaultMask,
    forceDialCode: false,
    disableDialCodeAndPrefix: true,
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
              <label htmlFor={name} className="block text-sm font-medium text-gray-200 mb-1">
                {label}
              </label>
            )}
            <div className="relative flex w-full">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center z-10">
                  <div className="relative group">
                    <button
                      type="button"
                      disabled={disabled || disableDropdown}
                      className={`h-full min-w-[120px] flex items-center gap-2 px-4 text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${error ? 'text-red-500' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <FlagImage iso2={country.iso2} className="w-6 h-4 rounded-[1px] object-cover" />
                        <span className="text-base">+{country.dialCode}</span>
                      </div>
                      <ChevronDownIcon className="h-5 w-5 text-white/70 ml-2" />
                    </button>
                    {/* Custom Dropdown */}
                    <div className="hidden group-focus-within:block absolute top-[calc(100%+8px)] left-0 w-[280px] max-h-[320px] overflow-y-auto bg-[#1a1a1a] rounded-xl border border-yellow-500/20 shadow-xl z-50 py-2">
                      {countriesOptions()?.map(c => {
                        const countryData = parseCountry(c);
                        return (
                          <button
                            key={countryData.iso2}
                            type="button"
                            onClick={() => {
                              setCountry(countryData.iso2);
                              // Update form value when country changes
                              const currentValue = inputValue.replace(/^\+\d+\s/, '').replace(/[^\d]/g, '');
                              onChange(`+${countryData.dialCode}${currentValue}`);
                            }}
                            className={`flex items-center gap-3 w-full py-3 px-4 hover:bg-white/5 text-left text-sm transition-colors ${country.iso2 === countryData.iso2 ? 'bg-white/10' : ''}`}
                          >
                            <FlagImage iso2={countryData.iso2} className="w-6 h-4 rounded-[1px] object-cover" />
                            <span className="text-white text-base font-medium">{countryData.name}</span>
                            <span className="text-gray-400 ml-auto text-base">+{countryData.dialCode}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <input
                  type="tel"
                  id={name}
                  placeholder={placeholder}
                  className={`block w-full rounded-xl border bg-[rgba(0,0,0,0.25)] ${error ? 'ring-2 ring-red-500 border-red-500' : 'focus:ring-2 focus:ring-yellow-500 border-yellow-500/20'} pl-[140px] pr-4 py-4 text-white placeholder-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base`}
                  value={inputValue.replace(/^\+\d+\s/, '')}
                  onChange={handleInputChange}
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
