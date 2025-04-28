'use client';

import { useState, useRef } from 'react';
// import Image from 'next/image';
import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO'
import ProfileInformation from './ProfileInformation';

export default function ProfileContent({ profileData }: { profileData?: ProfileForReadDTO }) {
  const [collectInfo, setCollectInfo] = useState(true);
  const [directLinkMode, setDirectLinkMode] = useState(false);
  const directLinkModalRef = useRef<HTMLDialogElement>(null);
  const collectInfoModalRef = useRef<HTMLDialogElement>(null);

  const handleDirectLinkModeChange = (checked: boolean) => {
    if (checked) {
      directLinkModalRef.current?.showModal();
    }
    if (!checked) {
      setDirectLinkMode(checked);
    }
  };

  const handleCollectInfoChange = (checked: boolean) => {
    if (checked) {
      collectInfoModalRef.current?.showModal();
    }
    if (!checked) {
      setCollectInfo(checked);
    }
  };

  if (!profileData) {
    return <div>No profile data found</div>;
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="cursor-help">
                    <path d="M8.00016 14.6663C11.6668 14.6663 14.6668 11.6663 14.6668 7.99967C14.6668 4.33301 11.6668 1.33301 8.00016 1.33301C4.3335 1.33301 1.3335 4.33301 1.3335 7.99967C1.3335 11.6663 4.3335 14.6663 8.00016 14.6663Z" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 5.33301V8.66634" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.99609 10.667H8.00208" stroke="#FEC400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked={collectInfo}
                onChange={(e) => handleCollectInfoChange(e.target.checked)}
              />
              <div className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]">
              </div>
            </label>
          </div>

          <div className="flex items-center justify-between mb-4 px-4 py-2 rounded-lg border border-[var(--main-color1)]">
            <div className="flex items-center gap-2">
              <span className="text-body">Direct Link Mode</span>
              <div className="relative group">
                <div className="tooltip" data-tip="hello">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="cursor-help">
                    <path d="M8.00016 14.6663C11.6668 14.6663 14.6668 11.6663 14.6668 7.99967C14.6668 4.33301 11.6668 1.33301 8.00016 1.33301C4.3335 1.33301 1.3335 4.33301 1.3335 7.99967C1.3335 11.6663 4.3335 14.6663 8.00016 14.6663Z" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 5.33301V8.66634" stroke="#FEC400" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7.99609 10.667H8.00208" stroke="#FEC400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                defaultChecked={directLinkMode}
                onChange={(e) => handleDirectLinkModeChange(e.target.checked)}
              />
              <div className="w-12 h-6 bg-gray-200 dark:bg-[rgba(255,255,255,0.1)] border border-gray-300 dark:border-transparent peer-focus:outline-none rounded-full peer
                        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full
                        after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                        after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-[#FEC400] peer-checked:border-[#FEC400]">
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-center">
          <button className="bg-[#FEF3C7] text-black font-medium py-3 px-6 rounded-3xl flex items-center justify-center gap-2 w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
              <path d="M15.4698 8.33C14.8817 6.80882 13.8608 5.49331 12.5332 4.54604C11.2056 3.59878 9.62953 3.06129 7.99979 3C6.37005 3.06129 4.79398 3.59878 3.46639 4.54604C2.1388 5.49331 1.11787 6.80882 0.529787 8.33C0.490071 8.43985 0.490071 8.56015 0.529787 8.67C1.11787 10.1912 2.1388 11.5067 3.46639 12.454C4.79398 13.4012 6.37005 13.9387 7.99979 14C9.62953 13.9387 11.2056 13.4012 12.5332 12.454C13.8608 11.5067 14.8817 10.1912 15.4698 8.67C15.5095 8.56015 15.5095 8.43985 15.4698 8.33ZM7.99979 13C5.34979 13 2.54979 11.035 1.53479 8.5C2.54979 5.965 5.34979 4 7.99979 4C10.6498 4 13.4498 5.965 14.4648 8.5C13.4498 11.035 10.6498 13 7.99979 13Z" fill="black" />
              <path d="M8 5.5C7.40666 5.5 6.82664 5.67595 6.33329 6.00559C5.83994 6.33524 5.45543 6.80377 5.22836 7.35195C5.0013 7.90013 4.94189 8.50333 5.05765 9.08527C5.1734 9.66721 5.45912 10.2018 5.87868 10.6213C6.29824 11.0409 6.83279 11.3266 7.41473 11.4424C7.99667 11.5581 8.59987 11.4987 9.14805 11.2716C9.69623 11.0446 10.1648 10.6601 10.4944 10.1667C10.8241 9.67336 11 9.09334 11 8.5C11 7.70435 10.6839 6.94129 10.1213 6.37868C9.55871 5.81607 8.79565 5.5 8 5.5ZM8 10.5C7.60444 10.5 7.21776 10.3827 6.88886 10.1629C6.55996 9.94318 6.30362 9.63082 6.15224 9.26537C6.00087 8.89991 5.96126 8.49778 6.03843 8.10982C6.1156 7.72186 6.30608 7.36549 6.58579 7.08579C6.86549 6.80608 7.22186 6.6156 7.60982 6.53843C7.99778 6.46126 8.39992 6.50087 8.76537 6.65224C9.13082 6.80362 9.44318 7.05996 9.66294 7.38886C9.8827 7.71776 10 8.10444 10 8.5C10 9.03043 9.78929 9.53914 9.41421 9.91421C9.03914 10.2893 8.53043 10.5 8 10.5Z" fill="black" />
            </svg>
            Preview
          </button>
        </div>
      </div>

      {/* Collect Info Modal */}
      <dialog ref={collectInfoModalRef} className="modal modal-backdrop">
        <div className="modal-box rounded-[15px] border border-white bg-[#FEF3C7] backdrop-blur-[15px] transform duration-300 transition-all scale-90 opacity-0 modal-open:scale-100 modal-open:opacity-100">
          <h3 className="text-h2 font-bold text-black mb-4">Collect Info Mode</h3>
          <p className="text-black mb-6">
            When Collect Info is enabled, you&apos;ll be able to gather information about your visitors, such as their name and contact details.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button onClick={() => setCollectInfo(true)} className="btn bg-[#FEC400] hover:bg-[#FEC400]/90 text-black border-none">
                Got it
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Direct Link Mode Modal */}
      <dialog ref={directLinkModalRef} className="modal modal-backdrop">
        <div className="modal-box rounded-[15px] border border-white bg-[#FEF3C7] backdrop-blur-[15px] transform duration-300 transition-all scale-90 opacity-0 modal-open:scale-100 modal-open:opacity-100">
          <h3 className="font-bold text-h2 text-black mb-4">Direct Link Mode</h3>
          <p className="text-black mb-6">
            When Direct Link Mode is enabled, users will be taken directly to the destination URL instead of your profile page.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button onClick={() => setDirectLinkMode(true)} className="btn bg-[#FEC400] hover:bg-[#FEC400]/90 text-black border-none">
                Got it
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
