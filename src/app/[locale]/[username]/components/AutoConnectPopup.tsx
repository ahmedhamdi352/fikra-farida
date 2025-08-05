// src/components/AutoConnectPopup.tsx
'use client';

import { useEffect, useRef } from 'react';
import AutoConnectForm from './AutoConnectForm'; // Assuming AutoConnectForm is in the same directory

interface AutoConnectPopupProps {
  isOpen: boolean;
  onClose: () => void;
  isLocked?: boolean; // Prop from previous discussion, though not used in the provided snippet
  onConfirm?: () => void; // Prop from previous discussion, though not used in the provided snippet
  userPk: number;
}

export default function AutoConnectPopup({
  isOpen,
  onClose,
  userPk,
}: AutoConnectPopupProps) {
  const autoConnectModalRef = useRef<HTMLDialogElement>(null);

  // Effect to handle showing/closing the native <dialog> element
  useEffect(() => {
    const dialogElement = autoConnectModalRef.current;

    if (dialogElement) {
      if (isOpen) {
        if (!dialogElement.open) {
          dialogElement.showModal();
        }
        document.body.classList.add('blur-backdrop');
      } else {
        if (dialogElement.open) {
          dialogElement.close();
        }
        document.body.classList.remove('blur-backdrop');
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const styleId = 'blur-backdrop-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .blur-backdrop > *:not(.modal) {
          filter: blur(5px);
          transition: filter 0.3s ease;
        }
      `;
      document.head.appendChild(style);
    }

    // Cleanup function to remove the style tag when the component unmounts
    return () => {
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and once on unmount

  // Handle click outside the modal content to close it
  // This listens to clicks on the <dialog> element itself, not its content
  const handleClickOutside = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = autoConnectModalRef.current;
    // Check if the click target is the dialog element itself (the backdrop)
    if (dialog && e.target === dialog) {
      onClose();
    }
  };

  return (
    <dialog
      ref={autoConnectModalRef}
      className="modal modal-backdrop"
      // Native 'close' event for <dialog>: fires when dialog is closed via Escape key or dialog.close()
      onClose={onClose}
      // Custom handler for clicks on the dialog backdrop
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
          {/* Render the form component */}
          <AutoConnectForm userPk={userPk} onClose={onClose} />
        </div>
      </div>
    </dialog>
  );
}