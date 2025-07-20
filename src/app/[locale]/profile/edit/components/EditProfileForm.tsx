'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import TextInput from 'components/forms/text-input';
import TextArea from 'components/forms/text-area';

export interface ProfileFormData {
  fullname: string;
  bio?: string;
  company?: string;
  jobTitle?: string;
}

export interface EditProfileFormRef {
  submit: () => Promise<boolean>;
  getValues: () => ProfileFormData;
}

interface EditProfileFormProps {
  initialData?: Partial<ProfileForReadDTO>;
}

const EditProfileForm = forwardRef<EditProfileFormRef, EditProfileFormProps>(({ initialData }, ref) => {

  const schema = yup.object().shape({
    fullname: yup.string().required('Full name is required'),
    bio: yup.string().optional(),
    company: yup.string().optional(),
    jobTitle: yup.string().optional(),
  });

  const methods = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: initialData?.fullname || '',
      jobTitle: initialData?.jobTitle || '',
      company: initialData?.company || '',
      bio: initialData?.bio || '',
    },
  });

  const { control, handleSubmit } = methods;

  // Expose form methods via ref
  useImperativeHandle(ref, () => ({
    // Trigger form validation and return whether it's valid
    submit: async () => {
      return new Promise<boolean>((resolve) => {
        handleSubmit(
          () => resolve(true),  // onValid
          () => resolve(false)  // onInvalid
        )();
      });
    },
    // Get current form values
    getValues: () => methods.getValues(),
  }));

  // onSubmit is now handled through the ref's submit method

  return (
    <form id="profile-form" className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <TextInput<ProfileFormData>
            name="fullname"
            label='Full Name'
            control={control}
            placeholder='Enter your full name'
          />
        </div>

        <div className="sm:col-span-3">
          <TextInput<ProfileFormData>
            name="jobTitle"
            label='Job Title'
            control={control}
            placeholder='Enter your job title'
          />
        </div>

        <div className="sm:col-span-6">
          <TextInput<ProfileFormData>
            name="company"
            label='Company'
            control={control}
            placeholder='Enter your company name'
          />
        </div>

        <div className="sm:col-span-6">
          <TextArea<ProfileFormData>
            name="bio"
            label='Bio'
            control={control}
            placeholder='Tell us about yourself...'
            className="min-h-[100px]"
          />
        </div>
      </div>

    </form>
  );
});

EditProfileForm.displayName = 'EditProfileForm';

export default EditProfileForm;
