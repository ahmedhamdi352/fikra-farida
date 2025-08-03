'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ConnectionForCreateDTO } from 'types';

interface ViewContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
  contact: ConnectionForCreateDTO | null;
}


export default function ViewContactPopup({ isOpen, onClose, contact }: ViewContactPopupProps) {

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

        <h2 className="text-center text-2xl font-bold text-[#FEC400] mb-4">Contact</h2>

        <div className="space-y-4">

          <div className="flex items-center gap-4">
            <div className="flex flex-col py-2 gap-1">
              <div className="flex items-center gap-2">
                <div className='flex items-center gap-2 justify-center'>
                  <p className='text-[18px]  text-[--main-color1]'>Title:</p>
                  <h1 className="text-[18px] ">{contact?.title}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className='flex items-center gap-2 justify-center'>
                  <p className='text-[18px]  text-[--main-color1]'>Name:</p>
                  <h1 className="text-[18px] ">{contact?.fullname}</h1>
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
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
