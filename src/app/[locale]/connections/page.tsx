'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useGetConnectionQuery } from 'hooks/profile/queries/useGetConnectionQuery';
import { useGetGroupQuery } from 'hooks/profile/queries/useGetGroupQuery';
import { useGetProfileQuery } from 'hooks/profile/queries/useGetProfileQuery';
import { useDeleteConnectionMutation, useDeleteGroupMutation, useExportContactsFileMutation } from 'hooks/profile';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import Link from 'next/link';
import ProfileInformation from '../profile/components/ProfileInformation';
import { useRouter } from 'next/navigation';
import { ConnectionForCreateDTO, GroupResponseDTO } from 'types';
import saveAs from 'file-saver';
import AutoConnectPopup from '../[username]/components/AutoConnectPopup';
import ViewContactPopup from './components/ViewContactPopup';
import AddToGroupPopup from './components/AddToGroupPopup';
import { useSubscriptionStatus } from 'hooks';
import { UnlockedButton } from 'components/subcriptions/subcriptionButtons'
import SubscriptionsPopup from 'components/subcriptions/subcriptionsPopup';
import { DateUtils } from 'utils';
// import { useSiteData } from 'context/SiteContext';
import DateFilterPopup from 'components/DateFilterPopup';

enum TabType {
  GROUPS = 'groups',
  CONTACTS = 'contacts',
}

