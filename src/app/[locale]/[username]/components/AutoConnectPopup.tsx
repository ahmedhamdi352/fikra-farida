'use client';

import { useState, useEffect, useRef } from 'react';
import AutoConnectForm from './AutoConnectForm';

interface AutoConnectPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isLocked?: boolean; // Current lock status
  onConfirm?: () => void; // Function to call when confirming lock/unlock
  userPk: number;
}

export default function AutoConnectPopup({
  isOpen,
  onClose,
  userPk,
}: AutoConnectPopupProps) {
  const [mounted, setMounted] = useState(false);
  const autoConnectModalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen && autoConnectModalRef.current) {
      autoConnectModalRef.current.showModal();
      // Add blur to the main page when popup is open
      document.body.classList.add('blur-backdrop');
    } else if (!isOpen && autoConnectModalRef.current) {
      autoConnectModalRef.current.close();
      // Remove blur when popup is closed
      document.body.classList.remove('blur-backdrop');
    }

    // Add style for blur effect if it doesn't exist
    if (!document.getElementById('blur-backdrop-style')) {
      const style = document.createElement('style');
      style.id = 'blur-backdrop-style';
      style.innerHTML = `
        .blur-backdrop > *:not(.modal) {
          filter: blur(5px);
          transition: filter 0.3s ease;
        }
      `;
      document.head.appendChild(style);
    }
  }, [isOpen]);

  if (!mounted) return null;

  // Handle click outside the modal content
  const handleClickOutside = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = autoConnectModalRef.current;
    if (dialog && e.target === dialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={autoConnectModalRef}
      className="modal modal-backdrop"
      onClose={onClose}
      onClick={handleClickOutside}
    >
      <div className="modal-box rounded-[15px] border border-[var(--main-color1)] bg-[#50514E] backdrop-blur-[200px] transform duration-300 transition-all scale-90 opacity-0 modal-open:scale-100 modal-open:opacity-100 max-w-md">
        <div className="w-full flex flex-col items-center text-center">
          {/* Yellow line at top */}
          <div className="h-1 bg-[#FEC400] w-48 mb-4 rounded-full"></div>

          {/* Title */}
          <h3 className="font-bold text-2xl text-[var(--main-color1)] mb-4">
            Share your information with me
          </h3>
          <AutoConnectForm userPk={userPk} onClose={onClose} />
        </div>
      </div>
    </dialog>
  );
}
