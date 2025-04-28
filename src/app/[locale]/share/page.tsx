'use client';

import { useEffect } from 'react'
import { useGetProfileQuery, useGetQrCodeQuery } from 'hooks/profile';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import ProfileInformation from './components/ProfileInformation';
import Image from 'next/image';

export default function SharePage() {

  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();
  const { data: QrCodeData, isLoading: QrCodeLoading, onGetProfileQrCode } = useGetQrCodeQuery();

  useEffect(() => {
    onGetProfile()
  }, []);

  useEffect(() => {
    if (profileData?.userPk) {
      onGetProfileQrCode(profileData?.userPk)
    }
  }, [profileData]);

  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading || QrCodeLoading} />;
  }

  console.log('QR Code Data:', QrCodeData, QrCodeData?.imagename);

  return (
    <div className="w-full min-h-screen py-8 px-4 flex flex-col items-center">
      <div className='w-full max-w-screen-md  py-8'>
        <div className="card-container rounded-3xl p-6">
          <ProfileInformation profileData={profileData} withEdit={false} />

          <div className="flex flex-col items-center justify-center my-8">
            <Image
              src={`https://fikrafarida.com/Media/Profiles/${QrCodeData?.imagename || ''}`}
              alt="QR Code"
              width={300}
              height={300}
              className="border border-[var(--main-color1)] rounded-lg p-2"
              priority
            />
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => {
                const profileUrl = `https://www.fikrafarida.com/${profileData?.username}`; // Replace with actual user profile URL
                navigator.clipboard.writeText(profileUrl).then(() => {
                  alert('Profile link copied to clipboard!');
                });
                // Alternatively, use native share dialog:
                navigator.share?.({ url: profileUrl });
              }}
              className="inline-flex items-center whitespace-nowrap gap-2 bg-[#FEC400] text-black text-body px-6 py-3 rounded-2xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <g clip-path="url(#clip0_2369_8968)">
                  <path d="M9.25 14.25C9.25 14.7656 9.34766 15.25 9.54297 15.7031C9.73828 16.1562 10.0039 16.5547 10.3398 16.8984C10.6758 17.2422 11.0742 17.5117 11.5352 17.707C11.9961 17.9023 12.4844 18 13 18H15.25V19.5H13C12.2734 19.5 11.5938 19.3633 10.9609 19.0898C10.3281 18.8164 9.77344 18.4414 9.29688 17.9648C8.82031 17.4883 8.44531 16.9336 8.17188 16.3008C7.89844 15.668 7.75781 14.9844 7.75 14.25C7.75 13.5234 7.88672 12.8438 8.16016 12.2109C8.43359 11.5781 8.80859 11.0234 9.28516 10.5469C9.76172 10.0703 10.3164 9.69531 10.9492 9.42188C11.582 9.14844 12.2656 9.00781 13 9H13.75V10.5H13C12.4844 10.5 12 10.5977 11.5469 10.793C11.0938 10.9883 10.6953 11.2578 10.3516 11.6016C10.0078 11.9453 9.73828 12.3438 9.54297 12.7969C9.34766 13.25 9.25 13.7344 9.25 14.25ZM18.25 10.5V9H19C19.7266 9 20.4062 9.13672 21.0391 9.41016C21.6719 9.68359 22.2266 10.0586 22.7031 10.5352C23.1797 11.0117 23.5547 11.5664 23.8281 12.1992C24.1016 12.832 24.2422 13.5156 24.25 14.25C24.25 14.9375 24.1211 15.5977 23.8633 16.2305C23.6055 16.8633 23.2344 17.4258 22.75 17.918V14.25C22.75 13.7344 22.6523 13.25 22.457 12.7969C22.2617 12.3438 21.9922 11.9492 21.6484 11.6133C21.3047 11.2773 20.9062 11.0078 20.4531 10.8047C20 10.6016 19.5156 10.5 19 10.5H18.25ZM11.5 4.5C12.2266 4.5 12.9062 4.63672 13.5391 4.91016C14.1719 5.18359 14.7266 5.55859 15.2031 6.03516C15.6797 6.51172 16.0547 7.06641 16.3281 7.69922C16.6016 8.33203 16.7422 9.01562 16.75 9.75C16.75 10.4766 16.6133 11.1562 16.3398 11.7891C16.0664 12.4219 15.6914 12.9766 15.2148 13.4531C14.7383 13.9297 14.1836 14.3047 13.5508 14.5781C12.918 14.8516 12.2344 14.9922 11.5 15H10.75V13.5H11.5C12.0156 13.5 12.5 13.4023 12.9531 13.207C13.4062 13.0117 13.8008 12.7461 14.1367 12.4102C14.4727 12.0742 14.7422 11.6758 14.9453 11.2148C15.1484 10.7539 15.25 10.2656 15.25 9.75C15.25 9.23438 15.1523 8.75 14.957 8.29688C14.7617 7.84375 14.4922 7.44922 14.1484 7.11328C13.8047 6.77734 13.4062 6.50781 12.9531 6.30469C12.5 6.10156 12.0156 6 11.5 6H5.5C4.98438 6 4.5 6.09766 4.04688 6.29297C3.59375 6.48828 3.19531 6.75781 2.85156 7.10156C2.50781 7.44531 2.23828 7.84375 2.04297 8.29688C1.84766 8.75 1.75 9.23438 1.75 9.75C1.75 10.2656 1.84766 10.75 2.04297 11.2031C2.23828 11.6562 2.50391 12.0547 2.83984 12.3984C3.17578 12.7422 3.57422 13.0117 4.03516 13.207C4.49609 13.4023 4.98438 13.5 5.5 13.5H6.25V15H5.5C4.77344 15 4.09375 14.8633 3.46094 14.5898C2.82812 14.3164 2.27344 13.9414 1.79688 13.4648C1.32031 12.9883 0.945312 12.4336 0.671875 11.8008C0.398438 11.168 0.257812 10.4844 0.25 9.75C0.25 9.02344 0.386719 8.34375 0.660156 7.71094C0.933594 7.07812 1.30859 6.52344 1.78516 6.04688C2.26172 5.57031 2.81641 5.19531 3.44922 4.92188C4.08203 4.64844 4.76562 4.50781 5.5 4.5H11.5ZM24.25 19.5V21H21.25V24H19.75V21H16.75V19.5H19.75V16.5H21.25V19.5H24.25Z" fill="black" />
                </g>
                <defs>
                  <clipPath id="clip0_2369_8968">
                    <rect width="24" height="24" fill="white" transform="translate(0.25)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Share Link</span>
            </button>
            <button
              onClick={() => {
                // Assuming you have the QR code image URL or data
                const qrCodeImageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=' +
                  encodeURIComponent(`https://www.fikrafarida.com/${profileData?.username}`);

                if (navigator.share) {
                  navigator.share({
                    title: 'My Profile QR Code',
                    text: 'Scan this QR code to visit my profile',
                    url: qrCodeImageUrl
                  }).catch(err => {
                    console.log('Error sharing:', err);
                  });
                }
              }}
              className="inline-flex text-body items-center whitespace-nowrap gap-2 border border-[#FEC400] text-[#FEC400] px-6 py-3 rounded-2xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M7.75684 11.9998C7.75684 11.8009 7.83585 11.6102 7.97651 11.4695C8.11716 11.3289 8.30792 11.2498 8.50684 11.2498H11.9998V7.75684C11.9998 7.55792 12.0789 7.36716 12.2195 7.22651C12.3602 7.08585 12.5509 7.00684 12.7498 7.00684C12.9487 7.00684 13.1395 7.08585 13.2802 7.22651C13.4208 7.36716 13.4998 7.55792 13.4998 7.75684V11.2498H16.9928C17.1917 11.2498 17.3825 11.3289 17.5232 11.4695C17.6638 11.6102 17.7428 11.8009 17.7428 11.9998C17.7428 12.1987 17.6638 12.3895 17.5232 12.5302C17.3825 12.6708 17.1917 12.7498 16.9928 12.7498H13.4998V16.2428C13.4998 16.4417 13.4208 16.6325 13.2802 16.7732C13.1395 16.9138 12.9487 16.9928 12.7498 16.9928C12.5509 16.9928 12.3602 16.9138 12.2195 16.7732C12.0789 16.6325 11.9998 16.4417 11.9998 16.2428V12.7498H8.50684C8.30792 12.7498 8.11716 12.6708 7.97651 12.5302C7.83585 12.3895 7.75684 12.1987 7.75684 11.9998ZM8.06716 3.76856C11.1796 3.4235 14.3207 3.4235 17.4332 3.76856C19.2602 3.97256 20.7352 5.41156 20.9492 7.24856C21.3192 10.4056 21.3192 13.5946 20.9492 16.7516C20.7342 18.5886 19.2592 20.0266 17.4332 20.2316C14.3207 20.5766 11.1796 20.5766 8.06716 20.2316C6.24016 20.0266 4.76516 18.5886 4.55116 16.7516C4.18282 13.5946 4.18282 10.4055 4.55116 7.24856C4.76516 5.41156 6.24116 3.97256 8.06716 3.76856ZM17.2672 5.25856C14.265 4.92579 11.2353 4.92579 8.23316 5.25856C7.6774 5.32021 7.15866 5.56743 6.76074 5.96028C6.36281 6.35312 6.10895 6.86864 6.04016 7.42356C5.68449 10.4645 5.68449 13.5366 6.04016 16.5776C6.10916 17.1323 6.36312 17.6476 6.76102 18.0402C7.15892 18.4329 7.67755 18.6799 8.23316 18.7416C11.2102 19.0736 14.2902 19.0736 17.2672 18.7416C17.8226 18.6797 18.341 18.4326 18.7387 18.0399C19.1364 17.6473 19.3902 17.1321 19.4592 16.5776C19.8148 13.5366 19.8148 10.4645 19.4592 7.42356C19.39 6.86915 19.1361 6.35421 18.7384 5.96178C18.3407 5.56936 17.8224 5.32234 17.2672 5.26056" fill="#FEC400" fill-opacity="0.9" />
              </svg>
              <span>Share QR</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
