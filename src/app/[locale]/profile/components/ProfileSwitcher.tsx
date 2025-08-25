'use client';

import { useAuth } from 'context/AuthContext';
import { Profile } from 'types/api/AuthForReadDTo';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { useGetProfilesQuery, useGetProfileQuery } from 'hooks/profile';
import LoadingSpinner from 'components/ui/LoadingSpinner';
import { ProfileForReadDTO } from 'types';
import { useRouter } from 'next/navigation';
import { ProButton } from 'components/subcriptions/subcriptionButtons';
import { useSubscriptionStatus } from 'hooks';
interface ProfileSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to convert ProfileForReadDTO to Profile format for AuthContext
const mapProfileDTOToProfile = (profileDTO: ProfileForReadDTO): Profile => {
  return {
    userPk: profileDTO.userPk,
    username: profileDTO.username,
    fullname: profileDTO.fullname,
    email: profileDTO.email,
    imageFilename: profileDTO.imageFilename,
    token: profileDTO.token,
    expire_date: profileDTO.subscriptionEnddate,
    isDefault: false, // Default value, may need to be determined by other logic
  };
};

export default function ProfileSwitcher({ isOpen, onClose }: ProfileSwitcherProps) {
  const { profiles, activeProfile, switchProfile, setAuth } = useAuth();
  const { data: profilesData, isLoading } = useGetProfilesQuery();

  const { data: profileData, onGetProfile } = useGetProfileQuery();
  const hasProAccess = useSubscriptionStatus({
    subscriptionType: profileData?.type,
    subscriptionEndDate: profileData?.subscriptionEnddate
  });

  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Sync profiles data from API to localStorage when received
  useEffect(() => {
    if (profilesData && profilesData.length > 0) {
      // Map API profiles to the format expected by AuthContext
      const mappedProfiles = profilesData.map(mapProfileDTOToProfile);

      // Store profiles in localStorage
      localStorage.setItem('user_profiles', JSON.stringify(mappedProfiles));

      // If we have profiles from API but not in context, update the auth context
      if (profiles.length === 0 && mappedProfiles.length > 0) {
        // Create a minimal AuthForReadDTO structure to update the context
        setAuth({
          token: mappedProfiles[0].token,
          expire_date: mappedProfiles[0].expire_date,
          profiles: mappedProfiles,
          sucess: true,
          errorcode: 0,
          message: null
        });
      }
    }
  }, [profilesData, profiles.length, setAuth]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (mounted && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mounted, isOpen, onClose]);

  const handleProfileSwitch = (profile: ProfileForReadDTO) => {
    switchProfile(profile.userPk);
    setTimeout(() => {
      onGetProfile();
    }, 0);
    onClose();
  };

  const handleAddNewProfile = () => {
    if (!hasProAccess) {
      return;
    }
    onClose();
    router.push('/profile/add');
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <>
      {/* Backdrop - Full screen overlay */}
      <div
        className="fixed inset-0 z-[9999] bg-black bg-opacity-50 animate-fade-in-fast"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] bg-[#4A4A48] rounded-2xl py-6 px-4 shadow-lg w-[90%] max-w-md"
        style={{
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex justify-center items-center mb-4">
          <div className="w-1/3 h-1 bg-[#FEC400] rounded-full"></div>
        </div>

        <h2 className="text-center text-2xl font-bold text-[#FEC400] mb-4">Profiles</h2>

        {isLoading &&
          <div className='flex justify-center items-center h-full'>
            <LoadingSpinner />
          </div>
        }
        {!isLoading &&
          <div className="mb-4">
            <p className="text-gray-300 mb-2">Current Profile:</p>
          </div>
        }

        <div className="space-y-4">

          {/* Existing Profiles */}
          {profilesData?.map((profile) => (
            <div
              key={profile.userPk}
              className={`px-4 py-6 rounded-lg cursor-pointer ${activeProfile?.userPk === profile.userPk
                ? 'border-2 border-[#FEC400] bg-[#646458]'
                : 'bg-[#646458]/70 hover:bg-[#646458]'
                }`}
              onClick={() => handleProfileSwitch(profile)}
            >
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  {profile.imageFilename ? (
                    <Image
                      src={`https://fikrafarida.com/Media/Profiles/${profile.imageFilename}`}
                      alt={profile.fullname}
                      className="w-16 h-16 rounded-full bg-black"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-2xl text-white">{profile.fullname.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{profile.fullname}</h3>
                  <span className="text-sm text-gray-400">{profile.jobTitle}</span>

                  <div className="flex items-center gap-2 mt-4">
                    <span className="px-3 py-1 bg-[#FEC400] text-black text-[14px] font-semibold rounded-full">
                      {profile.profileTitle ? profile.profileTitle : profile.type === 2 ? 'Pro' : 'Personal'}
                    </span>
                    {activeProfile?.userPk === profile.userPk && (
                      <span className="text-[#FEC400]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Profile Button */}
          <div
            className="gap-2 px-4 py-6 rounded-lg cursor-pointer bg-[#646458]/70 hover:bg-[#646458] flex items-center justify-center"
            onClick={handleAddNewProfile}
          >
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-lg border border-[#FEC400] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FEC400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--main-color1)]">Add New Profile</h3>
              </div>
            </div>
            {!hasProAccess && <ProButton />}

          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
