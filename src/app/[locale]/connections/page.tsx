'use client';

import React, { useEffect, useState } from 'react';
import { useGetConnectionQuery } from 'hooks/profile/queries/useGetConnectionQuery';
import { useGetGroupQuery } from 'hooks/profile/queries/useGetGroupQuery';
import { useGetProfileQuery } from 'hooks/profile/queries/useGetProfileQuery';
import { useExportContactsFileMutation } from 'hooks/profile';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import Link from 'next/link';
import ProfileInformation from '../profile/components/ProfileInformation';
import AutoConnectPopup from '../[username]/components/AutoConnectPopup';
import ContactList from './components/ContactList';
import GroupList from './components/GroupList';
import { useSubscriptionStatus } from 'hooks';
import SubscriptionsPopup from 'components/subcriptions/subcriptionsPopup';
import { useSiteData } from 'context/SiteContext';
import { useLocale, useTranslations } from 'next-intl';

enum TabType {
  GROUPS = 'groups',
  CONTACTS = 'contacts',
}

const ConnectionsPage = () => {
  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();
  const siteData = useSiteData();
  const t = useTranslations('profile.connectionsPage');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const { data: connectionsData, isLoading: connectionsLoading, onGetConnections } = useGetConnectionQuery({
    connectUser1: siteData?.connectUser1 ?? undefined,
    connectUser2: siteData?.connectUser2 ?? undefined,
  });
  const { data: groupsData, isLoading: groupsLoading, onGetGroups } = useGetGroupQuery();
  const { onExportContactsFile, isLoading: exportContactsFileLoading } = useExportContactsFileMutation();
  
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [showAutoConnectPopup, setShowAutoConnectPopup] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CONTACTS);

  const hasProAccess = useSubscriptionStatus({
    subscriptionType: profileData?.type,
    subscriptionEndDate: profileData?.subscriptionEnddate
  });

  const [contacts, setContacts] = useState(connectionsData || []);
  const [groups, setGroups] = useState(groupsData || []);

  useEffect(() => {
    onGetProfile();
  }, []);

  useEffect(() => {
    if (activeTab === TabType.GROUPS) {
      onGetGroups();
    } else {
      onGetConnections({
        connectUser1: siteData?.connectUser1 ?? undefined,
        connectUser2: siteData?.connectUser2 ?? undefined,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    setContacts(connectionsData || []);
  }, [connectionsData]);

  useEffect(() => {
    setGroups(groupsData || []);
  }, [groupsData]);

  if (isLoading || connectionsLoading || groupsLoading || exportContactsFileLoading) {
    return <LoadingOverlay isLoading={isLoading || connectionsLoading || groupsLoading || exportContactsFileLoading} />;
  }

  return (
    <>
      <div className="min-h-screen w-full py-8 px-4">
        <div className="w-full max-w-screen-md mx-auto py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
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
                className={isRTL ? 'rotate-180' : ''}
              >
                <path d="M19 12H5M12 19l-7-7 7-7-11-11 11-11 7 7 7 7" />
              </svg>
              <span className="uppercase text-h5 font-bold">{activeTab === TabType.GROUPS ? t('groups') : t('contacts')}</span>
            </Link>
            <button
              className='btn btn-ghost border border-[--main-color1] text-center p-6 text-[--main-color1] rounded-lg font-semibold hover:bg-yellow-500 transition-colors'
              onClick={() => {
                if (!hasProAccess) {
                  setShowSubscriptionPopup(true)
                }
                else onExportContactsFile()
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M21.75 4.5C21.75 3.90326 21.5129 3.33097 21.091 2.90901C20.669 2.48705 20.0967 2.25 19.5 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V12C2.25 12.1989 2.32902 12.3897 2.46967 12.5303C2.61032 12.671 2.80109 12.75 3 12.75C3.19891 12.75 3.38968 12.671 3.53033 12.5303C3.67098 12.3897 3.75 12.1989 3.75 12V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H19.5C19.6989 3.75 19.8897 3.82902 20.0303 3.96967C20.171 4.11032 20.25 4.30109 20.25 4.5V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H13.5C13.3011 20.25 13.1103 20.329 12.9697 20.4697C12.829 20.6103 12.75 20.8011 12.75 21C12.75 21.1989 12.829 21.3897 12.9697 21.5303C13.1103 21.671 13.3011 21.75 13.5 21.75H19.5C20.0967 21.75 20.669 21.5129 21.091 21.091C21.5129 20.669 21.75 20.0967 21.75 19.5V4.5Z" fill="#FEC400" fillOpacity="0.9" />
                <path fillRule="evenodd" clipRule="evenodd" d="M6.75 9C6.75 8.80109 6.82902 8.61032 6.96967 8.46967C7.11032 8.32902 7.30109 8.25 7.5 8.25H15C15.1989 8.25 15.3897 8.32902 15.5303 8.46967C15.671 8.61032 15.75 8.80109 15.75 9V16.5C15.75 16.6989 15.671 16.8897 15.5303 17.0303C15.3897 17.171 15.1989 17.25 15 17.25C14.8011 17.25 14.6103 17.171 14.4697 17.0303C14.329 16.8897 14.25 16.6989 14.25 16.5V9.75H7.5C7.30109 9.75 7.11032 9.67098 6.96967 9.53033C6.82902 9.38968 6.75 9.19891 6.75 9Z" fill="#FEC400" fillOpacity="0.9" />
                <path fillRule="evenodd" clipRule="evenodd" d="M15.531 8.46936C15.6008 8.53903 15.6562 8.6218 15.694 8.71291C15.7318 8.80403 15.7513 8.90171 15.7513 9.00036C15.7513 9.09901 15.7318 9.1967 15.694 9.28781C15.6562 9.37893 15.6008 9.4617 15.531 9.53136L3.53097 21.5314C3.39014 21.6722 3.19913 21.7513 2.99997 21.7513C2.80081 21.7513 2.6098 21.6722 2.46897 21.5314C2.32814 21.3905 2.24902 21.1995 2.24902 21.0004C2.24902 20.8012 2.32814 20.6102 2.46897 20.4694L14.469 8.46936C14.5386 8.39952 14.6214 8.3441 14.7125 8.30629C14.8036 8.26849 14.9013 8.24902 15 8.24902C15.0986 8.24902 15.1963 8.26849 15.2874 8.30629C15.3785 8.3441 15.4613 8.39952 15.531 8.46936Z" fill="#FEC400" fillOpacity="0.9" />
              </svg>
              {t('exportCSV')}
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex items-center justify-between mb-6">
            <ProfileInformation profileData={profileData} withEdit={false} withSwitch={true} />
          </div>

          {/* Add Button */}
          <div className="flex items-center justify-end mb-6">
            {activeTab === TabType.GROUPS ? (
              <Link
                href="/group"
                tabIndex={0}
                role="button"
                className="btn btn-ghost border bg-[--main-color1] text-center p-6 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                <span className="text-center text-h4">{t('create') + ' +'}</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setShowAutoConnectPopup(true);
                }}
                className="btn btn-ghost border bg-[--main-color1] text-center p-6 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                <span className="text-center text-h4">{t('add') + ' +'}</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="-mb-px flex justify-around space-x-8">
              <button
                onClick={() => {
                  setActiveTab(TabType.CONTACTS);
                }}
                className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === TabType.CONTACTS
                  ? 'border-[--main-color1] text-[--main-color1]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
              >
                {t('contacts')}
              </button>
              <button
                onClick={() => {
                  setActiveTab(TabType.GROUPS);
                }}
                className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === TabType.GROUPS
                  ? 'border-[--main-color1] text-[--main-color1]'
                  : 'border-transparent text-gray-400 hover:text-gray-700 '
                  }`}
              >
                {t('groups')}
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === TabType.GROUPS ? (
              <GroupList
                groups={groups}
                isLoading={groupsLoading}
                profileData={profileData}
              />
            ) : (
              <ContactList
                contacts={contacts}
                isLoading={connectionsLoading}
                onGetConnections={onGetConnections}
                groups={groups}
              />
            )}
          </div>
        </div>
      </div>

      {/* Popups */}
      {showAutoConnectPopup && <AutoConnectPopup
        isOpen={showAutoConnectPopup}
        onClose={() => {
          setShowAutoConnectPopup(false)
          setTimeout(() => onGetConnections(), 1000);
        }}
        userPk={profileData?.userPk || 0}
      />}

      {showSubscriptionPopup && <SubscriptionsPopup
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
      />}
    </>
  );
};

export default ConnectionsPage;