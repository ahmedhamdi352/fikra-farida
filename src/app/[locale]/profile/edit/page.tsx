'use client';

import { useTranslations } from 'next-intl';
import { useGetProfileQuery } from 'hooks/profile';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import EditProfileForm from './components/EditProfileForm';
import { toast } from 'react-toastify';

export default function EditProfilePage() {

  const t = useTranslations('profile');
  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();



  const handleSuccess = async () => {
    toast.success(t('updateSuccess') || 'Profile updated successfully');
    // Refresh the profile data
    await onGetProfile();
  };

  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />;
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 ">
      <div className="max-w-4xl mx-auto  rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">{t('editProfile')}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t('editProfileDescription')}
          </p>
        </div>

        <div className="p-6 space-y-8">
          <EditProfileForm
            initialData={profileData}
            onSuccess={handleSuccess}
          />

          <div className="flex items-center justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => { }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              form="profile-form"
              className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {t('saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
