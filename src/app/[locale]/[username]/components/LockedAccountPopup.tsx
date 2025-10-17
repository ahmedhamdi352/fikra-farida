'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import lockIcon from 'assets/images/lock.png';
import { useTranslations } from 'next-intl';

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
}: LockedAccountPopupProps) {
  const t = useTranslations('lockedAccountPopup');
  const [mounted, setMounted] = useState(false);
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
            {!isLocked ? t('accountLocked') : t('accountUnlocked')}
          </h3>

          {/* Lock and Key Image */}
          <div className="mb-4 relative">
            <Image src={lockIcon} alt="Lock" width={180} height={180} />
          </div>

          {/* Description */}
          <p className="text-black mb-4 px-4">
          { t('thisAccountIsCurrentlyUnavailable')}
          </p>


        </div>
      </div>
    </dialog>
  );
}
