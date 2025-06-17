'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useGetProfileQuery } from 'hooks/profile';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import Link from 'next/link';
import ProfileInformation from '../profile/components/ProfileInformation';

type TimeFilter = 'today' | 'week' | 'month' | 'quarter';

const AnalyticsPage = () => {
  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('today');

  useEffect(() => {
    onGetProfile();
  }, []);

  const handleFilterChange = (filter: TimeFilter) => {
    setSelectedFilter(filter);
    // Here you can add logic to fetch data based on the selected filter
  };

  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen w-full min-h-screen py-8 px-4">
      <div className="w-full max-w-screen-md  py-8">
        <div className="flex items-center mb-6">
          <Link href="/profile" className="flex items-center text-[--main-color1] gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7-11-11 11-11 7 7 7 7" />
            </svg>
            <span className="uppercase text-h5 font-bold">Analytics</span>
          </Link>
        </div>

        {/* Profile Info */}
        <div className="flex items-center justify-between mb-6">
          <ProfileInformation profileData={profileData} withEdit={false} withSwitch={true} />
        </div>

        {/* Time Filter Buttons */}
        <div
          className="flex gap-2 mb-6 overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          <style jsx global>{`
            .overflow-x-auto::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <button
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
              selectedFilter === 'today' ? 'bg-[--main-color1] text-black' : 'bg-gray-200 dark:bg-[#2A2A2A]'
            }`}
            onClick={() => handleFilterChange('today')}
          >
            Today
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
              selectedFilter === 'week' ? 'bg-[--main-color1] text-black' : 'bg-gray-200 dark:bg-[#2A2A2A]'
            }`}
            onClick={() => handleFilterChange('week')}
          >
            This Week
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
              selectedFilter === 'month' ? 'bg-[--main-color1] text-black' : 'bg-gray-200 dark:bg-[#2A2A2A]'
            }`}
            onClick={() => handleFilterChange('month')}
          >
            Month
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap ${
              selectedFilter === 'quarter' ? 'bg-[--main-color1] text-black' : 'bg-gray-200 dark:bg-[#2A2A2A]'
            }`}
            onClick={() => handleFilterChange('quarter')}
          >
            Quarter
          </button>
          <button className="px-4 py-2 rounded-full bg-gray-200 dark:bg-[#2A2A2A] font-medium whitespace-nowrap flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-container rounded-xl p-4">
            <div className="flex flex-col items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M15.47 7.83C14.882 6.30882 13.861 4.99331 12.5334 4.04604C11.2058 3.09878 9.62977 2.56129 8.00003 2.5C6.37029 2.56129 4.79423 3.09878 3.46663 4.04604C2.13904 4.99331 1.11811 6.30882 0.530031 7.83C0.490315 7.93985 0.490315 8.06015 0.530031 8.17C1.11811 9.69118 2.13904 11.0067 3.46663 11.954C4.79423 12.9012 6.37029 13.4387 8.00003 13.5C9.62977 13.4387 11.2058 12.9012 12.5334 11.954C13.861 11.0067 14.882 9.69118 15.47 8.17C15.5097 8.06015 15.5097 7.93985 15.47 7.83ZM8.00003 12.5C5.35003 12.5 2.55003 10.535 1.53503 8C2.55003 5.465 5.35003 3.5 8.00003 3.5C10.65 3.5 13.45 5.465 14.465 8C13.45 10.535 10.65 12.5 8.00003 12.5Z"
                    fill="#FEC400"
                  />
                  <path
                    d="M8 5C7.40666 5 6.82664 5.17595 6.33329 5.50559C5.83994 5.83524 5.45543 6.30377 5.22836 6.85195C5.0013 7.40013 4.94189 8.00333 5.05765 8.58527C5.1734 9.16721 5.45912 9.70176 5.87868 10.1213C6.29824 10.5409 6.83279 10.8266 7.41473 10.9424C7.99667 11.0581 8.59987 10.9987 9.14805 10.7716C9.69623 10.5446 10.1648 10.1601 10.4944 9.66671C10.8241 9.17336 11 8.59334 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79565 5 8 5ZM8 10C7.60444 10 7.21776 9.8827 6.88886 9.66294C6.55996 9.44318 6.30362 9.13082 6.15224 8.76537C6.00087 8.39991 5.96126 7.99778 6.03843 7.60982C6.1156 7.22186 6.30608 6.86549 6.58579 6.58579C6.86549 6.30608 7.22186 6.1156 7.60982 6.03843C7.99778 5.96126 8.39992 6.00087 8.76537 6.15224C9.13082 6.30362 9.44318 6.55996 9.66294 6.88886C9.8827 7.21776 10 7.60444 10 8C10 8.53043 9.78929 9.03914 9.41421 9.41421C9.03914 9.78929 8.53043 10 8 10Z"
                    fill="#FEC400"
                  />
                </svg>
                <span className="text-[var(--main-color1)]">Views</span>
              </div>
              <p className="text-2xl font-bold ">{profileData?.visitcount || 0}</p>
            </div>
          </div>

          <div className="card-container rounded-xl p-4">
            <div className="flex flex-col items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2V6"
                    stroke="#FEC400"
                    stroke-opacity="0.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11 11L21 13L18 15L21 18L18 21L15 18L13 21L11 11Z"
                    stroke="#FEC400"
                    stroke-opacity="0.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M19.071 4.92871L16.2425 7.75721M4.929 19.0707L7.7575 16.2422M2 11.9997H6M4.929 4.92871L7.7575 7.75721"
                    stroke="#FEC400"
                    stroke-opacity="0.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="text-[var(--main-color1)]">clicks</span>
              </div>
              <p className="text-2xl font-bold ">{profileData?.visitcount || 0}</p>
            </div>
          </div>

          <div className="card-container rounded-xl p-4">
            <div className="flex flex-col items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2.28577 8.00014H3.80958L5.71434 3.42871L7.23815 12.5716L9.52386 5.71443L11.1201 10.2859L12.1905 8.00014H13.7143"
                    stroke="#FEC400"
                    stroke-opacity="0.9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="text-[var(--main-color1)]">rate</span>
              </div>
              <p className="text-2xl font-bold ">{profileData?.visitcount || 0} %</p>
            </div>
          </div>
        </div>

        {/* Contact Clicks */}
        <div className="card-container rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-4">Contact Clicks</h3>
          <div className="space-y-3">
            {profileData?.links
              ?.filter(link => ['phone', 'email', 'save_contact'].includes(link.title))
              .map((link, index) => (
                <div
                  key={index}
                  className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] transition-all duration-200 rounded-xl border border-[#B0A18E]"
                >
                  <div className="flex items-center px-4 py-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0 mr-3">
                      <Image
                        src={`https://fikrafarida.com/Media/icons/${link.iconurl}`}
                        alt={link.title}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="flex-grow truncate">{link.title}</span>
                    <span className="ml-3">
                      {link.visitcount || 0}
                      <span className="text-[var(--main-color1)] mx-2">Click</span>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Apps Clicks */}
        <div className="card-container rounded-xl p-4">
          <h3 className="font-semibold mb-4">Links Visits</h3>
          <div className="space-y-3">
            {profileData?.links
              ?.filter(link => !['phone', 'email', 'url', 'save_contact'].includes(link.title))
              .map((link, index) => (
                <div
                  key={index}
                  className="bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.12)] transition-all duration-200 rounded-xl border border-[#B0A18E]"
                >
                  <div className="flex items-center px-4 py-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0 mr-3">
                      <Image
                        src={`https://fikrafarida.com/Media/icons/${link.iconurl}`}
                        alt={link.title}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-base flex-grow truncate">{link.title}</span>
                    <span className="ml-3">
                      {link.visitcount || 0}
                      <span className="text-[var(--main-color1)] mx-2">Click</span>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
