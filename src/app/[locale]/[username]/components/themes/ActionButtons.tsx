'use client';

import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import { useTranslations } from 'next-intl';
import { useUpdateUserVisitsMutation } from 'hooks/profile';

interface ActionButtonsProps {
  profileData: ProfileForReadDTO;
  handleSaveContact: () => void;
}

const ActionButtons = ({ profileData, handleSaveContact }: ActionButtonsProps) => {
  const t = useTranslations('profile');
  const { onUpdateUserVisits } = useUpdateUserVisitsMutation();
  return (
    <>
      {/* Action Buttons */}
      <div className="flex justify-center gap-4 py-4 pb-8">
        {/* Phone Icon */}
        {profileData?.showPhone && profileData?.phoneNumber1.length > 0 && (
          <button
            onClick={() => {
              if (profileData?.phoneNumber1) {
                onUpdateUserVisits({ userpk: profileData.userPk, action: 4 });
                window.location.href = `tel:${profileData.phoneNumber1}`;
              }
            }}
            className="p-4 rounded-full hover:bg-gray-200 transition-colors"
            style={{
              backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
            }}
            aria-label="Call"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke='currentColor'
              style={{ color: 'black' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
        )}

        {/* Email Icon */}
        {profileData?.showEmail && profileData?.email.length > 0 && (
          <button
            onClick={() => {
              if (profileData?.email) {
                onUpdateUserVisits({ userpk: profileData.userPk, action: 3 });
                window.location.href = `mailto:${profileData.email}`;
              }
            }}
            className="p-4 rounded-full hover:bg-gray-200 transition-colors"
            style={{
              backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
            }}
            aria-label="Email"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke='currentColor'
              style={{ color: 'black' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
        )}

        {/* Website Icon */}
        {profileData?.showWebsite && profileData?.websiteUrl.length > 0 && (
          <button
            onClick={() => {
              if (profileData?.websiteUrl) {
                onUpdateUserVisits({ userpk: profileData.userPk, action: 5 });
                window.open(profileData.websiteUrl.startsWith('http') ? profileData.websiteUrl : `https://${profileData.websiteUrl}`, '_blank');
              }
            }}
            className="p-4 rounded-full hover:bg-gray-200 transition-colors"
            style={{
              backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
            }}
            aria-label="Website"
          >
            <svg xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-black"
              fill="none"
              viewBox="0 0 24 24"
              stroke='currentColor'
              style={{ color: 'black' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </button>
        )}
      </div>

      {/* Save Contact Button */}
      {profileData?.saveContact && (
        <div className="px-6 pb-6 relative z-10">
          <button
            onClick={() => {
              if (profileData?.saveContact) {
                onUpdateUserVisits({ userpk: profileData.userPk, action: 2 });
                handleSaveContact();
              }
            }}
            style={{
              backgroundColor: profileData?.iconColor?.length > 0 ? profileData.iconColor : 'var(--main-color1)'
            }}
            className="w-full text-black py-4 px-6 rounded-lg text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105"
          >
            {t('saveContact')}
          </button>
        </div>
      )}
    </>
  );
};

export default ActionButtons;
