'use client';

import { useGetProfileQuery, useUpdateProfileMutation } from 'hooks/profile';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import EditProfileForm, { EditProfileFormRef } from './components/EditProfileForm';
import ImageCropModal from 'components/ui/ImageCropModal';
import CustomizationForm, { CustomizationFormRef } from './components/CustomizationForm';
import EditProfileContactForm, { EditProfileContactFormRef } from './components/EditProfileContactForm';
import CollapsibleSection from './components/CollapsibleSection';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useUploadProfileImageMutation, useUploadCoverImageMutation } from 'hooks/profile/mutations';
import { UnlockedButton } from 'components/subcriptions/subcriptionButtons';
import { useSubscriptionStatus } from 'hooks';
import Link from 'next/link';

export default function EditProfilePage() {
  const { data: profileData, isLoading } = useGetProfileQuery();
  const { onUploadProfileImage, isLoading: isUploadingProfileImage } = useUploadProfileImageMutation();
  const { onUploadCoverImage, isLoading: isUploadingCoverImage } = useUploadCoverImageMutation();

  const [coverImageUrl, setCoverImageUrl] = useState(profileData?.coverImage ? `https://fikrafarida.com/Media/Profiles/${profileData.coverImage}` : ''); // Replace with your default
  const [profileImageUrl, setProfileImageUrl] = useState(profileData?.imageFilename ? `https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}` : ''); // Replace with your default
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [showCoverCropModal, setShowCoverCropModal] = useState(false);
  const [selectedCoverImageFile, setSelectedCoverImageFile] = useState<File | null>(null);

  const profileFormRef = useRef<EditProfileFormRef>(null);
  const contactFormRef = useRef<EditProfileContactFormRef>(null);
  const customizationFormRef = useRef<CustomizationFormRef>(null);

  const { onUpdateProfile, isLoading: isUpdatingProfile } = useUpdateProfileMutation();
  const searchParams = useSearchParams();
  const customizationParam = searchParams?.get('customization');

  const hasProAccess = useSubscriptionStatus({
    subscriptionType: profileData?.type,
    subscriptionEndDate: profileData?.subscriptionEnddate
  });


  // Handle scrolling to customization section when the param is present
  useEffect(() => {
    if (customizationParam) {
      console.log('Customization param detected, will scroll after delay');
      
      const scrollToCustomization = () => {
        console.log('Attempting to scroll to customization section...');
        
        // Look for the Customization section by finding the button with "Customization" text
        const customizationButton = Array.from(document.querySelectorAll('button')).find(button => 
          button.textContent?.trim() === 'Customization'
        );
        
        if (customizationButton) {
          console.log('Found customization button:', customizationButton);
          
          // Find the parent CollapsibleSection div
          const sectionDiv = customizationButton.closest('div[class*="py-4"]');
          
          if (sectionDiv) {
            console.log('Found customization section div:', sectionDiv);
            
            // Scroll to the section
            sectionDiv.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Add highlight effect
            const targetElement = sectionDiv as HTMLElement;
            targetElement.style.transition = 'box-shadow 0.5s';
            targetElement.style.boxShadow = '0 0 0 2px var(--main-color1)';
            
            // Remove highlight after animation
            setTimeout(() => {
              targetElement.style.boxShadow = 'none';
            }, 2000);
            
            // Clean up URL
            setTimeout(() => {
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, '', cleanUrl);
            }, 1000);
            
            console.log('Successfully scrolled to customization section!');
          } else {
            console.log('Could not find customization section div');
          }
        } else {
          console.log('Could not find customization button');
        }
      };

      // Wait longer to ensure the CollapsibleSection is fully rendered and opened
      const timer = setTimeout(scrollToCustomization, 1000);

      // Cleanup
      return () => clearTimeout(timer);
    }
  }, [customizationParam]);

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
      const personalData = profileFormRef.current?.getValues() || {};
      const contactData = contactFormRef.current?.getValues() || {};
      const customizationData = customizationFormRef.current?.getValues() || {};
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
        contactData.websites?.forEach((website) => {
          if (website?.value) {
            transformedContactData[`websiteUrl`] = website.value;
          }
        })
      }

      // Combine the data
      const combinedData = {
        ...profileData,
        ...personalData,
        ...customizationData,
        ...transformedContactData,
      };

      await onUpdateProfile(combinedData);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };


  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      setSelectedCoverImageFile(file);
      setShowCoverCropModal(true);
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleCoverCropComplete = async (croppedFile: File) => {
    const formData = new FormData();
    formData.append('file', croppedFile);

    try {
      await onUploadCoverImage(formData);
      // Update the preview with the cropped image
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageUrl(reader.result as string);
      };
      reader.readAsDataURL(croppedFile);
    } catch (error) {
      console.error('Error uploading cropped cover image:', error);
    }
  };

  const handleProfileImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      setSelectedImageFile(file);
      setShowCropModal(true);
    }
    // Reset the input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    const formData = new FormData();
    formData.append('file', croppedFile);

    try {
      await onUploadProfileImage(formData);
      // Update the preview with the cropped image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImageUrl(reader.result as string);
      };
      reader.readAsDataURL(croppedFile);
    } catch (error) {
      console.error('Error uploading cropped image:', error);
    }
  };

  useEffect(() => {
    if (profileData) {
      setProfileImageUrl(profileData.imageFilename ? `https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}` : '');
      setCoverImageUrl(profileData.coverImage ? `https://fikrafarida.com/Media/Profiles/${profileData.coverImage}` : '');
    }
  }, [profileData])

  if (isLoading || isUpdatingProfile || isUploadingProfileImage || isUploadingCoverImage) {
    return <LoadingOverlay isLoading={isLoading || isUpdatingProfile || isUploadingProfileImage || isUploadingCoverImage} />;
  }

  return (
    <div className="w-full min-h-screen py-8">
      <div className="max-w-4xl mx-auto rounded-lg overflow-hidden mt-4">
        <div className="relative mx-[7px] h-48 bg-gray-200 rounded-2xl  flex items-center justify-center">
          <Image
            src={coverImageUrl}
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
          {/* <div className='flex justify-center gap-4 items-center w-full mb-6'>
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
          </div> */}

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
                hasProAccess={hasProAccess}
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Customization"
              openOption={customizationParam ? true : false}
              data-section="customization"
            >
              <>
                {
                  !hasProAccess ? (
                    <div
                      className="relative flex flex-col items-center justify-center gap-4 py-20 px-4 rounded-xl border border-[#BEAF9E] bg-[rgba(255,244,211,0.10)]"
                    >
                      <UnlockedButton />
                    </div>

                  ) : (
                    <CustomizationForm
                      ref={customizationFormRef}
                      initialData={profileData}
                    />
                  )
                }
              </>

            </CollapsibleSection>
            <div className="flex flex-col justify-center items-center w-full gap-2 mt-12">

              <button
                type="button"
                onClick={handleSectionUpdate}
                disabled={isUpdating}
                className={`w-[60%] px-6 py-3 bg-yellow-500 text-black rounded-2xl hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 text-sm font-medium ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
              >
                {isUpdating ? 'Updating...' : 'Update Profile'}
              </button>

              <Link href={`/${profileData?.username}`} className="mt-2 bg-[#FEF3C7] text-black font-medium w-[60%] px-6 py-3 rounded-2xl flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                  <path
                    d="M15.4698 8.33C14.8817 6.80882 13.8608 5.49331 12.5332 4.54604C11.2056 3.59878 9.62953 3.06129 7.99979 3C6.37005 3.06129 4.79398 3.59878 3.46639 4.54604C2.1388 5.49331 1.11787 6.80882 0.529787 8.33C0.490071 8.43985 0.490071 8.56015 0.529787 8.67C1.11787 10.1912 2.1388 11.5067 3.46639 12.454C4.79398 13.4012 6.37005 13.9387 7.99979 14C9.62953 13.9387 11.2056 13.4012 12.5332 12.454C13.8608 11.5067 14.8817 10.1912 15.4698 8.67C15.5095 8.56015 15.5095 8.43985 15.4698 8.33ZM7.99979 13C5.34979 13 2.54979 11.035 1.53479 8.5C2.54979 5.965 5.34979 4 7.99979 4C10.6498 4 13.4498 5.965 14.4648 8.5C13.4498 11.035 10.6498 13 7.99979 13Z"
                    fill="black"
                  />
                  <path
                    d="M8 5.5C7.40666 5.5 6.82664 5.67595 6.33329 6.00559C5.83994 6.33524 5.45543 6.80377 5.22836 7.35195C5.0013 7.90013 4.94189 8.50333 5.05765 9.08527C5.1734 9.66721 5.45912 10.2018 5.87868 10.6213C6.29824 11.0409 6.83279 11.3266 7.41473 11.4424C7.99667 11.5581 8.59987 11.4987 9.14805 11.2716C9.69623 11.0446 10.1648 10.6601 10.4944 10.1667C10.8241 9.67336 11 9.09334 11 8.5C11 7.70435 10.6839 6.94129 10.1213 6.37868C9.55871 5.81607 8.79565 5.5 8 5.5ZM8 10.5C7.60444 10.5 7.21776 10.3827 6.88886 10.1629C6.55996 9.94318 6.30362 9.63082 6.15224 9.26537C6.00087 8.89991 5.96126 8.49778 6.03843 8.10982C6.1156 7.72186 6.30608 7.36549 6.58579 7.08579C6.86549 6.80608 7.22186 6.6156 7.60982 6.53843C7.99778 6.46126 8.39992 6.50087 8.76537 6.65224C9.13082 6.80362 9.44318 7.05996 9.66294 7.38886C9.8827 7.71776 10 8.10444 10 8.5C10 9.03043 9.78929 9.53914 9.41421 9.91421C9.03914 10.2893 8.53043 10.5 8 10.5Z"
                    fill="black"
                  />
                </svg>
                Preview
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Image Crop Modal */}
      {showCropModal && selectedImageFile && (
        <ImageCropModal
          isOpen={showCropModal}
          onClose={() => setShowCropModal(false)}
          imageFile={selectedImageFile}
          onCropComplete={handleCropComplete}
          cropType="profile"
        />
      )}

      {/* Cover Image Crop Modal */}
      {showCoverCropModal && selectedCoverImageFile && (
        <ImageCropModal
          isOpen={showCoverCropModal}
          onClose={() => setShowCoverCropModal(false)}
          imageFile={selectedCoverImageFile}
          onCropComplete={handleCoverCropComplete}
          cropType="cover"
        />
      )}
    </div>
  );
}