const ConnectionsPage = () => {
  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();
  const { data: connectionsData, isLoading: connectionsLoading, onGetConnections } = useGetConnectionQuery();
  const { data: groupsData, isLoading: groupsLoading, onGetGroups } = useGetGroupQuery();
  const { onDeleteConnection, isLoading: deleteConnectionLoading } = useDeleteConnectionMutation();
  const { onDeleteGroup, isLoading: deleteGroupLoading } = useDeleteGroupMutation();
  const { onExportContactsFile, isLoading: exportContactsFileLoading } = useExportContactsFileMutation();
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.CONTACTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showAutoConnectPopup, setShowAutoConnectPopup] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showAddContactToGroupPopup, setShowAddContactToGroupPopup] = useState(false);
  const [selectedContactPk, setSelectedContactPk] = useState<number | null>(null);
  const [selectedContact] = useState<ConnectionForCreateDTO | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  // const siteData = useSiteData();
  // console.log(siteData);
  const menuRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  const hasProAccess = useSubscriptionStatus({
    subscriptionType: profileData?.type,
    subscriptionEndDate: profileData?.subscriptionEnddate
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
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

  const [contacts, setContacts] = useState<ConnectionForCreateDTO[] | []>(connectionsData || []);
  const [groups, setGroups] = useState<GroupResponseDTO[] | []>(groupsData || []);

  useEffect(() => {
    onGetProfile();
    onGetConnections();
    onGetGroups();
  }, []);

  useEffect(() => {
    if (activeTab === TabType.GROUPS) {
      onGetGroups();
    } else {
      onGetConnections();
    }
  }, [activeTab])

  useEffect(() => {
    setContacts(connectionsData || []);
  }, [connectionsData]);

  useEffect(() => {
    setGroups(groupsData || []);
  }, [groupsData]);

  // Enhanced filter handling functions
  const handleApplyFilter = async () => {
    if (!dateFilter.from && !dateFilter.to) return;

    try {
      // Call your API with date filters
      await onGetConnections({
        dateFrom: dateFilter.from,
        dateTo: dateFilter.to,
      });

      setShowFilterDropdown(false);
      setIsFilterApplied(true);

      console.log('Filter applied successfully:', dateFilter);
    } catch (error) {
      console.error('Error applying date filter:', error);
    }
  };

  const handleClearFilter = async () => {
    setDateFilter({ from: '', to: '' });
    setIsFilterApplied(false);

    try {
      // Reload all connections without filter
      await onGetConnections();
      console.log('Filter cleared successfully');
    } catch (error) {
      console.error('Error clearing filter:', error);
    }
  };

  const filteredContacts = contacts.filter(
    contact =>
      contact.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(
    group =>
      group.GroupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.CompanyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateVCard = (profile: ConnectionForCreateDTO & { username?: string }) => {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.fullname || ''}`,
      `TEL;type=CELL:${profile.phone || ''}`,
      `EMAIL:${profile.email || ''}`,
      `TITLE:${profile.title || ''}`,
      `ORG:${profile.company || ''}`,
      'END:VCARD'
    ].filter(Boolean).join('\n');

    return new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
  };

  const handleSaveContact = (contact: ConnectionForCreateDTO) => {
    if (!contact) return;
    try {
      const vCardBlob = generateVCard(contact);
      saveAs(vCardBlob, `${contact.fullname || 'contact'}.vcf`);
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save contact. Please try again.');
    }
  };

  if (isLoading || connectionsLoading || groupsLoading || deleteGroupLoading || deleteConnectionLoading || exportContactsFileLoading) {
    return <LoadingOverlay isLoading={isLoading || connectionsLoading || groupsLoading || deleteGroupLoading || deleteConnectionLoading || exportContactsFileLoading} />;
  }

  return (
    <>
      <div className="min-h-screen w-full py-8 px-4">
        <div className="w-full max-w-screen-md mx-auto py-8">
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
              >
                <path d="M19 12H5M12 19l-7-7 7-7-11-11 11-11 7 7 7 7" />
              </svg>
              <span className="uppercase text-h5 font-bold">{activeTab === TabType.GROUPS ? 'Groups' : 'Contacts'}</span>
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
              Export CSV
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex items-center justify-between">
            <ProfileInformation profileData={profileData} withEdit={false} withSwitch={true} />
          </div>

          {/* Search and Enhanced Filter */}
          <div className="flex items-center gap-4 mb-4">
            {/* Minimized Search Input */}
            <div className="relative w-80">
              <input
                type="text"
                placeholder="Search..."
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

            {/* Enhanced Mobile-Responsive Filter Dropdown */}
            {activeTab === TabType.CONTACTS && <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`p-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[--main-color1] ${isFilterApplied
                  ? 'border-[--main-color1] bg-[--main-color1] text-white'
                  : 'border-[--main-color1] hover:bg-[--main-color1] hover:bg-opacity-10 text-[--main-color1]'
                  }`}
                title="Filter by date"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18M7 12h10m-7 6h4" />
                </svg>
              </button>

              {/* Enhanced Mobile-Optimized Calendar Dropdown */}
              <DateFilterPopup
                showFilterDropdown={showFilterDropdown}
                dateFilter={dateFilter}
                onClose={() => setShowFilterDropdown(false)}
                onDateFilterChange={setDateFilter}
                onApplyFilter={handleApplyFilter}
                onClearFilter={handleClearFilter}
              />
            </div>}

            {/* Create/Add Button */}
            {activeTab === TabType.GROUPS ? (
              <Link
                href="/group"
                tabIndex={0}
                role="button"
                className="btn btn-ghost border bg-[--main-color1] text-center p-6 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                <span className="text-center text-h4">Create +</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setShowAutoConnectPopup(true);
                }}
                className="btn btn-ghost border bg-[--main-color1] text-center p-6 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                <span className="text-center text-h4">Add +</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <nav className="-mb-px flex justify-around space-x-8">
              <button
                onClick={() => {
                  setActiveTab(TabType.CONTACTS);
                  setSearchQuery('');
                }}
                className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === TabType.CONTACTS
                  ? 'border-[--main-color1] text-[--main-color1]'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
                  }`}
              >
                Contacts
              </button>
              <button
                onClick={() => {
                  setActiveTab(TabType.GROUPS);
                  setSearchQuery('');
                }}
                className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === TabType.GROUPS
                  ? 'border-[--main-color1] text-[--main-color1]'
                  : 'border-transparent text-gray-400 hover:text-gray-700 '
                  }`}
              >
                Groups
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === TabType.GROUPS ? (
              <>
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
                                  Edit Group
                                </button>
                              </li>
                              <li className="px-2 py-1.5 hover:bg-[#3e3f3c] rounded-md">
                                <button
                                  onClick={() => onDeleteGroup(group.GroupId)}
                                  className="px-2 py-1.5 active:bg-transparent focus:bg-transparent"
                                >
                                  Delete Group
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
              </>
            ) : (
              <div className="space-y-4">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact, index) => (
                    <div
                      key={contact.userpk + index}
                      className="relative flex flex-col items-start justify-start gap-4 py-6 px-4 rounded-xl border border-[#BEAF9E] bg-[rgba(255,244,211,0.10)]"
                    >
                      <div className="dropdown dropdown-end absolute ltr:right-2 rtl:left-2 top-2 p-1">
                        <button
                          className="focus:outline-none touch-manipulation"
                          onClick={e => toggleMenu(contact?.pk || 0, e)}
                          onTouchEnd={e => toggleMenu(contact?.pk || 0, e)}
                          aria-expanded={openMenuId === contact?.pk}
                          aria-controls={`contact-menu-${contact?.pk}`}
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
                          id={`contact-menu-${contact.pk}`}
                          className={`absolute right-0 mt-2 z-50 bg-[#50514E] text-white menu p-2 shadow-lg rounded-lg w-48 max-w-[calc(100vw-2rem)] overflow-hidden transition-all duration-200 ${openMenuId === contact.pk ? 'block' : 'hidden'
                            }`}
                          onClick={e => e.stopPropagation()}
                          onTouchEnd={e => e.stopPropagation()}
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby={`contact-options-${contact.pk}`}
                        >
                          <li
                            onClick={() => {
                              setShowAddContactToGroupPopup(true)
                              setSelectedContactPk(contact.pk || 0)
                            }}
                            className="px-2 py-1.5 hover:bg-[#3e3f3c] rounded-md">
                            <a className="px-2 py-1.5 active:bg-transparent focus:bg-transparent">Add to Group</a>
                          </li>
                        </ul>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col py-2 gap-1">
                          <div className="flex items-center gap-2">
                            <div className='flex items-center gap-2 justify-center'>
                              <p className='text-[18px]  text-[--main-color1]'>Name:</p>
                              <h1 className="text-[18px] ">{contact?.fullname}</h1>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className='flex items-center gap-2 justify-center'>
                              <p className='text-[18px]  text-[--main-color1]'>Title:</p>
                              <h1 className="text-[18px] ">{contact?.title}</h1>
                            </div>
                          </div>

                          {contact?.company && <div className="flex items-center gap-2">
                            <div className='flex items-center gap-2 justify-center'>
                              <p className='text-[18px] text-[--main-color1]'>Company:</p>
                              <p className="text-[18px] ">{contact?.company}</p>
                            </div>
                          </div>}
                          {contact?.email && <div className="flex items-center gap-2">
                            <div className='flex items-center gap-2 justify-center'>
                              <p className='text-[18px] text-[--main-color1]'>Email:</p>
                              <p className="text-[18px] ">{contact?.email}</p>
                            </div>
                          </div>}
                          {contact?.phone && <div className="flex items-center gap-2">
                            <div className='flex items-center gap-2 justify-center'>
                              <p className='text-[18px] text-[--main-color1]'>Phone:</p>
                              <p className="text-[18px] ">{contact?.phone}</p>
                            </div>
                          </div>}

                          {contact?.message && <div className="flex items-center gap-2">
                            <div className='flex items-center gap-2 justify-center'>
                              <p className='text-[18px] text-[--main-color1]'>Message:</p>
                              <p className="text-[18px] ">{contact?.message}</p>
                            </div>
                          </div>}

                          {contact?.createdate && <div className="flex items-center gap-2">
                            <div className='flex items-center gap-2 justify-center'>
                              <p className='text-[18px] text-[--main-color1]'>Created Date:</p>
                              <p className="text-[18px] ">{DateUtils.formatDate(contact?.createdate)}</p>
                            </div>
                          </div>}
                        </div>
                      </div>

                      <div className="flex justify-center gap-4 ">
                        <button
                          onClick={() => {
                            onDeleteConnection({ ConnectionId: contact.pk! });
                            setTimeout(() => onGetConnections(), 1000);
                          }}
                          className="flex gap-2 justify-center items-center border border-[--main-color1] px-6 py-1 rounded-full text-[--main-color1]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path
                              d="M4.66675 14.5C4.30008 14.5 3.98619 14.3694 3.72508 14.1083C3.46397 13.8472 3.33341 13.5333 3.33341 13.1667V4.5H2.66675V3.16667H6.00008V2.5H10.0001V3.16667H13.3334V4.5H12.6667V13.1667C12.6667 13.5333 12.5362 13.8472 12.2751 14.1083C12.014 14.3694 11.7001 14.5 11.3334 14.5H4.66675ZM11.3334 4.5H4.66675V13.1667H11.3334V4.5ZM6.00008 11.8333H7.33341V5.83333H6.00008V11.8333ZM8.66675 11.8333H10.0001V5.83333H8.66675V11.8333Z"
                              fill="#FEC400"
                              fillOpacity="0.9"
                            />
                          </svg>
                          <span>Remove</span>
                        </button>
                        <button onClick={() => handleSaveContact(contact)} className="flex gap-2 justify-center items-center border border-[--main-color1] px-6 py-1 rounded-full text-[--main-color1]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path
                              d="M11.3333 14.5V9.16667H4.66667V14.5M4.66667 2.5V5.83333H10M12.6667 14.5H3.33333C2.97971 14.5 2.64057 14.3595 2.39052 14.1095C2.14048 13.8594 2 13.5203 2 13.1667V3.83333C2 3.47971 2.14048 3.14057 2.39052 2.89052C2.64057 2.64048 2.97971 2.5 3.33333 2.5H10.6667L14 5.83333V13.1667C14 13.5203 13.8595 13.8594 13.6095 14.1095C13.3594 14.3595 13.0203 14.5 12.6667 14.5Z"
                              stroke="#FEC400"
                              strokeOpacity="0.9"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No contacts found</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAutoConnectPopup && <AutoConnectPopup
        isOpen={showAutoConnectPopup}
        onClose={() => {
          setShowAutoConnectPopup(false)
          setTimeout(() => onGetConnections(), 1000);
        }}
        userPk={profileData?.userPk || 0}
      />}
      {showContactPopup && <ViewContactPopup
        isOpen={showContactPopup}
        onClose={() => setShowContactPopup(false)}
        contact={selectedContact}
      />}

      {showAddContactToGroupPopup && <AddToGroupPopup
        isOpen={showAddContactToGroupPopup}
        onClose={() => setShowAddContactToGroupPopup(false)}
        contactPk={selectedContactPk || 0}
        groups={groups}
      />}
      {showSubscriptionPopup && <SubscriptionsPopup
        isOpen={showSubscriptionPopup}
        onClose={() => setShowSubscriptionPopup(false)}
      />}
    </>
  );
};

export default ConnectionsPage;
