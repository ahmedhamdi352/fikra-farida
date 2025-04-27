'use client';

import { useState, useEffect } from 'react';
import { useGetProfileQuery } from 'hooks/profile/queries';
import Image from 'next/image';
import LoadingOverlay from 'components/ui/LoadingOverlay';

export default function ProfileContent() {
  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();
  const [collectInfo, setCollectInfo] = useState(true);
  const [directLinkMode, setDirectLinkMode] = useState(false);

  useEffect(() => {
    onGetProfile()
  }, []);

  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />;
  }

  if (!profileData) {
    return <div>No profile data found</div>;
  }

  return (
    <div className="w-full max-w-screen-md  py-8">
      <div className="card-container rounded-3xl p-6">
        <div className="relative w-full px-4 sm:px-0 mb-6">
          <button className="absolute -top-2 -right-2 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16.0379 3.02025L8.15793 10.9003C7.85793 11.2003 7.55793 11.7903 7.49793 12.2203L7.06793 15.2303C6.90793 16.3203 7.67793 17.0803 8.76793 16.9303L11.7779 16.5003C12.1979 16.4403 12.7879 16.1403 13.0979 15.8403L20.9779 7.96025C22.3379 6.60025 22.9779 5.02025 20.9779 3.02025C18.9779 1.02025 17.3979 1.66025 16.0379 3.02025Z" stroke="#FEC400" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14.9102 4.15039C15.5802 6.54039 17.4502 8.41039 19.8502 9.09039" stroke="#FEC400" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
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
                  {profileData.bio && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs bg-white text-black max-w-[150px] truncate">
                    {profileData.bio}
                  </div>}
                </>
              )}
            </div>
            <div className="flex flex-col py-2">
              <h1 className="text-lg font-semibold ">{profileData.fullname}</h1>
              <p className="text-gray-400 text-sm">{profileData.jobTitle}</p>
            </div>
          </div>
        </div>

        <div className="my-6">
          <div className="flex items-center justify-between mb-4 px-4 py-2 rounded-lg border border-[var(--main-color1)]">
            <div className="flex items-center gap-2">
              <span className="text-white">collect info</span>
              <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="cursor-help">
                  <path d="M8.00016 14.6663C11.6668 14.6663 14.6668 11.6663 14.6668 7.99967C14.6668 4.33301 11.6668 1.33301 8.00016 1.33301C4.3335 1.33301 1.3335 4.33301 1.3335 7.99967C1.3335 11.6663 4.3335 14.6663 8.00016 14.6663Z" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 5.33301V8.66634" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.99609 10.667H8.00208" stroke="#FEC400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-white text-black text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap hidden md:block">
                  Collect visitor information
                </div>
              </div>
            </div>
            <button
              onClick={() => setCollectInfo(!collectInfo)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${collectInfo ? 'bg-[#D9D9D9]' : 'bg-[#D9D9D9]'}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ease-in-out ${collectInfo ? 'right-1 bg-[var(--main-color1)]' : 'left-1 bg-[#7B7B7B]'
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between mb-4 px-4 py-2 rounded-lg border border-[var(--main-color1)]">
            <div className="flex items-center gap-2">
              <span className="text-white">Direct Link Mode</span>
              <div className="relative group">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="cursor-help">
                  <path d="M8.00016 14.6663C11.6668 14.6663 14.6668 11.6663 14.6668 7.99967C14.6668 4.33301 11.6668 1.33301 8.00016 1.33301C4.3335 1.33301 1.3335 4.33301 1.3335 7.99967C1.3335 11.6663 4.3335 14.6663 8.00016 14.6663Z" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 5.33301V8.66634" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7.99609 10.667H8.00208" stroke="#FEC400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-white text-black text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap hidden md:block">
                  Direct access to your profile
                </div>
              </div>
            </div>
            <button
              onClick={() => setDirectLinkMode(!directLinkMode)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-200 ease-in-out ${directLinkMode ? 'bg-[#D9D9D9]' : 'bg-[#D9D9D9]'}`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-200 ease-in-out ${directLinkMode ? 'right-1 bg-[var(--main-color1)]' : 'left-1 bg-[#7B7B7B]'
                  }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="bg-[#FEF3C7] text-black font-medium py-3 px-6 rounded-3xl flex items-center justify-center gap-2 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path d="M15.4698 8.33C14.8817 6.80882 13.8608 5.49331 12.5332 4.54604C11.2056 3.59878 9.62953 3.06129 7.99979 3C6.37005 3.06129 4.79398 3.59878 3.46639 4.54604C2.1388 5.49331 1.11787 6.80882 0.529787 8.33C0.490071 8.43985 0.490071 8.56015 0.529787 8.67C1.11787 10.1912 2.1388 11.5067 3.46639 12.454C4.79398 13.4012 6.37005 13.9387 7.99979 14C9.62953 13.9387 11.2056 13.4012 12.5332 12.454C13.8608 11.5067 14.8817 10.1912 15.4698 8.67C15.5095 8.56015 15.5095 8.43985 15.4698 8.33ZM7.99979 13C5.34979 13 2.54979 11.035 1.53479 8.5C2.54979 5.965 5.34979 4 7.99979 4C10.6498 4 13.4498 5.965 14.4648 8.5C13.4498 11.035 10.6498 13 7.99979 13Z" fill="black" />
              <path d="M8 5.5C7.40666 5.5 6.82664 5.67595 6.33329 6.00559C5.83994 6.33524 5.45543 6.80377 5.22836 7.35195C5.0013 7.90013 4.94189 8.50333 5.05765 9.08527C5.1734 9.66721 5.45912 10.2018 5.87868 10.6213C6.29824 11.0409 6.83279 11.3266 7.41473 11.4424C7.99667 11.5581 8.59987 11.4987 9.14805 11.2716C9.69623 11.0446 10.1648 10.6601 10.4944 10.1667C10.8241 9.67336 11 9.09334 11 8.5C11 7.70435 10.6839 6.94129 10.1213 6.37868C9.55871 5.81607 8.79565 5.5 8 5.5ZM8 10.5C7.60444 10.5 7.21776 10.3827 6.88886 10.1629C6.55996 9.94318 6.30362 9.63082 6.15224 9.26537C6.00087 8.89991 5.96126 8.49778 6.03843 8.10982C6.1156 7.72186 6.30608 7.36549 6.58579 7.08579C6.86549 6.80608 7.22186 6.6156 7.60982 6.53843C7.99778 6.46126 8.39992 6.50087 8.76537 6.65224C9.13082 6.80362 9.44318 7.05996 9.66294 7.38886C9.8827 7.71776 10 8.10444 10 8.5C10 9.03043 9.78929 9.53914 9.41421 9.91421C9.03914 10.2893 8.53043 10.5 8 10.5Z" fill="black" />
            </svg>
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}
