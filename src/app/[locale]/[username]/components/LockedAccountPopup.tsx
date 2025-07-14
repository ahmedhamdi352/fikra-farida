'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import lockIcon from 'assets/images/lock.png';

interface LockedAccountPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isLocked?: boolean; // Current lock status
  onConfirm?: () => void; // Function to call when confirming lock/unlock
}

export default function LockedAccountPopup({
  isOpen,
  onClose,
  isLocked = false,
  onConfirm
}: LockedAccountPopupProps) {
  const [mounted, setMounted] = useState(false);
  const [isLockLoading, setIsLockLoading] = useState(false);
  const lockConfirmModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && lockConfirmModalRef.current) {
      lockConfirmModalRef.current.showModal();
      // Add blur to the main page when popup is open
      document.body.classList.add('blur-backdrop');
    } else if (!isOpen && lockConfirmModalRef.current) {
      lockConfirmModalRef.current.close();
      // Remove blur when popup is closed
      document.body.classList.remove('blur-backdrop');
    }
    
    // Add style for blur effect if it doesn't exist
    if (!document.getElementById('blur-backdrop-style')) {
      const style = document.createElement('style');
      style.id = 'blur-backdrop-style';
      style.innerHTML = `
        .blur-backdrop > *:not(.modal) {
          filter: blur(15px);
          transition: filter 0.3s ease;
        }
      `;
      document.head.appendChild(style);
    }
  }, [isOpen]);

  const handleLockConfirm = async () => {
    if (onConfirm) {
      setIsLockLoading(true);
      try {
        await onConfirm();
      } finally {
        setIsLockLoading(false);
        onClose();
      }
    }
  };

  if (!mounted) return null;

  // Prevent closing on outside click
  const handleDialogClick = (e: React.MouseEvent) => {
    // Prevent the default behavior of closing when clicking outside
    e.stopPropagation();
  };

  return (
    <dialog 
      ref={lockConfirmModalRef} 
      className="modal modal-backdrop" 
      onClose={onClose}
      onClick={handleDialogClick}>
      <div className="modal-box rounded-[15px] border border-white bg-[#FEF9E9] backdrop-blur-[200px] transform duration-300 transition-all scale-90 opacity-0 modal-open:scale-100 modal-open:opacity-100 max-w-md">
        <div className="flex flex-col items-center text-center">
          {/* Yellow line at top */}
          <div className="h-1 bg-[#FEC400] w-48 mb-4 rounded-full"></div>

          {/* Title */}
          <h3 className="font-bold text-2xl text-black mb-4">
            {!isLocked ? 'Account Locked' : 'Account Unlocked'}
          </h3>

          {/* Lock and Key Image */}
          <div className="mb-4 relative">
            <Image src={lockIcon} alt="Lock" width={180} height={180} />
          </div>

          {/* Description */}
          <p className="text-black mb-4 px-4">
            {isLocked
              ? 'This account is currently unavailable. It seems that the digital card owner has disabled their profile at the moment. You can leave them a message and they will contact you when their account is reactivated.'
              : 'When activating this option, your profile will be locked, and no one will be able to access your data when scanning the digital card or any of your smart products. Instead, they will see a message stating that the account is currently unavailable. You can reactivate your profile at any time through the same option.'}
          </p>

          <div className="modal-action w-full">
            <form method="dialog" className="w-full flex gap-3" onSubmit={(e) => e.preventDefault()}>
              <button
                className="btn bg-gray-300 hover:bg-gray-400 text-black border-none flex-1"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLockConfirm}
                className="btn bg-[#FEC400] hover:bg-[#FEC400]/90 text-black border-none flex-1"
                disabled={isLockLoading}
              >
                {isLockLoading ? 'Processing...' : 'Confirm'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  );
}
