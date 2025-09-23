'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import edge from 'assets/images/edge.png';
import primary from 'assets/images/primary.png';
import rounded from 'assets/images/rounded.png';
import * as yup from 'yup';
import Image from 'next/image'
import { ProfileForReadDTO } from 'types';
// Theme options with their respective icons
const themeOptions = [
  { id: 'basic', name: 'basic', icon: primary },
  { id: 'rounded', name: 'rounded', icon: rounded },
  { id: 'edge', name: 'edge', icon: edge },
];

// Color options from the screenshot
const colorOptions = [
  { id: 'purple', name: 'Purple', value: '#8B5CF6' },
  { id: 'blue', name: 'Blue', value: '#3B82F6' },
  { id: 'green', name: 'Green', value: '#10B981' },
  { id: 'yellow', name: 'Yellow', value: '#F59E0B' },
  { id: 'red', name: 'Red', value: '#EF4444' },
  { id: 'pink', name: 'Pink', value: '#EC4899' },
];

export interface CustomizationFormData {
  theme: string;
  iconColor: string;
  ColorMode: string;
  saveContact: boolean;
}

export interface CustomizationFormRef {
  submit: () => Promise<boolean>;
  getValues: () => CustomizationFormData;
}

interface CustomizationFormProps {
  initialData?: Partial<ProfileForReadDTO>;
}

const CustomizationForm = forwardRef<CustomizationFormRef, CustomizationFormProps>(({ initialData }, ref) => {

  const schema = yup.object().shape({
    theme: yup.string().default(''),
    iconColor: yup.string().default(''),
    ColorMode: yup.string().default(''),
    saveContact: yup.boolean().default(false),
  });

  const methods = useForm<CustomizationFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      theme: initialData?.theme || '',
      iconColor: initialData?.iconColor || '',
      ColorMode: initialData?.ColorMode || '',
      saveContact: initialData?.saveContact || false,
    },
  });

  const { watch, setValue, register } = methods;
  const selectedTheme = watch('theme');
  const selectedIconColor = watch('iconColor');
  const selectedBgColor = watch('ColorMode');

  useImperativeHandle(ref, () => ({
    submit: async () => {
      return new Promise<boolean>((resolve) => {
        methods.handleSubmit(
          () => resolve(true),
          () => resolve(false)
        )();
      });
    },
    getValues: () => methods.getValues(),
  }));

  return (
    <form className="space-y-8">
      {/* Theme Selection */}
      <div className="flex items-center justify-between mb-4 px-4 py-2 rounded-lg border border-[var(--main-color1)]">
        <div className="flex items-center gap-2">
          <span className="text-body">Save Button</span>
          <div className="relative group">
            <div className="tooltip" data-tip="hello">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="cursor-help"
              >
                <path
                  d="M8.00016 14.6663C11.6668 14.6663 14.6668 11.6663 14.6668 7.99967C14.6668 4.33301 11.6668 1.33301 8.00016 1.33301C4.3335 1.33301 1.3335 4.33301 1.3335 7.99967C1.3335 11.6663 4.3335 14.6663 8.00016 14.6663Z"
                  stroke="#FEC400"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 5.33301V8.66634"
                  stroke="#FEC400"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.99609 10.667H8.00208"
                  stroke="#FEC400"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            {...register('saveContact')}
            onChange={(e) => setValue('saveContact', e.target.checked, { shouldDirty: true })}
          />
          <div
            className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]"
          ></div>
        </label>
      </div>
      <div className="space-y-4">

        <div className="mt-4 overflow-x-auto pb-4">
          <div className="flex space-x-4 w-max">
            {themeOptions.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setValue('theme', theme.id, { shouldValidate: true })}
                className={`flex flex-col items-center p-4 rounded-lg border cursor-pointer w-40 ${selectedTheme === theme.id
                  ? 'border-[var(--primary-color1)] bg-[var(--primary-color1)] ring-2 ring-[var(--primary-color1)]'
                  : 'border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <div className="relative mb-2">
                  <Image
                    src={theme.icon}
                    alt={theme.name}
                    width={300}
                    height={300}
                  />
                </div>
                <span className={`text-sm font-medium ${selectedTheme !== theme.id ? 'dark:text-white text-black' : 'dark:text-[var(--primary-color1)] text-[var(--primary-color1)]'} text-center`}>
                  {theme.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Color Selection */}
      <div className="space-y-4 pt-6">
        <div className="flex flex-col p-4 rounded-xl" style={{ border: '1px solid #B0A18E', background: 'rgba(255, 244, 211, 0.10)' }}>

          <div className='flex items-center justify-between'>
            <h3 className="text-lg font-medium mb-3">Icon Color</h3>
            <label className="relative inline-flex items-center cursor-pointer mb-3">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={watch('iconColor').length > 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('iconColor', e.target.checked ? '#8B5CF6' : '', { shouldValidate: true })}
              />
              <div
                className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]"
              ></div>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <div
                key={color.id}
                onClick={() => setValue('iconColor', color.value, { shouldValidate: true })}
                className={`h-10 w-10 cursor-pointer rounded-full transition-transform hover:scale-110 ${selectedIconColor === color.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}

            {/* Custom Color Picker */}
            <div className="relative ">
              <input
                type="color"
                value={selectedIconColor.startsWith('#') ? selectedIconColor : '#8B5CF6'}
                onChange={(e) => setValue('iconColor', e.target.value, { shouldValidate: true })}
                className="h-12 w-12 cursor-pointer appearance-none rounded-full border-none bg-transparent"
                style={{
                  WebkitAppearance: 'none',
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center ">
                <span className="text-xl">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="space-y-4 pt-6">
        <div className="flex flex-col p-4 rounded-xl" style={{ border: '1px solid #B0A18E', background: 'rgba(255, 244, 211, 0.10)' }}>

          <div className='flex items-center justify-between'>
            <h3 className="text-lg font-medium mb-3">Background Color</h3>
            <label className="relative inline-flex items-center cursor-pointer mb-3">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={watch('ColorMode').length > 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('ColorMode', e.target.checked ? '#8B5CF6' : '', { shouldValidate: true })}
              />
              <div
                className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]"
              ></div>
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            {colorOptions.map((color) => (
              <div
                key={color.id}
                onClick={() => setValue('ColorMode', color.value, { shouldValidate: true })}
                className={`h-10 w-10 cursor-pointer rounded-full transition-transform hover:scale-110 ${selectedBgColor === color.value ? 'ring-2 ring-offset-2 ring-indigo-500' : ''}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}

            {/* Custom Color Picker */}
            <div className="relative ">
              <input
                type="color"
                value={selectedBgColor.startsWith('#') ? selectedBgColor : '#8B5CF6'}
                onChange={(e) => setValue('ColorMode', e.target.value, { shouldValidate: true })}
                className="h-12 w-12 cursor-pointer appearance-none rounded-full border-none bg-transparent"
                style={{
                  WebkitAppearance: 'none',
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center ">
                <span className="text-xl">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </form >
  );
});

CustomizationForm.displayName = 'CustomizationForm';

export default CustomizationForm;
