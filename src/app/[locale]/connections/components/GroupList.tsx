'use client';

import React, { useState, useRef } from 'react';
import { useDeleteGroupMutation } from 'hooks/profile';
import { useRouter } from 'next/navigation';
import { GroupResponseDTO } from 'types';
import { useSubscriptionStatus } from 'hooks';
import { UnlockedButton } from 'components/subcriptions/subcriptionButtons';
import { useTranslations, useLocale } from 'next-intl';

interface GroupListProps {
  groups: GroupResponseDTO[];
  isLoading: boolean;
  onGetGroups: () => void;
  profileData: any;
}

const GroupList: React.FC<GroupListProps> = ({
  groups,
  isLoading,
  onGetGroups,
  profileData
}) => {
  const t = useTranslations('profile.connectionsPage');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const router = useRouter();
  
  const { onDeleteGroup, isLoading: deleteGroupLoading } = useDeleteGroupMutation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const hasProAccess = useSubscriptionStatus({
    subscriptionType: profileData?.type,
    subscriptionEndDate: profileData?.subscriptionEnddate
  });

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleMenu = (groupId: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenuId(openMenuId === groupId ? null : groupId);
  };

  const filteredGroups = groups.filter(
    group =>
      group.GroupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.CompanyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-8">Loading groups...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-80">
          <input
            type="text"
            placeholder={t('search')}
            className="bg-transparent w-full p-2.5 pl-9 border border-[--main-color1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[--main-color1] focus:border-transparent text-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <svg
            className="absolute left-2.5 top-2.5 h-4 w-4 text-[--main-color1]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Groups List */}
      {!hasProAccess ? (
        <div className="relative flex flex-col items-center justify-center gap-4 py-20 px-4 rounded-xl border border-[#BEAF9E] bg-[rgba(255,244,211,0.10)]">
          <UnlockedButton />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGroups && filteredGroups.length > 0 ? (
            filteredGroups.map(group => (
              <div
                key={group.GroupId}
                className="relative flex flex-col items-start justify-start gap-4 py-6 px-4 rounded-xl border border-[#BEAF9E] bg-[rgba(255,244,211,0.10)]"
                ref={menuRef}
              >
                <div className="dropdown dropdown-end absolute ltr:right-2 rtl:left-2 top-4 p-1">
                  <button
                    className="focus:outline-none touch-manipulation"
                    onClick={e => toggleMenu(group.GroupId, e)}
                    onTouchEnd={e => toggleMenu(group.GroupId, e)}
                    aria-expanded={openMenuId === group.GroupId}
                    aria-controls={`group-menu-${group.GroupId}`}
                    aria-label="Group options"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z"
                        stroke="#FEC400"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                        stroke="#FEC400"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12C17 13.1046 17.8954 14 19 14Z"
                        stroke="#FEC400"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </button>
                  <ul
                    id={`group-menu-${group.GroupId}`}
                    className={`absolute right-0 mt-2 z-50 bg-[#50514E] text-white menu p-2 shadow-lg rounded-lg w-48 max-w-[calc(100vw-2rem)] overflow-hidden transition-all duration-200 ${openMenuId === group.GroupId ? 'block' : 'hidden'
                      }`}
                    onClick={e => e.stopPropagation()}
                    onTouchEnd={e => e.stopPropagation()}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby={`group-options-${group.GroupId}`}
                  >
                    <li className="px-2 py-1.5 hover:bg-[#3e3f3c] rounded-md ">
                      <button
                        className="px-2 py-1.5 active:bg-transparent focus:bg-transparent w-full text-left"
                        onClick={() => {
                          const searchParams = new URLSearchParams();
                          searchParams.set('groupId', group.GroupId.toString());
                          router.push(`/group?${searchParams.toString()}`);
                        }}
                      >
                        {t('editGroup')}
                      </button>
                    </li>
                    <li className="px-2 py-1.5 hover:bg-[#3e3f3c] rounded-md">
                      <button
                        onClick={() => onDeleteGroup(group.GroupId)}
                        className="px-2 py-1.5 active:bg-transparent focus:bg-transparent"
                      >
                        {t('deleteGroup')}
                      </button>
                    </li>
                  </ul>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col py-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-h2 font-semibold">{group.GroupName}</h1>
                    </div>
                    <p className="text-gray-400 text-h4">{group.CompanyName}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-1">
                  <p className="text-h4 font-bold">{group.UsersCount}</p>
                  <p className="text-h4 text-[--main-color1]">Members</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No groups found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GroupList;
