'use client';

import { useGetProfileQuery, useUpdateProfileMutation } from 'hooks/profile';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import EditProfileForm, { EditProfileFormRef } from './components/EditProfileForm';
import EditProfileContactForm, { EditProfileContactFormRef } from './components/EditProfileContactForm';
import CollapsibleSection from './components/CollapsibleSection';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function EditProfilePage() {
  const { data: profileData, isLoading } = useGetProfileQuery();
  const [coverImageUrl, setCoverImageUrl] = useState(profileData?.coverImage || '/default-cover.jpg'); // Replace with your default
  const [profileImageUrl, setProfileImageUrl] = useState(profileData?.imageFilename ? `https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}` : ''); // Replace with your default
  const [isUpdating, setIsUpdating] = useState(false);

  const profileFormRef = useRef<EditProfileFormRef>(null);
  const contactFormRef = useRef<EditProfileContactFormRef>(null);

  const { onUpdateProfile, isLoading: isUpdatingProfile } = useUpdateProfileMutation();

  const handleSectionUpdate = async () => {
    setIsUpdating(true);
    try {
      // Validate both forms
      const [isProfileValid, isContactValid] = await Promise.all([
        profileFormRef.current?.submit() ?? Promise.resolve(false),
        contactFormRef.current?.submit() ?? Promise.resolve(false),
      ]);

      if (!isProfileValid || !isContactValid) {
        toast.error('Please fix the form errors before saving');
        return;
      }

      // If both forms are valid, get their values
      const profileData = profileFormRef.current?.getValues() || {};
      const contactData = contactFormRef.current?.getValues() || {};

      // Define interfaces for form data
      interface ContactField {
        value: string;
      }

      interface ContactFormData {
        showEmail: boolean;
        showPhone: boolean;
        showWebsite: boolean;
        emails?: ContactField[];
        phones?: ContactField[];
        websites?: ContactField[];
      }

      // Type guard for contactData
      const isContactData = (data: unknown): data is ContactFormData => {
        return (
          data !== null &&
          typeof data === 'object' &&
          'showEmail' in data &&
          'showPhone' in data &&
          'showWebsite' in data &&
          typeof (data as ContactFormData).showEmail === 'boolean' &&
          typeof (data as ContactFormData).showPhone === 'boolean' &&
          typeof (data as ContactFormData).showWebsite === 'boolean'
        );
      };

      // Transform contact data to use flat keys
      const transformedContactData: Record<string, unknown> = {
        showEmail: false,
        showPhone: false,
        showWebsite: false,
      };

      if (isContactData(contactData)) {
        transformedContactData.showEmail = contactData.showEmail;
        transformedContactData.showPhone = contactData.showPhone;
        transformedContactData.showWebsite = contactData.showWebsite;

        // Map emails to email1, email2, etc.
        contactData.emails?.forEach((email, index) => {
          if (email?.value) {
            if (index === 0) {
              transformedContactData[`email`] = email.value;
            } else {
              transformedContactData[`email${index}`] = email.value;
            }
          }
        });

        // Map phones to phoneNumber1, phoneNumber2, etc.
        contactData.phones?.forEach((phone, index) => {
          if (phone?.value) {
            // Remove any non-digit characters except the leading +
            const formattedPhone = phone.value.replace(/[^\d+]/g, '');
            transformedContactData[`phoneNumber${index + 1}`] = formattedPhone;
          }
        });

        // Map websites if needed (assuming single website)
        contactData.websites?.forEach((website, index) => {
          if (website?.value) {
            transformedContactData[`websiteUrl${index + 1}`] = website.value;
          }
        })
      }

      // Combine the data
      const combinedData = {
        ...profileData,
        ...transformedContactData,
        coverImageUrl: coverImageUrl || undefined,
        profileImageUrl: profileImageUrl || undefined
      };

      console.log('Submitting data:', combinedData);
      await onUpdateProfile(combinedData);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSectionRemove = (section: string) => {
    if (confirm(`Are you sure you want to remove ${section}?`)) {
      toast.info(`Removing ${section}...`);
    }
  };

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageUrl(reader.result as string);
        toast.info("Cover image selected. Implement actual upload logic.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
        toast.info("Profile image selected. Implement actual upload logic.");
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (profileData) {
      setProfileImageUrl(profileData.imageFilename ? `https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}` : '');
    }
  }, [profileData])

  if (isLoading || isUpdatingProfile) {
    return <LoadingOverlay isLoading={isLoading || isUpdatingProfile} />;
  }

  return (
    <div className="w-full min-h-screen py-8">
      <div className="max-w-4xl mx-auto rounded-lg overflow-hidden mt-4">
        <div className="relative w-full h-48 bg-gray-200 rounded-2xl  flex items-center justify-center">
          <Image
            src={coverImageUrl || 'assets/images/cover.jpeg'}
            alt="Cover"
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover rounded-2xl"
            priority
          />
          <label htmlFor="cover-image-upload" className="absolute top-4 right-4 cursor-pointer p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-md">
            {/* Replace with your actual icon component */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <input
              id="cover-image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCoverImageUpload(e)}
            />
          </label>
        </div>

        <div className="relative -mt-20 flex justify-center z-10">
          <div className="relative w-40 h-40 overflow-hidden">
            <Image
              src={profileImageUrl}
              alt="Profile"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover rounded-full"
              priority
            />
            <label htmlFor="profile-image-upload" className="absolute bottom-2 right-0 z-[1000] cursor-pointer p-2 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-md">
              {/* Replace with your actual icon component */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProfileImageUpload(e)}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-around py-6 text-center">
          <div>
            <p className="text-lg font-semibold text-[var(--main-color1)]">plan</p>
            <p className="">{profileData?.type === 2 ? 'Pro' : 'Personal'}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[var(--main-color1)]">products</p>
            <p className="">{profileData?.LinkedProducts.length}</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[var(--main-color1)]">profile</p>
            <p className="">{JSON.parse(localStorage.getItem('user_profiles') || '[]').length}</p>
          </div>
        </div>

        <div className="px-6 py-5 ">
          <div className='flex justify-center gap-4 items-center w-full mb-6'>
            <div className='flex flex-col gap-1 w-[50%]'>
              <p className='text-[var(--main-color1)] font-normal text-[12px]'>
                profile title
              </p>
              <div className='flex justify-start items-center border border-[var(--main-color1)] rounded-[5px] p-2'>
                <p className='text-[var(--main-color1)] font-semibold pr-6 text-start text-[12px]'>
                  {profileData?.fullname}
                </p>
              </div>
            </div>

            <div className='flex flex-col gap-1 w-[50%]'>
              <p className='text-[var(--main-color1)] font-normal text-[12px]'>
                User Name
              </p>
              <div className='flex justify-start items-center border border-[var(--main-color1)] rounded-[5px] p-2'>
                <p className='text-[var(--main-color1)] font-semibold pr-6 text-start text-[12px]'>
                  {profileData?.username}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <CollapsibleSection
              title="Personal Details"
            >
              <EditProfileForm
                ref={profileFormRef}
                initialData={profileData}
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Contact Details"
            >
              <EditProfileContactForm
                ref={contactFormRef}
                initialData={profileData}
              />
            </CollapsibleSection>
            <div className="flex flex-col justify-center gap-2 mt-12">

              <button
                type="button"
                onClick={handleSectionUpdate}
                disabled={isUpdating}
                className={`px-6 py-3 bg-yellow-500 text-black rounded-2xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 text-sm font-medium ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>

              <button
                type="button"
                onClick={() => handleSectionRemove('profile')}
                className="px-6 py-2  text-[var(--main-color1)] rounded-2xl text-sm font-medium"
              >
                Remove Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}