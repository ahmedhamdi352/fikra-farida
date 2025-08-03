'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAddContactToGroupMutation } from 'hooks/profile';
import { GroupResponseDTO } from 'types';
import LoadingSpinner from 'components/ui/LoadingSpinner';

interface AddToGroupPopupProps {
  isOpen: boolean;
  onClose: () => void;
  contactPk: number;
  groups: GroupResponseDTO[];
}

export default function AddToGroupPopup({ isOpen, onClose, contactPk, groups }: AddToGroupPopupProps) {
  const { onAddContactToGroup, isLoading } = useAddContactToGroupMutation();

  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (mounted && isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mounted, isOpen, onClose]);

  const handleAddToGroup = (group: GroupResponseDTO) => {
    onAddContactToGroup({
      groupId: group.GroupId,
      connectionId: contactPk
    });
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <>
      {/* Backdrop - Full screen overlay */}
      <div
        className="fixed inset-0 z-[9999] bg-black bg-opacity-50 animate-fade-in-fast"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      />

      {/* Modal Panel */}
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] bg-[#4A4A48] rounded-2xl py-6 px-4 shadow-lg w-[90%] max-w-md"
        style={{
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        <div className="flex justify-center items-center mb-4">
          <div className="w-1/3 h-1 bg-[#FEC400] rounded-full"></div>
        </div>

        <h2 className="text-center text-2xl font-bold text-[#FEC400] mb-4">Add To Group</h2>
        {isLoading && <LoadingSpinner />}
        {!isLoading && <div className="space-y-4">

          {/* Existing Profiles */}
          {groups?.map((group) => (
            <div
              key={group.GroupId}
              className={`px-4 py-6 rounded-lg cursor-pointer border border-[#BEAF9E]
                hover:bg-[#646458]
                `}
              onClick={() => handleAddToGroup(group)}
            >
              <div className="flex items-center gap-3">

                <div>
                  <h3 className="text-xl font-semibold text-white">{group.GroupName}</h3>
                  <span className="text-sm text-gray-400">{group.CompanyName}</span>
                  <div className="flex justify-start gap-1">
                    <p className="text-h4 font-bold">{group.UsersCount}</p>
                    <p className="text-h4 text-[--main-color1]">Members</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>}
      </div>
    </>,
    document.body
  );
}
