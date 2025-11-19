'use client';

import React, { useState, useRef } from 'react';
import { useDeleteConnectionMutation } from 'hooks/profile';
import { ConnectionForCreateDTO } from 'types';
import saveAs from 'file-saver';
import ViewContactPopup from './ViewContactPopup';
import AddToGroupPopup from './AddToGroupPopup';
import { DateUtils } from 'utils';
import DateFilterPopup from 'components/DateFilterPopup';
import { useSiteData } from 'context/SiteContext';
import { useTranslations } from 'next-intl';
import { GroupResponseDTO } from 'types';

interface ContactListProps {
  contacts: ConnectionForCreateDTO[];
  isLoading: boolean;
  onGetConnections: (params?: {
    dateFrom?: string;
    dateTo?: string;
    connectUser1?: string;
    connectUser2?: string;
  }) => void;
  groups: GroupResponseDTO[];
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  isLoading,
  onGetConnections,
  groups
}) => {
  const t = useTranslations('profile.connectionsPage');
  const siteData = useSiteData();
  
  const { onDeleteConnection } = useDeleteConnectionMutation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showAddContactToGroupPopup, setShowAddContactToGroupPopup] = useState(false);
  const [selectedContactPk, setSelectedContactPk] = useState<number | null>(null);
  const [selectedContact] = useState<ConnectionForCreateDTO | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' });
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  React.useEffect(() => {
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

  const toggleMenu = (contactId: number, event: React.MouseEvent | React.TouchEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenMenuId(openMenuId === contactId ? null : contactId);
  };

  // Enhanced filter handling functions
  const handleApplyFilter = async () => {
    if (!dateFilter.from && !dateFilter.to) return;

    try {
      await onGetConnections({
        dateFrom: dateFilter.from,
        dateTo: dateFilter.to,
        connectUser1: siteData?.connectUser1 ?? undefined,
        connectUser2: siteData?.connectUser2 ?? undefined,
      });

      setShowFilterDropdown(false);
      setIsFilterApplied(true);
    } catch (error) {
      console.error('Error applying date filter:', error);
    }
  };

  const handleClearFilter = async () => {
    setDateFilter({ from: '', to: '' });
    setIsFilterApplied(false);

    try {
      await onGetConnections({
        connectUser1: siteData?.connectUser1 ?? undefined,
        connectUser2: siteData?.connectUser2 ?? undefined,
      });
    } catch (error) {
      console.error('Error clearing filter:', error);
    }
  };

  const filteredContacts = contacts.filter(
    contact =>
      contact.fullname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateVCard = async (profile: ConnectionForCreateDTO & { username?: string; imageFilename?: string }) => {
    const fullName = (profile.fullname || '').trim();
    const displayName = fullName || profile.username || 'Contact';

    const nameParts = displayName.split(' ');
    const lastName = nameParts.length > 1 ? nameParts.slice(-1)[0] : '';
    const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : displayName;

    const escapeVCardField = (field: string) => {
      return field
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r');
    };

    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${escapeVCardField(displayName)}`,
      `N:${escapeVCardField(lastName)};${escapeVCardField(firstName)};;;`,
      `TEL;type=CELL:${profile.phone || ''}`,
      `EMAIL:${profile.email || ''}`,
      `TITLE:${escapeVCardField(profile.title || '')}`,
      `ORG:${escapeVCardField(profile.company || '')}`,
      'END:VCARD'
    ].filter(Boolean).join('\n');

    return new Blob([vCard], { type: 'text/vcard;charset=utf-8' });
  };

  const handleSaveContact = async (contact: ConnectionForCreateDTO) => {
    if (!contact) return;
    try {
      // alert('Generating contact...');
      
      const vCardBlob = await generateVCard(contact);
      
      const cleanName = (contact.fullname || 'contact')
        .replace(/[^a-zA-Z0-9\s]/g, '')
        .replace(/\s+/g, '_')
        .trim();
      
      saveAs(vCardBlob, `${cleanName}.vcf`);
      // alert('Contact saved successfully!');
    } catch (error) {
      console.error('Error saving contact:', error);
      alert('Failed to save contact. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading contacts...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
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

        {/* Filter Dropdown */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`p-2.5 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[--main-color1] ${isFilterApplied
              ? 'border-[--main-color1] bg-[--main-color1] text-white'
              : 'border-[--main-color1] hover:bg-[--main-color1] hover:bg-opacity-10 text-[--main-color1]'
              }`}
            title={t('filterByDate')}
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

          <DateFilterPopup
            showFilterDropdown={showFilterDropdown}
            dateFilter={dateFilter}
            onClose={() => setShowFilterDropdown(false)}
            onDateFilterChange={setDateFilter}
            onApplyFilter={handleApplyFilter}
            onClearFilter={handleClearFilter}
          />
        </div>
      </div>

      {/* Contacts List */}
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
                  aria-label="Contact options"
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
                    <a className="px-2 py-1.5 active:bg-transparent focus:bg-transparent">{t('addToGroup')}</a>
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col py-2 gap-1">
                  <div className="flex items-center gap-2">
                    <div className='flex items-center gap-2 justify-center'>
                      <p className='text-[18px] text-[--main-color1]'>{t('name')}:</p>
                      <h1 className="text-[18px] ">{contact?.fullname}</h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className='flex items-center gap-2 justify-center'>
                      <p className='text-[18px] text-[--main-color1]'>{t('title')}:</p>
                      <h1 className="text-[18px] ">{contact?.title}</h1>
                    </div>
                  </div>

                  {contact?.company && <div className="flex items-center gap-2">
                    <div className='flex items-center gap-2 justify-center'>
                      <p className='text-[18px] text-[--main-color1]'>{t('company')}:</p>
                      <p className="text-[18px] ">{contact?.company}</p>
                    </div>
                  </div>}
                  {contact?.email && <div className="flex items-center gap-2">
                    <div className='flex items-center gap-2 justify-center'>
                      <p className='text-[18px] text-[--main-color1]'>{t('email')}:</p>
                      <p className="text-[18px] ">{contact?.email}</p>
                    </div>
                  </div>}
                  {contact?.phone && <div className="flex items-center gap-2">
                    <div className='flex items-center gap-2 justify-center'>
                      <p className='text-[18px] text-[--main-color1]'>{t('phone')}:</p>
                      <p className="text-[18px] ">{contact?.phone}</p>
                    </div>
                  </div>}

                  {contact?.message && <div className="flex items-center gap-2">
                    <div className='flex items-center gap-2 justify-center'>
                      <p className='text-[18px] text-[--main-color1]'>{t('message')}:</p>
                      <p className="text-[18px] ">{contact?.message}</p>
                    </div>
                  </div>}

                  {contact?.createdate && <div className="flex items-center gap-2">
                    <div className='flex items-center gap-2 justify-center'>
                      <p className='text-[18px] text-[--main-color1]'>{t('createdDate')}:</p>
                      <p className="text-[18px] ">{DateUtils.formatDate(contact?.createdate)}</p>
                    </div>
                  </div>}
                </div>
              </div>

              {contact.pk && <div className="flex justify-center gap-4 ">
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
                  <span>{t('remove')}</span>
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
                  <span>{t('save')}</span>
                </button>
              </div>}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">No contacts found</p>
        )}
      </div>

      {/* Popups */}
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
    </div>
  );
};

export default ContactList;
