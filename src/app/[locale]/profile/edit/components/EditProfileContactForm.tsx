'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import TextInput from 'components/forms/text-input';
import { PhoneInput } from 'components/forms/phone-input';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ProButton } from 'components/subcriptions/subcriptionButtons';

export interface ContactField {
  value: string;
}

export interface ProfileContactFormData {

  emails: ContactField[];
  phones: ContactField[];
  websites: ContactField[];
}

export interface EditProfileContactFormRef {
  submit: () => Promise<boolean>;
  getValues: () => ProfileContactFormData;
}

interface EditProfileContactFormProps {
  initialData?: Partial<ProfileForReadDTO>;
  hasProAccess?: boolean;
}

const EditProfileContactForm = forwardRef<EditProfileContactFormRef, EditProfileContactFormProps>(({ initialData, hasProAccess }, ref) => {
  const defaultValues: ProfileContactFormData = {

    emails: initialData?.email ? [{ value: initialData.email }] : [{ value: '' }],
    phones: [{ value: initialData?.phoneNumber1 || '' }],
    websites: initialData?.websiteUrl ? [{ value: initialData.websiteUrl }] : [{ value: '' }]
  };

  // Define the schema with proper typing for ProfileContactFormData
  const schema: yup.ObjectSchema<ProfileContactFormData> = yup.object({
    emails: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().email('Please enter a valid email').required('Email is required'),
        })
      )
      .min(1, 'At least one email is required'),
    phones: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().optional(),
        })
      ),
    websites: yup
      .array()
      .of(
        yup.object().shape({
          value: yup.string().url('Please enter a valid URL').optional(),
        })
      )
  }) as yup.ObjectSchema<ProfileContactFormData>;

  const methods = useForm<ProfileContactFormData>({
    resolver: yupResolver(schema),
    defaultValues
  });

  const { control, handleSubmit } = methods;

  const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
    control,
    name: 'emails'
  });

  const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
    control,
    name: 'phones'
  });

  const { fields: websiteFields, append: appendWebsite, remove: removeWebsite } = useFieldArray({
    control,
    name: 'websites'
  });

  // Expose form methods via ref
  useImperativeHandle(ref, () => ({
    submit: async () => {
      return new Promise<boolean>((resolve) => {
        handleSubmit(
          () => resolve(true),
          () => resolve(false)
        )();
      });
    },
    getValues: () => {
      return {
        ...methods.getValues(),
        showEmail: showEmail,
        showPhone: showPhone,
        showWebsite: showWebsite
      };
    },
  }));

  const [showEmail, setShowEmail] = useState(initialData?.showEmail ?? true);
  const [showPhone, setShowPhone] = useState(initialData?.showPhone ?? true);
  const [showWebsite, setShowWebsite] = useState(initialData?.showWebsite ?? true);

  const renderFieldGroup = (
    fields: { id: string; value: string; }[],
    fieldName: 'emails' | 'phones' | 'websites',
    label: string,
    placeholder: string,
    onAdd: () => void,
    onRemove: (index: number) => void,
  ) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {/* <label className="block text-sm font-medium text-gray-700">{label}</label> */}

      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center justify-center space-x-2">
          <div className="flex-1">
            {fieldName === 'phones' ? (
              <PhoneInput
                name={`${fieldName}.${index}.value`}
                control={control}
                placeholder={placeholder}
                label={label}
                defaultCountry="eg"
                key={`${fieldName}.${index}.value`}
                defaultValue={field.value}
              />
            ) : (
              <TextInput
                name={`${fieldName}.${index}.value`}
                type={fieldName === 'emails' ? 'email' : 'text'}
                control={control}
                placeholder={placeholder}
                label={label}
                disabled={fieldName === 'websites' && hasProAccess}
              />
            )}
          </div>
          <div className="flex flex-col items-center gap-2 mt-6">
            <div className='flex flex-col items-center gap-2'>

              {index === 0 && <label className="relative inline-flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={fieldName === 'emails' ? showEmail : fieldName === 'phones' ? showPhone : showWebsite}
                  onChange={(e) => {
                    if (fieldName === 'emails') {
                      setShowEmail(e.target.checked);
                    } else if (fieldName === 'phones') {
                      setShowPhone(e.target.checked);
                    } else {
                      setShowWebsite(e.target.checked);
                    }
                  }}
                />
                {fieldName !== 'websites' ? (<div className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]">
                </div>) : hasProAccess ? <ProButton /> : <div className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]">
                </div>}

              </label>}

              {/* {fields.length < 2 && <button
                type="button"
                onClick={onAdd}
                className="inline-flex items-center px-3 py-1.5 border border-[var(--main-color1)] shadow-sm text-xs font-medium rounded-full text-[var(--main-color1)] bg-transparent hover:bg-[var(--main-color1)] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FEC400] transition-colors"
              >
                <PlusIcon className="h-3.5 w-3.5 mr-1.5" />
                Add
              </button>} */}
            </div>

            {fields.length > 1 && index !== 0 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none transition-colors"
                title="Remove"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <form id="profile-contact-form" className="space-y-6">
      {renderFieldGroup(
        emailFields,
        'emails',
        'Email Addresses',
        'Enter email address',
        () => appendEmail({ value: '' }),
        (index) => removeEmail(index),
      )}

      {renderFieldGroup(
        phoneFields,
        'phones',
        'Phone Numbers',
        'Enter phone number',
        () => appendPhone({ value: '' }),
        (index) => removePhone(index),
      )}

      {renderFieldGroup(
        websiteFields,
        'websites',
        'Website URLs',
        'Enter website URL',
        () => appendWebsite({ value: '' }),
        (index) => removeWebsite(index),
      )}
    </form>
  );
});

EditProfileContactForm.displayName = 'EditProfileContactForm';

export default EditProfileContactForm;
