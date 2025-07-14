'use client';

import { useRef } from 'react';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import ProfileInformation from './ProfileInformation';
import Image from 'next/image';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import collect from 'assets/images/collect.png';

import { useUpdateCollectInfoMutation, useUpdateDirectLinkMutation } from 'hooks/profile/mutations';
import Link from 'next/link';

export default function ProfileContent({ profileData }: { profileData?: ProfileForReadDTO }) {
  const baseIconsUrl = process.env.NEXT_PUBLIC_BASE_ICONS_URL;

  const directLinkModalRef = useRef<HTMLDialogElement>(null);
  const collectInfoModalRef = useRef<HTMLDialogElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use the mutation hooks
  const { onUpdateCollectInfo, isLoading: isCollectInfoLoading } = useUpdateCollectInfoMutation();
  const { onUpdateDirectLink, isLoading: isDirectLinkLoading } = useUpdateDirectLinkMutation();

  // Handle direct link mode toggle
  const handleDirectLinkModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    // If user already has a direct link, disable it by setting to empty string
    if (profileData?.directurl) {
      onUpdateDirectLink({ directurl: '' });
    } else {
      // If no direct link set, open the modal to choose a link
      toggleDirectLinkMode();
    }
  };

  // Toggle direct link mode
  const toggleDirectLinkMode = () => {
    directLinkModalRef.current?.showModal();
    // Reset scroll position to show the first row and column when opened
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = 0;
        scrollContainerRef.current.scrollTop = 0;
      }
    }, 0);
  };

  // Call API to update direct link mode
  const handleDirectLinkConfirm = (url: string) => {
    onUpdateDirectLink({ directurl: url });
    directLinkModalRef.current?.close();
  };

  // Prevent default toggle behavior and show confirmation dialog only when enabling
  const handleCollectInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    // If collect info is already enabled (trying to disable it), call API directly
    if (profileData?.autoconnect) {
      onUpdateCollectInfo({ autoconnect: false });
    } else {
      // If collect info is disabled (trying to enable it), show confirmation modal
      collectInfoModalRef.current?.showModal();
    }
  };

  // Call API to update collect info setting
  const handleCollectInfoConfirm = () => {
    onUpdateCollectInfo({ autoconnect: !profileData?.autoconnect });
    collectInfoModalRef.current?.close();
  };

  if (!profileData) {
    return <div>No profile data found</div>;
  }

  if (isDirectLinkLoading || isCollectInfoLoading) {
    return <LoadingOverlay isLoading={isDirectLinkLoading || isCollectInfoLoading} />;
  }

  return (
    <div className="w-full max-w-screen-md  py-8">
      <div className="card-container rounded-3xl p-6">
        <ProfileInformation profileData={profileData} withEdit={true} />
        <div className="my-6">
          <div className="flex items-center justify-between mb-4 px-4 py-2 rounded-lg border border-[var(--main-color1)]">
            <div className="flex items-center gap-2">
              <span className="text-body">collect info</span>
              <div className="relative group">
                <div className="tooltip" data-tip="hello">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="cursor-help"
                  >
                    <path
                      d="M8.00016 14.6663C11.6668 14.6663 14.6668 11.6663 14.6668 7.99967C14.6668 4.33301 11.6668 1.33301 8.00016 1.33301C4.3335 1.33301 1.3335 4.33301 1.3335 7.99967C1.3335 11.6663 4.3335 14.6663 8.00016 14.6663Z"
                      stroke="#FEC400"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 5.33301V8.66634"
                      stroke="#FEC400"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.99609 10.667H8.00208"
                      stroke="#FEC400"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={profileData?.autoconnect || false}
                onChange={handleCollectInfoChange}
              />
              <div
                className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]"
              ></div>
            </label>
          </div>

          <div className="flex items-center justify-between mb-4 px-4 py-2 rounded-lg border border-[var(--main-color1)]">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-body">Direct Link Mode</span>

              {/* Show the icon of the selected direct link */}

              <div className="relative group">
                <div className="tooltip" data-tip="hello">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="cursor-help"
                  >
                    <path
                      d="M8.00016 14.6663C11.6668 14.6663 14.6668 11.6663 14.6668 7.99967C14.6668 4.33301 11.6668 1.33301 8.00016 1.33301C4.3335 1.33301 1.3335 4.33301 1.3335 7.99967C1.3335 11.6663 4.3335 14.6663 8.00016 14.6663Z"
                      stroke="#FEC400"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 5.33301V8.66634"
                      stroke="#FEC400"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.99609 10.667H8.00208"
                      stroke="#FEC400"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              {profileData?.directurl && profileData?.links?.find(link => link.url === profileData.directurl) && (
                <div className="w-5 h-5 rounded-full overflow-hidden relative">
                  <Image
                    src={`${baseIconsUrl}${profileData.links.find(link => link.url === profileData.directurl)?.iconurl
                      }`}
                    alt="Direct Link Icon"
                    width={20}
                    height={20}
                    className="object-cover"
                  />
                </div>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={!!profileData?.directurl}
                onChange={handleDirectLinkModeChange}
              />
              <div
                className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]"
              ></div>
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <Link href={`/${profileData?.username}`} className="bg-[#FEF3C7] text-black font-medium py-3 px-6 rounded-3xl flex items-center justify-center gap-2 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path
                d="M15.4698 8.33C14.8817 6.80882 13.8608 5.49331 12.5332 4.54604C11.2056 3.59878 9.62953 3.06129 7.99979 3C6.37005 3.06129 4.79398 3.59878 3.46639 4.54604C2.1388 5.49331 1.11787 6.80882 0.529787 8.33C0.490071 8.43985 0.490071 8.56015 0.529787 8.67C1.11787 10.1912 2.1388 11.5067 3.46639 12.454C4.79398 13.4012 6.37005 13.9387 7.99979 14C9.62953 13.9387 11.2056 13.4012 12.5332 12.454C13.8608 11.5067 14.8817 10.1912 15.4698 8.67C15.5095 8.56015 15.5095 8.43985 15.4698 8.33ZM7.99979 13C5.34979 13 2.54979 11.035 1.53479 8.5C2.54979 5.965 5.34979 4 7.99979 4C10.6498 4 13.4498 5.965 14.4648 8.5C13.4498 11.035 10.6498 13 7.99979 13Z"
                fill="black"
              />
              <path
                d="M8 5.5C7.40666 5.5 6.82664 5.67595 6.33329 6.00559C5.83994 6.33524 5.45543 6.80377 5.22836 7.35195C5.0013 7.90013 4.94189 8.50333 5.05765 9.08527C5.1734 9.66721 5.45912 10.2018 5.87868 10.6213C6.29824 11.0409 6.83279 11.3266 7.41473 11.4424C7.99667 11.5581 8.59987 11.4987 9.14805 11.2716C9.69623 11.0446 10.1648 10.6601 10.4944 10.1667C10.8241 9.67336 11 9.09334 11 8.5C11 7.70435 10.6839 6.94129 10.1213 6.37868C9.55871 5.81607 8.79565 5.5 8 5.5ZM8 10.5C7.60444 10.5 7.21776 10.3827 6.88886 10.1629C6.55996 9.94318 6.30362 9.63082 6.15224 9.26537C6.00087 8.89991 5.96126 8.49778 6.03843 8.10982C6.1156 7.72186 6.30608 7.36549 6.58579 7.08579C6.86549 6.80608 7.22186 6.6156 7.60982 6.53843C7.99778 6.46126 8.39992 6.50087 8.76537 6.65224C9.13082 6.80362 9.44318 7.05996 9.66294 7.38886C9.8827 7.71776 10 8.10444 10 8.5C10 9.03043 9.78929 9.53914 9.41421 9.91421C9.03914 10.2893 8.53043 10.5 8 10.5Z"
                fill="black"
              />
            </svg>
            Preview
          </Link>
        </div>
      </div>

      {/* Collect Info Modal */}
      <dialog ref={collectInfoModalRef} className="modal modal-backdrop">
        <div className="modal-box rounded-[15px] border border-white bg-[#FEF3C7] backdrop-blur-[15px] transform duration-300 transition-all scale-90 opacity-0 modal-open:scale-100 modal-open:opacity-100">
          <div className="flex flex-col items-center text-center">
            {/* Yellow line at top */}
            <div className="h-1 bg-[#FEC400] w-48 mb-4 rounded-full"></div>

            {/* Title */}
            <h3 className="font-bold text-2xl text-black mb-4">
              {!profileData?.autoconnect ? 'Collect Info' : 'Disable Collect Info'}
            </h3>

            <div className="mb-4 relative">
              <Image src={collect} alt="collect" width={180} height={180} />
            </div>

            {/* Description */}
            <p className="text-black mb-4 px-4">
              {profileData?.autoconnect
                ? 'Disabling Collect Info will prevent you from gathering contact information from visitors. Are you sure you want to proceed?'
                : 'When this feature is enabled, a form automatically appears when you share your digital card, allowing you to instantly collect contact details.'}
            </p>

            <div className="modal-action w-full">
              <form method="dialog" className="w-full flex gap-3">
                <button className="btn bg-gray-300 hover:bg-gray-400 text-black border-none flex-1">Cancel</button>
                <button
                  onClick={handleCollectInfoConfirm}
                  className="btn bg-[#FEC400] hover:bg-[#FEC400]/90 text-black border-none flex-1"
                  disabled={isCollectInfoLoading}
                >
                  {isCollectInfoLoading ? 'Processing...' : 'Confirm'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>

      {/* Direct Link Mode Modal */}
      <dialog ref={directLinkModalRef} className="modal modal-backdrop">
        <div className="modal-box max-w-md rounded-[15px] border border-white bg-[#FEF3C7] backdrop-blur-[15px] transform duration-300 transition-all scale-90 opacity-0 modal-open:scale-100 modal-open:opacity-100">
          <div className="flex flex-col items-center text-center">
            {/* Yellow line at top */}
            <div className="h-1 bg-[#FEC400] w-48 mb-4 rounded-full"></div>

            {/* Title */}
            <h3 className="font-bold text-2xl text-black mb-4">
              {!profileData?.directurl ? 'Direct Link Mode' : 'Disable Direct Link Mode'}
            </h3>

            {/* Description */}
            <p className="text-black mb-4 px-4">
              {profileData?.directurl
                ? 'Disabling Direct Link Mode will return to showing your profile page instead of redirecting visitors directly to a URL. Are you sure you want to proceed?'
                : 'When Direct Link Mode is enabled, users will be taken directly to the destination URL instead of your profile page.'}
            </p>

            <form method="dialog" className="w-full">
              <div className="w-full mb-3">
                <div className="bg-[#50514E] rounded-xl p-3 mb-4">
                  <h4 className="text-white font-semibold text-xl mb-2 text-center">Set Direct Link</h4>

                  <p className="mb-2 text-start text-white">Available Links</p>
                  {/* Container with overflow-x-auto to enable horizontal scrolling */}
                  <div ref={scrollContainerRef} className="overflow-x-auto max-h-[300px]">
                    {/* Grid layout with fixed columns that will scroll horizontally together */}
                    <div className="grid grid-cols-3 gap-2 pb-2" style={{ minWidth: '660px' }}>
                      {/* Display all links in a single scrollable grid */}
                      {profileData?.links?.map(link => (
                        <div key={link.pk} className="bg-[#737373] rounded-xl border border-[#B0A18E] overflow-hidden">
                          <div className="flex items-center p-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden relative flex-shrink-0 mr-2">
                              <Image
                                src={`${baseIconsUrl}${link.iconurl}`}
                                alt={link.title}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            </div>
                            <span className="text-white text-sm truncate flex-grow">{link.title}</span>
                            <button
                              onClick={() => handleDirectLinkConfirm(link.url)}
                              disabled={profileData?.directurl === link.url}
                              className={`ml-2 px-3 py-1 text-xs font-medium rounded-md ${profileData?.directurl === link.url
                                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                  : 'bg-[#FEC400] text-black'
                                }`}
                            >
                              Set
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  className="py-2 px-8 bg-[#FEC400] hover:bg-[#FEC400]/90 text-black rounded-lg font-medium"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
