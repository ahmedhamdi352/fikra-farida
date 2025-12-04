'use client';

import { useEffect, useState } from 'react';
import { useGetProfileQuery, useGetQrCodeQuery, useGetOfflineQrCodeQuery } from 'hooks/profile';
import LoadingOverlay from 'components/ui/LoadingOverlay';
import ProfileInformation from '../profile/components/ProfileInformation';
import Image from 'next/image';
import Link from 'next/link';
import { ProButton } from 'components/subcriptions/subcriptionButtons';
import { useSubscriptionStatus } from 'hooks';
import { useTranslations, useLocale } from 'next-intl';
export default function SharePage() {
  const t = useTranslations('profile.sharePage');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { data: profileData, isLoading, onGetProfile } = useGetProfileQuery();
  const { data: QrCodeData, isLoading: QrCodeLoading, onGetProfileQrCode } = useGetQrCodeQuery();
  const { data: offlineQrCodeData, isLoading: offlineQrCodeLoading, onGetOfflineQrCode } = useGetOfflineQrCodeQuery();
  const hasProAccess = useSubscriptionStatus({
    subscriptionType: profileData?.type,
    subscriptionEndDate: profileData?.subscriptionEnddate
  });
  const [offLine, setOffLine] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    onGetProfile();
    // Detect iOS
    const ios = /iPhone|iPad|iPod/i.test(navigator.platform) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    setIsIOS(ios);
  }, []);

  useEffect(() => {
    if (profileData?.userPk) {
      onGetProfileQrCode(profileData?.userPk);
    }
  }, [profileData]);

  useEffect(() => {
    if (offLine && profileData?.userPk) {
      onGetOfflineQrCode(profileData.userPk);
    }
  }, [offLine, profileData?.userPk]);

  const handleAddToHomeScreen = async () => {
    const qrCodeImageName = offLine ? offlineQrCodeData?.imagename : QrCodeData?.imagename;
    
    if (!qrCodeImageName) {
      alert('QR code is not available');
      return;
    }

    const qrCodeUrl = `https://fikrafarida.com/Media/Profiles/${qrCodeImageName}`;

    try {
      // For iOS, use canvas approach to ensure proper image format
      if (isIOS) {
        const img = document.createElement('img');
        img.crossOrigin = 'anonymous';
        
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              throw new Error('Could not get canvas context');
            }
            
            ctx.drawImage(img, 0, 0);
            
            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
              if (!blob) {
                alert('Failed to process image. Please try again.');
                return;
              }
              
              const file = new File([blob], 'qrcode.png', { type: 'image/png' });
              
              // Use Web Share API to save to gallery
              if (navigator.share) {
                try {
                  await navigator.share({
                    files: [file],
                    title: 'QR Code',
                  });
                } catch (shareError: unknown) {
                  // If user cancelled, don't show error
                  const error = shareError as { name?: string };
                  if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
                    return;
                  }
                  // Otherwise, fall through to download
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'qrcode.png';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }
              } else {
                // Fallback for iOS without share API
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'qrcode.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }
            }, 'image/png', 1.0);
          } catch (error) {
            console.error('Error processing image:', error);
            alert('Failed to save QR code. Please try again.');
          }
        };
        
        img.onerror = () => {
          alert('Failed to load QR code image. Please try again.');
        };
        
        img.src = qrCodeUrl;
      } else {
        // For Android and other devices
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        const file = new File([blob], 'qrcode.png', { type: 'image/png' });
        
        // Try Web Share API first
        if (navigator.share) {
          try {
            const navShare = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean };
            if ('canShare' in navigator && navShare.canShare && navShare.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: 'QR Code',
              });
              return;
            } else {
              // Try without canShare check
              await navigator.share({
                files: [file],
                title: 'QR Code',
              });
              return;
            }
          } catch (shareError: unknown) {
            const error = shareError as { name?: string };
            if (error.name === 'AbortError' || error.name === 'NotAllowedError') {
              return;
            }
            // Fall through to download
          }
        }
        
        // Fallback: Direct download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error saving QR code:', error);
      alert('Failed to save QR code. Please try again.');
    }
  };

  const handleOfflineToggle = (checked: boolean): void => {
    setOffLine(checked);
    // If switching back to online mode, refresh regular QR code
    if (!checked && profileData?.userPk) {
      onGetProfileQrCode(profileData.userPk);
    }
  };

  if (isLoading || QrCodeLoading || offlineQrCodeLoading) {
    return <LoadingOverlay isLoading={isLoading || QrCodeLoading || offlineQrCodeLoading} />;
  }

  return (
    <div className="w-full min-h-screen py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-screen-md  py-8">
        <div className="flex items-center mb-6">
          <Link href="/profile" className="flex items-center text-[--main-color1] gap-2">
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
              className={isRTL ? 'rotate-180' : ''}
            >
              <path d="M19 12H5M12 19l-7-7 7-7-11-11 11-11 7 7 7 7" />
            </svg>
            <span className="uppercase text-h5 font-bold">{t('yourQRCode')}</span>
          </Link>
        </div>
        <div className="card-container rounded-3xl p-6">
          <ProfileInformation profileData={profileData} withEdit={false} withSwitch={true} />
          <div className="flex flex-col items-center justify-center my-8">
            <Image
              src={`https://fikrafarida.com/Media/Profiles/${offLine ? offlineQrCodeData?.imagename || '' : QrCodeData?.imagename || ''
                }`}
              alt={offLine ? 'Offline QR Code' : 'QR Code'}
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
                  <path
                    d="M9.25 14.25C9.25 14.7656 9.34766 15.25 9.54297 15.7031C9.73828 16.1562 10.0039 16.5547 10.3398 16.8984C10.6758 17.2422 11.0742 17.5117 11.5352 17.707C11.9961 17.9023 12.4844 18 13 18H15.25V19.5H13C12.2734 19.5 11.5938 19.3633 10.9609 19.0898C10.3281 18.8164 9.77344 18.4414 9.29688 17.9648C8.82031 17.4883 8.44531 16.9336 8.17188 16.3008C7.89844 15.668 7.75781 14.9844 7.75 14.25C7.75 13.5234 7.88672 12.8438 8.16016 12.2109C8.43359 11.5781 8.80859 11.0234 9.28516 10.5469C9.76172 10.0703 10.3164 9.69531 10.9492 9.42188C11.582 9.14844 12.2656 9.00781 13 9H13.75V10.5H13C12.4844 10.5 12 10.5977 11.5469 10.793C11.0938 10.9883 10.6953 11.2578 10.3516 11.6016C10.0078 11.9453 9.73828 12.3438 9.54297 12.7969C9.34766 13.25 9.25 13.7344 9.25 14.25ZM18.25 10.5V9H19C19.7266 9 20.4062 9.13672 21.0391 9.41016C21.6719 9.68359 22.2266 10.0586 22.7031 10.5352C23.1797 11.0117 23.5547 11.5664 23.8281 12.1992C24.1016 12.832 24.2422 13.5156 24.25 14.25C24.25 14.9375 24.1211 15.5977 23.8633 16.2305C23.6055 16.8633 23.2344 17.4258 22.75 17.918V14.25C22.75 13.7344 22.6523 13.25 22.457 12.7969C22.2617 12.3438 21.9922 11.9492 21.6484 11.6133C21.3047 11.2773 20.9062 11.0078 20.4531 10.8047C20 10.6016 19.5156 10.5 19 10.5H18.25ZM11.5 4.5C12.2266 4.5 12.9062 4.63672 13.5391 4.91016C14.1719 5.18359 14.7266 5.55859 15.2031 6.03516C15.6797 6.51172 16.0547 7.06641 16.3281 7.69922C16.6016 8.33203 16.7422 9.01562 16.75 9.75C16.75 10.4766 16.6133 11.1562 16.3398 11.7891C16.0664 12.4219 15.6914 12.9766 15.2148 13.4531C14.7383 13.9297 14.1836 14.3047 13.5508 14.5781C12.918 14.8516 12.2344 14.9922 11.5 15H10.75V13.5H11.5C12.0156 13.5 12.5 13.4023 12.9531 13.207C13.4062 13.0117 13.8008 12.7461 14.1367 12.4102C14.4727 12.0742 14.7422 11.6758 14.9453 11.2148C15.1484 10.7539 15.25 10.2656 15.25 9.75C15.25 9.23438 15.1523 8.75 14.957 8.29688C14.7617 7.84375 14.4922 7.44922 14.1484 7.11328C13.8047 6.77734 13.4062 6.50781 12.9531 6.30469C12.5 6.10156 12.0156 6 11.5 6H5.5C4.98438 6 4.5 6.09766 4.04688 6.29297C3.59375 6.48828 3.19531 6.75781 2.85156 7.10156C2.50781 7.44531 2.23828 7.84375 2.04297 8.29688C1.84766 8.75 1.75 9.23438 1.75 9.75C1.75 10.2656 1.84766 10.75 2.04297 11.2031C2.23828 11.6562 2.50391 12.0547 2.83984 12.3984C3.17578 12.7422 3.57422 13.0117 4.03516 13.207C4.49609 13.4023 4.98438 13.5 5.5 13.5H6.25V15H5.5C4.77344 15 4.09375 14.8633 3.46094 14.5898C2.82812 14.3164 2.27344 13.9414 1.79688 13.4648C1.32031 12.9883 0.945312 12.4336 0.671875 11.8008C0.398438 11.168 0.257812 10.4844 0.25 9.75C0.25 9.02344 0.386719 8.34375 0.660156 7.71094C0.933594 7.07812 1.30859 6.52344 1.78516 6.04688C2.26172 5.57031 2.81641 5.19531 3.44922 4.92188C4.08203 4.64844 4.76562 4.50781 5.5 4.5H11.5ZM24.25 19.5V21H21.25V24H19.75V21H16.75V19.5H19.75V16.5H21.25V19.5H24.25Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2369_8968">
                    <rect width="24" height="24" fill="white" transform="translate(0.25)" />
                  </clipPath>
                </defs>
              </svg>
              <span>{t('shareLink')}</span>
            </button>
            <button
              onClick={() => {
                // Assuming you have the QR code image URL or data
                const qrCodeImageUrl =
                  'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' +
                  encodeURIComponent(`https://www.fikrafarida.com/${profileData?.username}`);

                if (navigator.share) {
                  navigator
                    .share({
                      title: 'My Profile QR Code',
                      text: 'Scan this QR code to visit my profile',
                      url: qrCodeImageUrl,
                    })
                    .catch(err => {
                      console.error('Error sharing:', err);
                    });
                }
              }}
              className="inline-flex text-body items-center whitespace-nowrap gap-2 border border-[#FEC400] text-[#FEC400] px-6 py-3 rounded-2xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path
                  d="M7.75684 11.9998C7.75684 11.8009 7.83585 11.6102 7.97651 11.4695C8.11716 11.3289 8.30792 11.2498 8.50684 11.2498H11.9998V7.75684C11.9998 7.55792 12.0789 7.36716 12.2195 7.22651C12.3602 7.08585 12.5509 7.00684 12.7498 7.00684C12.9487 7.00684 13.1395 7.08585 13.2802 7.22651C13.4208 7.36716 13.4998 7.55792 13.4998 7.75684V11.2498H16.9928C17.1917 11.2498 17.3825 11.3289 17.5232 11.4695C17.6638 11.6102 17.7428 11.8009 17.7428 11.9998C17.7428 12.1987 17.6638 12.3895 17.5232 12.5302C17.3825 12.6708 17.1917 12.7498 16.9928 12.7498H13.4998V16.2428C13.4998 16.4417 13.4208 16.6325 13.2802 16.7732C13.1395 16.9138 12.9487 16.9928 12.7498 16.9928C12.5509 16.9928 12.3602 16.9138 12.2195 16.7732C12.0789 16.6325 11.9998 16.4417 11.9998 16.2428V12.7498H8.50684C8.30792 12.7498 8.11716 12.6708 7.97651 12.5302C7.83585 12.3895 7.75684 12.1987 7.75684 11.9998ZM8.06716 3.76856C11.1796 3.4235 14.3207 3.4235 17.4332 3.76856C19.2602 3.97256 20.7352 5.41156 20.9492 7.24856C21.3192 10.4056 21.3192 13.5946 20.9492 16.7516C20.7342 18.5886 19.2592 20.0266 17.4332 20.2316C14.3207 20.5766 11.1796 20.5766 8.06716 20.2316C6.24016 20.0266 4.76516 18.5886 4.55116 16.7516C4.18282 13.5946 4.18282 10.4055 4.55116 7.24856C4.76516 5.41156 6.24116 3.97256 8.06716 3.76856ZM17.2672 5.25856C14.265 4.92579 11.2353 4.92579 8.23316 5.25856C7.6774 5.32021 7.15866 5.56743 6.76074 5.96028C6.36281 6.35312 6.10895 6.86864 6.04016 7.42356C5.68449 10.4645 5.68449 13.5366 6.04016 16.5776C6.10916 17.1323 6.36312 17.6476 6.76102 18.0402C7.15892 18.4329 7.67755 18.6799 8.23316 18.7416C11.2102 19.0736 14.2902 19.0736 17.2672 18.7416C17.8226 18.6797 18.341 18.4326 18.7387 18.0399C19.1364 17.6473 19.3902 17.1321 19.4592 16.5776C19.8148 13.5366 19.8148 10.4645 19.4592 7.42356C19.39 6.86915 19.1361 6.35421 18.7384 5.96178C18.3407 5.56936 17.8224 5.32234 17.2672 5.26056"
                  fill="#FEC400"
                  fill-opacity="0.9"
                />
              </svg>
              <span>{t('shareQRCode')}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="card-container w-full lg:w-[55%] rounded-3xl p-6 space-y-3">
        <button onClick={handleAddToHomeScreen} className="flex items-center justify-between w-full px-2 py-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 5.75C3 5.02065 3.28973 4.32118 3.80546 3.80546C4.32118 3.28973 5.02065 3 5.75 3H18.25C18.9793 3 19.6788 3.28973 20.1945 3.80546C20.7103 4.32118 21 5.02065 21 5.75V12.022C20.5323 11.7226 20.0282 11.4843 19.5 11.313V5.75C19.5 5.06 18.94 4.5 18.25 4.5H5.75C5.06 4.5 4.5 5.06 4.5 5.75V18.25C4.5 18.94 5.06 19.5 5.75 19.5H11.313C11.486 20.034 11.725 20.537 12.022 21H5.75C5.02065 21 4.32118 20.7103 3.80546 20.1945C3.28973 19.6788 3 18.9793 3 18.25V5.75ZM23 17.5C23 16.0413 22.4205 14.6424 21.3891 13.6109C20.3576 12.5795 18.9587 12 17.5 12C16.0413 12 14.6424 12.5795 13.6109 13.6109C12.5795 14.6424 12 16.0413 12 17.5C12 18.9587 12.5795 20.3576 13.6109 21.3891C14.6424 22.4205 16.0413 23 17.5 23C18.9587 23 20.3576 22.4205 21.3891 21.3891C22.4205 20.3576 23 18.9587 23 17.5ZM18 18L18.001 20.503C18.001 20.6356 17.9483 20.7628 17.8546 20.8566C17.7608 20.9503 17.6336 21.003 17.501 21.003C17.3684 21.003 17.2412 20.9503 17.1474 20.8566C17.0537 20.7628 17.001 20.6356 17.001 20.503V18H14.496C14.3634 18 14.2362 17.9473 14.1424 17.8536C14.0487 17.7598 13.996 17.6326 13.996 17.5C13.996 17.3674 14.0487 17.2402 14.1424 17.1464C14.2362 17.0527 14.3634 17 14.496 17H17V14.5C17 14.3674 17.0527 14.2402 17.1464 14.1464C17.2402 14.0527 17.3674 14 17.5 14C17.6326 14 17.7598 14.0527 17.8536 14.1464C17.9473 14.2402 18 14.3674 18 14.5V17H20.497C20.6296 17 20.7568 17.0527 20.8506 17.1464C20.9443 17.2402 20.997 17.3674 20.997 17.5C20.997 17.6326 20.9443 17.7598 20.8506 17.8536C20.7568 17.9473 20.6296 18 20.497 18H18Z"
                fill="white"
              />
            </svg>
            {t('addHomeScreen')}
          </div>
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
            className={isRTL ? 'rotate-180' : ''}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
        <div className="flex items-center justify-between w-full text-white px-2 py-2">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g clip-path="url(#clip0_1972_9952)">
                <path
                  d="M11.9997 16.2803C11.4723 16.2803 10.9567 16.4367 10.5182 16.7297C10.0796 17.0227 9.73783 17.4392 9.536 17.9265C9.33416 18.4137 9.28135 18.9499 9.38425 19.4672C9.48714 19.9845 9.74112 20.4596 10.1141 20.8326C10.487 21.2055 10.9622 21.4595 11.4794 21.5624C11.9967 21.6653 12.5329 21.6125 13.0202 21.4106C13.5074 21.2088 13.9239 20.867 14.2169 20.4285C14.5099 19.9899 14.6663 19.4744 14.6663 18.9469C14.6663 18.2397 14.3854 17.5614 13.8853 17.0613C13.3852 16.5612 12.7069 16.2803 11.9997 16.2803ZM11.9997 20.2803C11.736 20.2803 11.4782 20.2021 11.2589 20.0556C11.0396 19.9091 10.8688 19.7008 10.7678 19.4572C10.6669 19.2136 10.6405 18.9455 10.692 18.6868C10.7434 18.4282 10.8704 18.1906 11.0569 18.0041C11.2433 17.8177 11.4809 17.6907 11.7396 17.6392C11.9982 17.5878 12.2663 17.6142 12.5099 17.7151C12.7536 17.816 12.9618 17.9869 13.1083 18.2062C13.2548 18.4254 13.333 18.6832 13.333 18.9469C13.333 19.3006 13.1925 19.6397 12.9425 19.8897C12.6924 20.1398 12.3533 20.2803 11.9997 20.2803Z"
                  fill="white"
                />
                <path
                  d="M17.473 14.5665C17.5245 14.4952 17.5614 14.4145 17.5815 14.3289C17.6017 14.2434 17.6048 14.1547 17.5905 14.0679C17.5763 13.9812 17.545 13.8981 17.4985 13.8235C17.452 13.7489 17.3912 13.6842 17.3197 13.6332C16.3208 12.9168 15.1867 12.411 13.9863 12.1465L16.5663 14.7265C16.709 14.8215 16.8829 14.8579 17.0517 14.8281C17.2206 14.7983 17.3714 14.7046 17.473 14.5665Z"
                  fill="white"
                />
                <path
                  d="M12.0331 7.14648C11.1014 7.14952 10.1724 7.24555 9.25977 7.43315L10.4198 8.59315C10.9546 8.52104 11.4935 8.48319 12.0331 8.47982C14.553 8.48083 17.0138 9.243 19.0931 10.6665C19.2389 10.75 19.4109 10.7754 19.5746 10.7376C19.7383 10.6998 19.8817 10.6015 19.9761 10.4624C20.0705 10.3234 20.1089 10.1539 20.0836 9.98774C20.0583 9.82161 19.9712 9.67115 19.8398 9.56648C17.5407 7.99195 14.8197 7.14846 12.0331 7.14648Z"
                  fill="white"
                />
                <path
                  d="M22.3662 5.46625C19.891 3.83068 17.0628 2.80618 14.1143 2.47702C11.1658 2.14787 8.18125 2.52347 5.40625 3.57292L6.45958 4.61958C8.97011 3.76355 11.6436 3.49509 14.2742 3.8349C16.9048 4.1747 19.4223 5.1137 21.6329 6.57958C21.7806 6.67335 21.9591 6.70535 22.1301 6.66868C22.3011 6.63201 22.4509 6.52961 22.5471 6.38355C22.6433 6.23749 22.6783 6.05948 22.6444 5.88788C22.6106 5.71629 22.5107 5.56486 22.3662 5.46625Z"
                  fill="white"
                />
                <path
                  d="M1.22656 3.16643L2.84656 4.78643C2.43323 5.0131 2.02656 5.2531 1.62656 5.51977C1.5539 5.56879 1.4916 5.63165 1.44323 5.70475C1.39486 5.77786 1.36136 5.85977 1.34464 5.94582C1.31089 6.1196 1.34755 6.29968 1.44656 6.44643C1.54558 6.59318 1.69883 6.69459 1.87262 6.72835C2.0464 6.76211 2.22648 6.72545 2.37323 6.62643C2.8399 6.3131 3.33323 5.99976 3.82656 5.76643L6.40656 8.34643C5.61781 8.69262 4.86337 9.11224 4.15323 9.59976C4.04835 9.71177 3.98532 9.85652 3.97477 10.0096C3.96422 10.1627 4.00679 10.3147 4.09531 10.44C4.18382 10.5654 4.31286 10.6563 4.46065 10.6976C4.60844 10.7388 4.76594 10.7278 4.90656 10.6664C5.69102 10.128 6.53422 9.6807 7.4199 9.3331L10.1932 12.1064C8.91604 12.3755 7.71267 12.9192 6.66656 13.6998C6.53625 13.8084 6.45224 13.9625 6.43164 14.1309C6.41103 14.2993 6.45538 14.4692 6.55566 14.606C6.65593 14.7428 6.80459 14.8363 6.97135 14.8673C7.13811 14.8984 7.31044 14.8647 7.45323 14.7731C8.5901 13.9465 9.93234 13.4483 11.3332 13.3331L18.5332 20.5331L19.4732 19.5931L2.1399 2.25977L1.22656 3.16643Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_1972_9952">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {t('offlineSharing')}
          </div>
          {
            hasProAccess ? (
              <label className="relative inline-flex items-center cursor-pointer ml-3">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={offLine}
                  onChange={e => handleOfflineToggle(e.target.checked)}
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
            )
          }
        </div>
      </div>
    </div>
  );
}
