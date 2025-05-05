'use client';

import Image from 'next/image';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';

interface ProfileInformationProps {
  profileData?: ProfileForReadDTO;
  withEdit?: boolean;
  withSwitch?: boolean;
}

export default function ProfileInformation({ profileData, withEdit, withSwitch }: ProfileInformationProps) {
  if (!profileData) return null;

  return (
    <div className="relative w-full px-4 sm:px-0 mb-6">
      {withEdit && <button className="absolute -top-2 -right-2 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.0379 3.02025L8.15793 10.9003C7.85793 11.2003 7.55793 11.7903 7.49793 12.2203L7.06793 15.2303C6.90793 16.3203 7.67793 17.0803 8.76793 16.9303L11.7779 16.5003C12.1979 16.4403 12.7879 16.1403 13.0979 15.8403L20.9779 7.96025C22.3379 6.60025 22.9779 5.02025 20.9779 3.02025C18.9779 1.02025 17.3979 1.66025 16.0379 3.02025Z" stroke="#FEC400" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14.9102 4.15039C15.5802 6.54039 17.4502 8.41039 19.8502 9.09039" stroke="#FEC400" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          {profileData.imageFilename && (
            <>
              <Image
                src={`https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}`}
                alt="Profile"
                className="w-28 h-28 rounded-full bg-black"
                width={150}
                height={150}
              />
              {profileData.bio && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-body bg-[#646458] text-[var(--main-color1)] max-w-[150px] truncate">
                {profileData.bio}
              </div>}
            </>
          )}
        </div>
        <div className="flex flex-col py-2">
          <div className='flex items-center gap-2'>
            <h1 className="text-md font-semibold ">{profileData.fullname}</h1>
            {withSwitch && <p className="text-gray-400 underline cursor-pointer">Switch Account</p>}
          </div>
          <p className="text-gray-400 text-sm">{profileData.jobTitle}</p>
        </div>
      </div>
    </div>
  );
}