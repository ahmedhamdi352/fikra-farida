'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProfileForReadDTO } from 'types';

interface ProfilePreviewProps {
  profileData: ProfileForReadDTO;
}

export default function ProfilePreview({ profileData }: ProfilePreviewProps) {
  const [showContact, setShowContact] = useState(false);

  if (!profileData) {
    return <div className="text-center py-8">Loading profile data...</div>;
  }

  const userImageUrl = profileData.imageFilename 
    ? `https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}` 
    : '/images/default-avatar.png';

  const handleConnectClick = () => {
    setShowContact(true);
  };
  
  return (
    <div className="w-full max-w-screen-md mx-auto">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-h3 font-bold text-center">Profile Preview</h1>
        {profileData.isLocked && (
          <div className="mt-2 flex items-center bg-amber-50 text-amber-800 px-4 py-2 rounded-lg border border-amber-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>This profile is currently locked</span>
          </div>
        )}
      </div>
      
      <div className="card-container rounded-3xl p-6 flex flex-col items-center">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
          <Image 
            src={userImageUrl}
            alt={profileData.username || 'User Profile'}
            width={128}
            height={128}
            className="object-cover w-full h-full"
          />
        </div>

        {/* User Info */}
        <h2 className="text-h4 font-bold mb-1">{profileData.username}</h2>
        <p className="text-body text-gray-400 mb-4">{profileData.jobTitle}</p>
        
        <div className="w-full space-y-4 mt-4">
          {/* Bio/About */}
          {profileData.bio && (
            <div className="mb-4">
              <h3 className="text-h5 font-semibold mb-2">About</h3>
              <p className="text-body">{profileData.bio}</p>
            </div>
          )}
          
          {/* Contact Info - Only shown after clicking Connect */}
          {showContact ? (
            <div className="space-y-3 mt-4">
              <h3 className="text-h5 font-semibold">Contact Information</h3>
              
              {profileData.email && (
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <a href={`mailto:${profileData.email}`} className="text-body text-[--main-color1]">
                    {profileData.email}
                  </a>
                </div>
              )}
              
              {profileData.phoneNumber1 && (
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <a href={`tel:${profileData.phoneNumber1}`} className="text-body text-[--main-color1]">
                    {profileData.phoneNumber1}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={handleConnectClick}
              disabled={profileData.isLocked}
              className={`w-full text-body px-6 py-3 rounded-2xl mt-4 ${profileData.isLocked 
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                : 'bg-[#FEC400] text-black hover:bg-[#E5B000]'}`}
            >
              {profileData.isLocked ? 'Profile Locked' : 'Connect'}
            </button>
          )}
          
          {/* View Full Profile Button */}
          <Link 
            href={`https://www.fikrafarida.com/${profileData.username}`}
            className="block w-full text-center border border-[#FEC400] text-[#FEC400] px-6 py-3 rounded-2xl mt-4"
          >
            View Full Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
