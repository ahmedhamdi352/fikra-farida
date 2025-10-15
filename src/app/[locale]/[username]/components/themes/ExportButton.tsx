'use client';

import { ProfileForReadDTO } from 'types/api/ProfileForReadDTO';
import { useTranslations } from 'next-intl';
interface ExportButtonProps {
  profileData: ProfileForReadDTO;
  className?: string;
}

const ExportButton = ({ profileData, className = "absolute top-10 right-2" }: ExportButtonProps) => {
  const t = useTranslations('profile');
  const handleExport = () => {
    const profileUrl = `https://www.fikrafarida.com/${profileData?.username}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      alert('Profile link copied to clipboard!');
    });
    navigator.share?.({ url: profileUrl });
  };

  return (
    <button
      onClick={handleExport}
      className={`${className} flex gap-1 bg-[#F4DD94] hover:bg-yellow-500 text-white py-2 px-6 rounded-lg text-center font-semibold text-lg transition duration-300 shadow-xl transform hover:scale-105`}
    >
      <p className='text-black text-[12px] font-semibold'>
        {t('export')}
      </p>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path fillRule="evenodd" clipRule="evenodd" d="M21.75 4.5C21.75 3.90326 21.5129 3.33097 21.091 2.90901C20.669 2.48705 20.0967 2.25 19.5 2.25H4.5C3.90326 2.25 3.33097 2.48705 2.90901 2.90901C2.48705 3.33097 2.25 3.90326 2.25 4.5V12C2.25 12.1989 2.32902 12.3897 2.46967 12.5303C2.61032 12.671 2.80109 12.75 3 12.75C3.19891 12.75 3.38968 12.671 3.53033 12.5303C3.67098 12.3897 3.75 12.1989 3.75 12V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H19.5C19.6989 3.75 19.8897 3.82902 20.0303 3.96967C20.171 4.11032 20.25 4.30109 20.25 4.5V19.5C20.25 19.6989 20.171 19.8897 20.0303 20.0303C19.8897 20.171 19.6989 20.25 19.5 20.25H13.5C13.3011 20.25 13.1103 20.329 12.9697 20.4697C12.829 20.6103 12.75 20.8011 12.75 21C12.75 21.1989 12.829 21.3897 12.9697 21.5303C13.1103 21.671 13.3011 21.75 13.5 21.75H19.5C20.0967 21.75 20.669 21.5129 21.091 21.091C21.5129 20.669 21.75 20.0967 21.75 19.5V4.5Z" fill="black" />
        <path fillRule="evenodd" clipRule="evenodd" d="M6.75 9C6.75 8.80109 6.82902 8.61032 6.96967 8.46967C7.11032 8.32902 7.30109 8.25 7.5 8.25H15C15.1989 8.25 15.3897 8.32902 15.5303 8.46967C15.671 8.61032 15.75 8.80109 15.75 9V16.5C15.75 16.6989 15.671 16.8897 15.5303 17.0303C15.3897 17.171 15.1989 17.25 15 17.25C14.8011 17.25 14.6103 17.171 14.4697 17.0303C14.329 16.8897 14.25 16.6989 14.25 16.5V9.75H7.5C7.30109 9.75 7.11032 9.67098 6.96967 9.53033C6.82902 9.38968 6.75 9.19891 6.75 9Z" fill="black" />
        <path fillRule="evenodd" clipRule="evenodd" d="M15.531 8.46936C15.6008 8.53903 15.6562 8.6218 15.694 8.71291C15.7318 8.80403 15.7513 8.90171 15.7513 9.00036C15.7513 9.09901 15.7318 9.1967 15.694 9.28781C15.6562 9.37893 15.6008 9.4617 15.531 9.53136L3.53097 21.5314C3.39014 21.6722 3.19913 21.7513 2.99997 21.7513C2.80081 21.7513 2.6098 21.6722 2.46897 21.5314C2.32814 21.3905 2.24902 21.1995 2.24902 21.0004C2.24902 20.8012 2.32814 20.6102 2.46897 20.4694L14.469 8.46936C14.5386 8.39952 14.6214 8.3441 14.7125 8.30629C14.8036 8.26849 14.9013 8.24902 15 8.24902C15.0986 8.24902 15.1963 8.26849 15.2874 8.30629C15.3785 8.3441 15.4613 8.39952 15.531 8.46936Z" fill="black" />
      </svg>
    </button>
  );
};

export default ExportButton;
