'use client';

import Image from 'next/image';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import { useState, useRef, useEffect } from 'react';
import { useUpdateLockStatusMutation } from 'hooks/profile/mutations';
import { createPortal } from 'react-dom';
import lock from 'assets/images/lock.png';
import ProfileSwitcher from './ProfileSwitcher';
import Link from 'next/link';
import { ProButton } from 'components/subcriptions/subcriptionButtons';
import { useSubscriptionStatus } from 'hooks';

interface ProfileInformationProps {
  profileData?: ProfileForReadDTO;
  withEdit?: boolean;
  withSwitch?: boolean;
  withBio?: boolean;
}

export default function ProfileInformation({ profileData, withEdit, withSwitch, withBio }: ProfileInformationProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const lockConfirmModalRef = useRef<HTMLDialogElement>(null);
  const { onUpdateLockStatus, isLoading: isLockLoading } = useUpdateLockStatusMutation();

  const handleLockToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent the default toggle behavior
    e.preventDefault();
    // Show confirmation dialog
    lockConfirmModalRef.current?.showModal();
  };

  const handleLockConfirm = () => {
    // Call the API to update lock status
    onUpdateLockStatus({ isLocked: !profileData?.IsLocked });
    // Close the dialog
    lockConfirmModalRef.current?.close();
    // The profile lock status will be updated via the react-query invalidation in the hook
  };

  const [mounted, setMounted] = useState(false);

  const hasProAccess = useSubscriptionStatus({
    subscriptionType: profileData?.type,
    subscriptionEndDate: profileData?.subscriptionEnddate
  });

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }

    if (mounted) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [mounted]);

  if (!profileData) return null;

  return (
    <div className="relative w-full px-4 sm:px-0 mb-6">
      {withEdit && (
        <>
          <button className="absolute -top-2 -right-2 z-10" onClick={() => setShowMenu(!showMenu)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
                stroke="#FEC400"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.0379 3.02025L8.15793 10.9003C7.85793 11.2003 7.55793 11.7903 7.49793 12.2203L7.06793 15.2303C6.90793 16.3203 7.67793 17.0803 8.76793 16.9303L11.7779 16.5003C12.1979 16.4403 12.7879 16.1403 13.0979 15.8403L20.9779 7.96025C22.3379 6.60025 22.9779 5.02025 20.9779 3.02025C18.9779 1.02025 17.3979 1.66025 16.0379 3.02025Z"
                stroke="#FEC400"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14.9102 4.15039C15.5802 6.54039 17.4502 8.41039 19.8502 9.09039"
                stroke="#FEC400"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Menu Overlay */}
          {showMenu &&
            mounted &&
            createPortal(
              <>
                {/* Backdrop - Full screen overlay */}
                <div
                  className="fixed inset-0 z-[9999] bg-black bg-opacity-50 animate-fade-in-fast"
                  onClick={() => setShowMenu(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                  }}
                />

                {/* Menu Panel - Fixed to bottom of viewport */}
                <div
                  ref={menuRef}
                  className="fixed bottom-0 left-0 right-0 z-[10000] bg-white dark:bg-[#4A4A48] rounded-t-2xl py-6 px-4 border-t border-[#FEC400]/30 shadow-lg"
                  style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10000,
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    width: '100%',
                    margin: 0,
                    transform: 'translateY(0)',
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  <div className="flex justify-center items-center mb-4">
                    <div className="w-1/2 justify-center flex items-center border border-[#FEC400]"></div>
                  </div>

                  <div className="space-y-0">
                    {/* Switch Profile */}
                    <div
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg cursor-pointer"
                      onClick={() => {
                        setShowMenu(false);
                        setShowProfileSwitcher(true);
                      }}
                    >
                      <div className="w-8 h-8 flex items-center justify-center">
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
                          <path d="M17 1l4 4-4 4" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <path d="M7 23l-4-4 4-4" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                      </div>
                      <div className="text-gray-700 dark:text-white">Switch Profile</div>
                    </div>

                    {/* Edit Profile */}
                    <Link href={`/profile/edit`} className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg cursor-pointer">
                      <div className="w-8 h-8 flex items-center justify-center">
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
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </div>
                      <div className="text-gray-700 dark:text-white">Edit Profile</div>
                    </Link>

                    {/* Customization */}
                    <Link
                      href="/profile/edit?customization=1"
                      className="flex items-center justify-between gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center">
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
                            <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
                            <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                            <path d="M12 2v2" />
                            <path d="M12 22v-2" />
                            <path d="m17 20.66-1-1.73" />
                            <path d="M11 10.27 7 3.34" />
                            <path d="m20.66 17-1.73-1" />
                            <path d="m3.34 7 1.73 1" />
                            <path d="M14 12h8" />
                            <path d="M2 12h2" />
                            <path d="m20.66 7-1.73 1" />
                            <path d="m3.34 17 1.73-1" />
                            <path d="m17 3.34-1 1.73" />
                            <path d="m7 20.66-1-1.73" />
                          </svg>
                        </div>
                        <div className="text-gray-700 dark:text-white">Customization</div>
                      </div>
                      {hasProAccess && <ProButton />}
                    </Link>

                    {/* Lock Profile */}
                    <div className="flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center">
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
                            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                        <div className="text-gray-700 dark:text-white">Lock Profile</div>
                      </div>
                      {/* Lock Profile Toggle */}
                      {
                        !hasProAccess ? (
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={profileData?.IsLocked || false}
                              onChange={handleLockToggle}
                            />
                            <div
                              className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]"
                            ></div>
                          </label>
                        ) : (
                          <ProButton />
                        )}

                      {/* Lock Profile Dialog */}
                      <dialog ref={lockConfirmModalRef} className="modal modal-backdrop">
                        <div className="modal-box rounded-[15px] border border-white bg-[#FEF9E9] backdrop-blur-[15px] transform duration-300 transition-all scale-90 opacity-0 modal-open:scale-100 modal-open:opacity-100 max-w-md">
                          <div className="flex flex-col items-center text-center">
                            {/* Yellow line at top */}
                            <div className="h-1 bg-[#FEC400] w-48 mb-4 rounded-full"></div>

                            {/* Title */}
                            <h3 className="font-bold text-2xl text-black mb-4">
                              {!profileData?.IsLocked ? 'Account Locked' : 'Account Unlocked'}
                            </h3>

                            {/* Lock and Key Image */}
                            <div className="mb-4 relative">
                              <Image src={lock} alt="Lock" width={180} height={180} />
                            </div>

                            {/* Description */}
                            <p className="text-black mb-4 px-4">
                              {profileData?.IsLocked
                                ? 'This account is currently unavailable. It seems that the digital card owner has disabled their profile at the moment. You can leave them a message and they will contact you when their account is reactivated.'
                                : 'When activating this option, your profile will be locked, and no one will be able to access your data when scanning the digital card or any of your smart products. Instead, they will see a message stating that the account is currently unavailable. You can reactivate your profile at any time through the same option.'}
                            </p>

                            <div className="modal-action w-full">
                              <form method="dialog" className="w-full flex gap-3">
                                <button className="btn bg-gray-300 hover:bg-gray-400 text-black border-none flex-1">
                                  Cancel
                                </button>
                                <button
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
                    </div>
                  </div>
                </div>
              </>,
              document.body
            )}
        </>
      )}
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          {profileData.imageFilename && (
            <>
              <Image
                src={`https://fikrafarida.com/Media/Profiles/${profileData.imageFilename}`}
                alt="Profile"
                className="w-24 h-24 rounded-full bg-black"
                width={100}
                height={100}
              />
              {profileData.bio && withBio && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-body bg-[#646458] text-[var(--main-color1)] max-w-[150px] truncate">
                  {profileData.bio}
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col py-2">
          <div className="flex items-center gap-2">
            <h1 className="text-md font-semibold ">{profileData.fullname}</h1>
            {withSwitch && (
              <p
                className="text-gray-400 underline cursor-pointer text-[10px]"
                onClick={() => setShowProfileSwitcher(true)}
              >
                Switch Account
              </p>
            )}
          </div>
          <p className="text-gray-400 text-sm">{profileData.jobTitle}</p>
        </div>
      </div>

      {showProfileSwitcher && <ProfileSwitcher
        isOpen={showProfileSwitcher}
        onClose={() => setShowProfileSwitcher(false)}
      />}
    </div>
  );
}
