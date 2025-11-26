'use client';

import React, { useState, useEffect } from 'react';
import { useGetGroupByIdQuery } from 'hooks/profile/queries/useGetGroupByIdQuery';
import { useGetGroupMembersQuery } from 'hooks/profile';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ConnectionForCreateDTO } from 'types';
import { DateUtils } from 'utils';

export default function GroupViewPage() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const t = useTranslations('profile.connectionsPage');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const {
    data: groupData,
    isLoading: isLoadingGroup,
  } = useGetGroupByIdQuery(groupId);

  const { data: groupMembersData } = useGetGroupMembersQuery(groupId || '');

  const [groupMembers, setGroupMembers] = useState<ConnectionForCreateDTO[]>([]);

  useEffect(() => {
    if (groupMembersData) {
      setGroupMembers(groupMembersData);
    }
  }, [groupMembersData]);
  const [searchQuery, setSearchQuery] = useState('');






  const filteredMembers = groupMembers.filter(
    member =>
      member.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoadingGroup) {
    return <LoadingOverlay isLoading={isLoadingGroup} />;
  }

  if (!groupData) {
    return (
      <div className="min-h-screen w-full py-8 px-4 md:flex md:flex-col md:items-center">
        <div className="w-full max-w-screen-md mx-auto py-8">
          <div className="text-center py-8">
            <p className="text-gray-500">{t('groupNotFound')}</p>
            <Link href="/connections" className="text-[--main-color1] mt-4 inline-block">
              {t('backToConnections')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full py-8 px-4 md:flex md:flex-col md:items-center">
      <div className="w-full max-w-screen-md mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/connections" className="flex items-center text-[--main-color1] gap-2">
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
              className={isRTL ? 'rotate-180' : ''}
            >
              <path d="M19 12H5M12 19l-7-7 7-7-11-11 11-11 7 7 7 7" />
            </svg>
            <span className="uppercase text-h5 font-bold">{groupData.GroupName}</span>
          </Link>
        </div>

        {/* Group Info */}
        <div className="card-container rounded-xl p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-[--main-color1] mb-2">{groupData.GroupName}</h2>
              {groupData.CompanyName && (
                <p className="text-gray-400 text-lg">{groupData.CompanyName}</p>
              )}
            </div>
            {groupData.Note && (
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('note')}:</p>
                <p className="text-gray-300">{groupData.Note}</p>
              </div>
            )}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-500">{t('members')}</p>
                <p className="text-2xl font-bold text-[--main-color1]">{groupMembers.length}</p>
              </div>
              {groupData.CreatedDate && (
                <div>
                  <p className="text-sm text-gray-500">{t('createdDate')}</p>
                  <p className="text-gray-300">{DateUtils.formatDate(groupData.CreatedDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full mb-4">
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

        {/* Members List */}
        <div className="space-y-4">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <div
                key={member.pk || index}
                className="relative flex flex-col items-start justify-start gap-4 py-6 px-4 rounded-xl border border-[#BEAF9E] bg-[rgba(255,244,211,0.10)]"
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="flex flex-col py-2 gap-1 flex-1">
                    <div className="flex items-center gap-2">
                      <div className='flex items-center gap-2 justify-center'>
                        <p className='text-[18px] text-[--main-color1]'>{t('name')}:</p>
                        <h1 className="text-[18px]">{member?.fullname}</h1>
                      </div>
                    </div>

                    {member?.title && (
                      <div className="flex items-center gap-2">
                        <div className='flex items-center gap-2 justify-center'>
                          <p className='text-[18px] text-[--main-color1]'>{t('title')}:</p>
                          <h1 className="text-[18px]">{member?.title}</h1>
                        </div>
                      </div>
                    )}

                    {member?.company && (
                      <div className="flex items-center gap-2">
                        <div className='flex items-center gap-2 justify-center'>
                          <p className='text-[18px] text-[--main-color1]'>{t('company')}:</p>
                          <p className="text-[18px]">{member?.company}</p>
                        </div>
                      </div>
                    )}

                    {member?.email && (
                      <div className="flex items-center gap-2">
                        <div className='flex items-center gap-2 justify-center'>
                          <p className='text-[18px] text-[--main-color1]'>{t('email')}:</p>
                          <p className="text-[18px]">{member?.email}</p>
                        </div>
                      </div>
                    )}

                    {member?.phone && (
                      <div className="flex items-center gap-2">
                        <div className='flex items-center gap-2 justify-center'>
                          <p className='text-[18px] text-[--main-color1]'>{t('phone')}:</p>
                          <p className="text-[18px]">{member?.phone}</p>
                        </div>
                      </div>
                    )}

                    {member?.createdate && (
                      <div className="flex items-center gap-2">
                        <div className='flex items-center gap-2 justify-center'>
                          <p className='text-[18px] text-[--main-color1]'>{t('createdDate')}:</p>
                          <p className="text-[18px]">{DateUtils.formatDate(member?.createdate)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchQuery ? t('noMembersFound') : t('noMembersInGroup')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

