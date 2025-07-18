'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import TextInput from 'components/forms/text-input';
import { useUpdateProfileMutation } from 'hooks/profile';
import { useTranslations } from 'next-intl';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';

interface ProfileFormData {
  username: string;
  fullname: string; // Note: Lowercase 'n' to match ProfileForReadDTO
  email: string;
  bio?: string;
  phoneNumber1?: string;
  // website field removed as it's not in ProfileForReadDTO
  address?: string;
  jobTitle?: string;
}

interface EditProfileFormProps {
  initialData?: Partial<ProfileForReadDTO>;
  onSuccess?: () => void;
}

export default function EditProfileForm({ initialData, onSuccess }: EditProfileFormProps) {
  const t = useTranslations('profile');
  const { onUpdateProfile } = useUpdateProfileMutation();

  const schema = yup.object().shape({
    username: yup.string().required(t('validation.usernameRequired') || 'Username is required'),
    fullname: yup.string().required(t('validation.fullNameRequired') || 'Full name is required'),
    email: yup.string()
      .required(t('validation.emailRequired') || 'Email is required')
      .email(t('validation.emailInvalid') || 'Invalid email format'),
    bio: yup.string(),
    phoneNumber1: yup.string(),
    website: yup.string().url(t('validation.websiteInvalid') || 'Invalid website URL'),
    address: yup.string(),
    jobTitle: yup.string(),
  });

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: initialData?.username || '',
      fullname: initialData?.fullname || '',
      email: initialData?.email || '',
      bio: initialData?.bio || '',
      phoneNumber1: initialData?.phoneNumber1 || '',
      // website field removed as it's not in ProfileForReadDTO
      address: initialData?.address || '',
      jobTitle: initialData?.jobTitle || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await onUpdateProfile(data);
      onSuccess?.();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <form id="profile-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <TextInput<ProfileFormData>
            name="username"
            label={t('form.username') || 'Username'}
            control={control}
            disabled={isSubmitting}
            placeholder={t('form.usernamePlaceholder') || 'Enter your username'}
          />
        </div>

        <div className="sm:col-span-3">
          <TextInput<ProfileFormData>
            name="fullname"
            label={t('form.fullName') || 'Full Name'}
            control={control}
            disabled={isSubmitting}
            placeholder={t('form.fullNamePlaceholder') || 'Enter your full name'}
          />
        </div>

        <div className="sm:col-span-6">
          <TextInput<ProfileFormData>
            name="email"
            type="email"
            label={t('form.email') || 'Email'}
            control={control}
            disabled={isSubmitting}
            placeholder={t('form.emailPlaceholder') || 'Enter your email'}
          />
        </div>

        <div className="sm:col-span-6">
          <TextInput<ProfileFormData>
            name="bio"
            label={t('form.bio') || 'Bio'}
            control={control}
            disabled={isSubmitting}
            placeholder={t('form.bioPlaceholder') || 'Tell us about yourself...'}
            className="min-h-[100px]"
          />
        </div>

        <div className="sm:col-span-3">
          <TextInput<ProfileFormData>
            name="phoneNumber1"
            label={t('form.phone') || 'Phone'}
            control={control}
            disabled={isSubmitting}
            placeholder={t('form.phonePlaceholder') || 'Enter your phone number'}
          />
        </div>

        <div className="sm:col-span-6">
          <TextInput<ProfileFormData>
            name="address"
            label={t('form.location') || 'Address'}
            control={control}
            disabled={isSubmitting}
            placeholder={t('form.locationPlaceholder') || 'Enter your address'}
          />
        </div>

        <div className="sm:col-span-6">
          <TextInput<ProfileFormData>
            name="jobTitle"
            label={t('form.jobTitle') || 'Job Title'}
            control={control}
            disabled={isSubmitting}
            placeholder={t('form.jobTitlePlaceholder') || 'Enter your job title'}
          />
        </div>
      </div>

      <LoadingOverlay isLoading={isSubmitting} />
    </form>
  );
}
