'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useGetConnectionQuery } from 'hooks/profile/queries/useGetConnectionQuery';
import { useGetGroupQuery } from 'hooks/profile/queries/useGetGroupQuery';
import { useGetProfileQuery } from 'hooks/profile/queries/useGetProfileQuery';
import { useDeleteGroupMutation } from 'hooks/profile/mutations';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import Link from 'next/link';
import ProfileInformation from '../profile/components/ProfileInformation';
import { useRouter } from 'next/navigation';
import { ConnectionForCreateDTO } from 'types';
import saveAs from 'file-saver';

enum TabType {
  GROUPS = 'groups',
  CONTACTS = 'contacts',
}



const ConnectionsPage = () => {
  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: connectionsData, isLoading: connectionsLoading, onGetConnections } = useGetConnectionQuery();
  const { data: groupsData, isLoading: groupsLoading, onGetGroups } = useGetGroupQuery();
  const { onDeleteGroup, isLoading: deleteGroupLoading } = useDeleteGroupMutation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>(TabType.GROUPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    // Add event listeners for both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      // Clean up the event listeners
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const toggleMenu = (groupId: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenuId(openMenuId === groupId ? null : groupId);
  };

  // Mock data - replace with actual API calls
  const [contacts, setContacts] = useState<ConnectionForCreateDTO[] | []>(connectionsData || []);
  useEffect(() => {
    onGetProfile();
    onGetConnections();
    onGetGroups();
  }, []);

  useEffect(() => {
    setContacts(connectionsData || []);
  }, [connectionsData]);



  const filteredContacts = contacts.filter(
    contact =>
      contact.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
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


  if (isLoading || connectionsLoading || groupsLoading || deleteGroupLoading) {
    return <LoadingOverlay isLoading={isLoading || connectionsLoading || groupsLoading || deleteGroupLoading} />;
  }

  return (
    <div className="min-h-screen w-full py-8 px-4">
      <div className="w-full max-w-screen-md mx-auto py-8">
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
            <span className="uppercase text-h5 font-bold">{activeTab === TabType.GROUPS ? 'Groups' : 'Contacts'}</span>
          </Link>
        </div>

        {/* Profile Info */}
        <div className="flex items-center justify-between">
          <ProfileInformation profileData={profileData} withEdit={false} withSwitch={true} />
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent w-full p-3 pl-10 border border-[--main-color1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[--main-color1] focus:border-transparent"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <svg
              className="absolute left-3 top-3.5 h-5 w-5 text-[--main-color1]"
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

          <Link
            href="/group"
            tabIndex={0}
            role="button"
            className="btn btn-ghost border bg-[--main-color1] text-center p-6 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            <span className="text-center text-h4">Add +</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="-mb-px flex justify-around space-x-8">
            <button
              onClick={() => setActiveTab(TabType.GROUPS)}
              className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === TabType.GROUPS
                ? 'border-[--main-color1] text-[--main-color1]'
                : 'border-transparent text-gray-400 hover:text-gray-700 '
                }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab(TabType.CONTACTS)}
              className={`flex-1 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === TabType.CONTACTS
                ? 'border-[--main-color1] text-[--main-color1]'
                : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
            >
              Contacts
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === TabType.GROUPS ? (
            <div className="space-y-4">
              {groupsData && groupsData.length > 0 ? (
                groupsData.map(group => (
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
          ) : (
            <div className="space-y-4">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact, index) => (
                  <div
                    key={contact.userpk + index}
                    className="relative flex flex-col items-start justify-start gap-4 py-6 px-4 rounded-xl border border-[#BEAF9E] bg-[rgba(255,244,211,0.10)]"
                  >
                    <div className="dropdown dropdown-end absolute ltr:right-2 rtl:left-2 top-2 p-1">
                      <button className="focus:outline-none">
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
                        tabIndex={0}
                        className="bg-[#50514E] text-white dropdown-content z-[1] menu p-2 shadow-lg rounded-lg w-48 max-w-[calc(100vw-2rem)] overflow-hidden"
                      >
                        <li className="px-2 py-1.5 hover:bg-[#3e3f3c] rounded-md">
                          <a className="px-2 py-1.5 active:bg-transparent focus:bg-transparent">Add to Group</a>
                        </li>
                        <li className="px-2 py-1.5 hover:bg-[#3e3f3c] rounded-md">
                          <a className="px-2 py-1.5 active:bg-transparent focus:bg-transparent">View Contact</a>
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex flex-col py-2 gap-1">
                        <div className="flex items-center gap-2">
                          <div className='flex items-center gap-2 justify-center'>
                            <p className='text-h2  text-[--main-color1]'>Title:</p>
                            <h1 className="text-h2 ">{contact?.title}</h1>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className='flex items-center gap-2 justify-center'>
                            <p className='text-h2  text-[--main-color1]'>Name:</p>
                            <h1 className="text-h2 ">{contact?.fullname}</h1>
                          </div>
                        </div>
                        {contact?.company && <div className="flex items-center gap-2">
                          <div className='flex items-center gap-2 justify-center'>
                            <p className='text-h2 text-[--main-color1]'>Company:</p>
                            <p className="text-h2 ">{contact?.company}</p>
                          </div>
                        </div>}
                        {contact?.email && <div className="flex items-center gap-2">
                          <div className='flex items-center gap-2 justify-center'>
                            <p className='text-h2 text-[--main-color1]'>Email:</p>
                            <p className="text-h2 ">{contact?.email}</p>
                          </div>
                        </div>}
                        {contact?.phone && <div className="flex items-center gap-2">
                          <div className='flex items-center gap-2 justify-center'>
                            <p className='text-h2 text-[--main-color1]'>Phone:</p>
                            <p className="text-h2 ">{contact?.phone}</p>
                          </div>
                        </div>}
                      </div>
                    </div>

                    <div className="flex justify-center gap-4 ">
                      <button className="flex gap-2 justify-center items-center border border-[--main-color1] px-4 py-1 rounded-full text-[--main-color1]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                          <path
                            d="M4.66675 14.5C4.30008 14.5 3.98619 14.3694 3.72508 14.1083C3.46397 13.8472 3.33341 13.5333 3.33341 13.1667V4.5H2.66675V3.16667H6.00008V2.5H10.0001V3.16667H13.3334V4.5H12.6667V13.1667C12.6667 13.5333 12.5362 13.8472 12.2751 14.1083C12.014 14.3694 11.7001 14.5 11.3334 14.5H4.66675ZM11.3334 4.5H4.66675V13.1667H11.3334V4.5ZM6.00008 11.8333H7.33341V5.83333H6.00008V11.8333ZM8.66675 11.8333H10.0001V5.83333H8.66675V11.8333Z"
                            fill="#FEC400"
                            fill-opacity="0.9"
                          />
                        </svg>
                        <span>Remove Contact</span>
                      </button>
                      <button onClick={() => handleSaveContact(contact)} className="flex gap-2 justify-center items-center border border-[--main-color1] px-4 py-1 rounded-full text-[--main-color1]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                          <path
                            d="M11.3333 14.5V9.16667H4.66667V14.5M4.66667 2.5V5.83333H10M12.6667 14.5H3.33333C2.97971 14.5 2.64057 14.3595 2.39052 14.1095C2.14048 13.8594 2 13.5203 2 13.1667V3.83333C2 3.47971 2.14048 3.14057 2.39052 2.89052C2.64057 2.64048 2.97971 2.5 3.33333 2.5H10.6667L14 5.83333V13.1667C14 13.5203 13.8595 13.8594 13.6095 14.1095C13.3594 14.3595 13.0203 14.5 12.6667 14.5Z"
                            stroke="#FEC400"
                            stroke-opacity="0.9"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <span>Save Contact</span>
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
  );
};

export default ConnectionsPage;
