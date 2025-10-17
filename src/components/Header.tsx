/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from 'utils';
import { useAuth } from 'context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { CartIcon } from './CartIcon';
import { SiteData } from 'services/api.service';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';

interface HeaderProps {
  siteData: SiteData;
}

const OfferBanner = ({ title }: { title: string | null }) => {
  return (
    <Link href="/products">
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-yellow-700 via-grey-200 to-gray-700 text-white text-center p-2 z-50">
        <div className="font-bold text-body whitespace-nowrap animate-marquee"> {title} </div>
      </div>
    </Link>
  );
};

const Header = ({ siteData }: HeaderProps) => {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('common');
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);



  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  };

  const handleLogout = async () => {
    logout();
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <OfferBanner title={siteData.siteNews} />
      <header
        className={`fixed top-8 left-0 right-0 p-2 text-white z-50 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        style={{
          background: 'linear-gradient(239deg, rgba(12, 13, 13, 0.90) 29.09%, rgba(41, 47, 54, 0.90) 109.67%)',
          backdropFilter: 'blur(8px)',
        }}
        dir="ltr"
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="transition-transform hover:scale-105">
              <Image
                src={siteData.siteLogo}
                alt={siteData.siteName}
                height={45}
                width={45}
                className="w-auto brightness-0 invert"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className={cn(
              `animate-scaleIn hidden lg:flex justify-between gap-8 px-[50px] py-[15px] mt-8 z-10 rounded-b-xl bg-gradient-to-r from-[#F1911B] via-[rgba(254,196,0,0.90)] to-[#F1911B] text-black`,
              { 'flex-row-reverse': locale === 'ar' }
            )}
          >
            <Link
              href="/"
              className={`relative px-3 py-1 rounded-md transition-all duration-300 ${pathname === '/' ? 'text-white font-bold bg-white/20' : 'text-black hover:text-white group'
                }`}
            >
              <span className="relative z-10">{t('nav.home')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
            </Link>
            <Link
              href="/products"
              className={`relative px-3 py-1 rounded-md transition-all duration-300 ${pathname.includes('/products')
                ? 'text-white font-bold bg-white/20'
                : 'text-black hover:text-white group'
                }`}
            >
              <span className="relative z-10">{t('nav.products')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
            </Link>
            <Link
              href="/blogs"
              className={`relative px-3 py-1 rounded-md transition-all duration-300 ${pathname.includes('/blogs') ? 'text-white font-bold bg-white/20' : 'text-black hover:text-white group'
                }`}
            >
              <span className="relative z-10">{t('nav.blogs')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
            </Link>
            <Link
              href="/contact"
              className={`relative px-3 py-1 rounded-md transition-all duration-300 ${pathname.includes('/contact') ? 'text-white font-bold bg-white/20' : 'text-black hover:text-white group'
                }`}
            >
              <span className="relative z-10">{t('nav.contact')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
            </Link>
            {/* <a
              href="/#how-it-works"
              onClick={scrollToHowItWorks}
              className="relative px-3 py-1 rounded-md transition-all duration-300 text-black hover:text-white group"
            >
              <span className="relative z-10">{t('nav.howItUse')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
            </a> */}
          </nav>

          {/* Icons Section */}
          <div className="flex items-center space-x-4">
            <Link href={isAuthenticated ? '/profile' : '/login'} className="hover:text-gray-300 p-2 rounded-full">
              <span className="sr-only">Login</span>
              <svg width="24" height="24" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="vuesax/outline/person">
                  <g id="person">
                    <path
                      id="Vector"
                      d="M16 16.5C19.3137 16.5 22 13.8137 22 10.5C22 7.18629 19.3137 4.5 16 4.5C12.6863 4.5 10 7.18629 10 10.5C10 13.8137 12.6863 16.5 16 16.5Z"
                      stroke="white"
                      strokeWidth="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      id="Vector_2"
                      d="M26 28.5C26 23.5294 21.5228 19.5 16 19.5C10.4772 19.5 6 23.5294 6 28.5"
                      stroke="white"
                      strokeWidth="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </g>
              </svg>
            </Link>
            <ThemeSwitcher />
            <CartIcon />
            <LanguageSwitcher />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden hover:text-gray-300 p-2 rounded-full"
            >
              <span className="sr-only">Menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 card-container z-40 transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="lg:hidden fixed inset-0 z-50">
              <div className="min-h-screen flex items-start pt-[10%] justify-center">
                <div
                  ref={menuRef}
                  className={cn(
                    'relative w-[95%] p-4 h-[650px] bg-[#292929] rounded-3xl overflow-hidden transition-transform ease-out duration-500 shadow-xl',
                    {
                      'animate-slideDown': isMobileMenuOpen,
                      'bg-white': theme === 'light',
                    }
                  )}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-2 left-1/2 -translate-x-1/2 p-2.5 rounded-full bg-white hover:bg-gray-100 transition-colors duration-200 shadow-lg z-[60]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-800"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <nav className="h-full mt-[35px] p-4 flex flex-col space-y-4">
                    <Link
                      href="/"
                      className={`relative flex gap-4 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname === '/'
                        ? 'bg-yellow-500 text-black dark:text-white font-bold'
                        : 'dark:text-gray-200 text-gray-500 group'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                          d="M12 28L15.8664 27.7999C14.9402 26.4106 14.4771 25.716 13.8653 25.2131C13.3236 24.7679 12.6995 24.4339 12.0286 24.2301C11.2708 24 10.436 24 8.76627 24H6.93317C5.4397 24 4.69296 24 4.12253 23.7094C3.62076 23.4537 3.21282 23.0457 2.95715 22.544C2.6665 21.9735 2.6665 21.2268 2.6665 19.7333V8.26667C2.6665 6.77319 2.6665 6.02646 2.95715 5.45603C3.21282 4.95426 3.62076 4.54631 4.12253 4.29065C4.69296 4 5.4397 4 6.93317 4H7.4665C10.4535 4 11.9469 4 13.0878 4.5813C14.0913 5.09262 14.9072 5.90852 15.4185 6.91205C15.9998 8.05291 15.9998 9.54639 15.9998 12.5333M15.9998 28V12.5333M15.9998 28L16.1332 27.7999C17.0594 26.4106 17.5225 25.716 18.1344 25.2131C18.676 24.7679 19.3002 24.4339 19.971 24.2301C20.7288 24 21.5637 24 23.2334 24H25.0665C26.56 24 27.3067 24 27.8771 23.7094C28.3789 23.4537 28.7869 23.0457 29.0425 22.544C29.3332 21.9735 29.3332 21.2268 29.3332 19.7333V8.26667C29.3332 6.77319 29.3332 6.02646 29.0425 5.45603C28.7869 4.95426 28.3789 4.54631 27.8771 4.29065C27.3067 4 26.56 4 25.0665 4H24.5332C21.5462 4 20.0528 4 18.9119 4.5813C17.9084 5.09262 17.0925 5.90852 16.5811 6.91205C15.9998 8.05291 15.9998 9.54639 15.9998 12.5333"
                          stroke={theme === 'dark' ? 'white' : '#6b7280'}
                          strokeWidth="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="relative z-10 text-[18px]">{t('nav.home')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                    </Link>
                    <Link
                      href="/products"
                      className={`relative flex gap-4 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname.includes('/products')
                        ? 'bg-yellow-500 text-black dark:text-white font-bold'
                        : 'dark:text-gray-200 text-gray-500 group'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                          d="M18.7327 8.00033C20.035 8.25441 21.2319 8.89134 22.1701 9.82957C23.1084 10.7678 23.7453 11.9647 23.9994 13.267M18.7327 2.66699C21.4384 2.96757 23.9615 4.17923 25.8877 6.103C27.8139 8.02678 29.0287 10.5483 29.3327 13.2537M13.6354 18.4844C12.0333 16.8823 10.7682 15.0708 9.84021 13.138C9.76038 12.9717 9.72047 12.8886 9.68981 12.7834C9.58085 12.4096 9.65911 11.9506 9.8858 11.634C9.94958 11.5449 10.0258 11.4687 10.1782 11.3163C10.6443 10.8502 10.8774 10.6171 11.0298 10.3827C11.6045 9.49886 11.6045 8.35942 11.0298 7.47557C10.8774 7.2412 10.6444 7.00813 10.1782 6.54198L9.91838 6.28216C9.20979 5.57357 8.8555 5.21927 8.47499 5.02681C7.71824 4.64405 6.82455 4.64405 6.06781 5.02682C5.6873 5.21927 5.333 5.57357 4.62441 6.28216L4.41423 6.49234C3.70807 7.1985 3.35499 7.55158 3.08532 8.03163C2.7861 8.5643 2.57095 9.39162 2.57277 10.0026C2.5744 10.5532 2.68121 10.9295 2.89482 11.6821C4.04278 15.7266 6.20874 19.5431 9.39272 22.7271C12.5767 25.911 16.3932 28.077 20.4377 29.225C21.1903 29.4386 21.5666 29.5454 22.1172 29.547C22.7282 29.5488 23.5555 29.3337 24.0881 29.0345C24.5682 28.7648 24.9213 28.4117 25.6274 27.7055L25.8376 27.4954C26.5462 26.7868 26.9005 26.4325 27.093 26.052C27.4757 25.2952 27.4757 24.4015 27.093 23.6448C26.9005 23.2643 26.5462 22.91 25.8376 22.2014L25.5778 21.9416C25.1117 21.4754 24.8786 21.2424 24.6442 21.09C23.7604 20.5153 22.6209 20.5153 21.7371 21.09C21.5027 21.2424 21.2696 21.4754 20.8035 21.9416C20.6511 22.094 20.5749 22.1702 20.4858 22.234C20.1692 22.4607 19.7102 22.5389 19.3364 22.43C19.2312 22.3993 19.1481 22.3594 18.9818 22.2796C17.049 21.3516 15.2375 20.0865 13.6354 18.4844Z"
                          stroke={theme === 'dark' ? 'white' : '#6b7280'}
                          strokeWidth="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="relative z-10 text-[18px]">{t('nav.products')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                    </Link>
                    <Link
                      href="/blogs"
                      className={`relative flex gap-4 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname.includes('/blogs')
                        ? 'bg-yellow-500 text-black dark:text-white font-bold'
                        : 'dark:text-gray-200 text-gray-500 group'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                          d="M15.9998 28L15.8664 27.7999C14.9402 26.4106 14.4771 25.716 13.8653 25.2131C13.3236 24.7679 12.6995 24.4339 12.0286 24.2301C11.2708 24 10.436 24 8.76627 24H6.93317C5.4397 24 4.69296 24 4.12253 23.7094C3.62076 23.4537 3.21282 23.0457 2.95715 22.544C2.6665 21.9735 2.6665 21.2268 2.6665 19.7333V8.26667C2.6665 6.77319 2.6665 6.02646 2.95715 5.45603C3.21282 4.95426 3.62076 4.54631 4.12253 4.29065C4.69296 4 5.4397 4 6.93317 4H7.4665C10.4535 4 11.9469 4 13.0878 4.5813C14.0913 5.09262 14.9072 5.90852 15.4185 6.91205C15.9998 8.05291 15.9998 9.54639 15.9998 12.5333M15.9998 28V12.5333M15.9998 28L16.1332 27.7999C17.0594 26.4106 17.5225 25.716 18.1344 25.2131C18.676 24.7679 19.3002 24.4339 19.971 24.2301C20.7288 24 21.5637 24 23.2334 24H25.0665C26.56 24 27.3067 24 27.8771 23.7094C28.3789 23.4537 28.7869 23.0457 29.0425 22.544C29.3332 21.9735 29.3332 21.2268 29.3332 19.7333V8.26667C29.3332 6.77319 29.3332 6.02646 29.0425 5.45603C28.7869 4.95426 28.3789 4.54631 27.8771 4.29065C27.3067 4 26.56 4 25.0665 4H24.5332C21.5462 4 20.0528 4 18.9119 4.5813C17.9084 5.09262 17.0925 5.90852 16.5811 6.91205C15.9998 8.05291 15.9998 9.54639 15.9998 12.5333"
                          stroke={theme === 'dark' ? 'white' : '#6b7280'}
                          strokeWidth="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="relative z-10 text-[18px]">{t('nav.blogs')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                    </Link>
                    <Link
                      href="/contact"
                      className={`relative flex gap-4 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname.includes('/contact')
                        ? 'bg-yellow-500 text-black dark:text-white font-bold'
                        : 'dark:text-gray-200 text-gray-500 group'
                        }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                          d="M18.7327 8.00033C20.035 8.25441 21.2319 8.89134 22.1701 9.82957C23.1084 10.7678 23.7453 11.9647 23.9994 13.267M18.7327 2.66699C21.4384 2.96757 23.9615 4.17923 25.8877 6.103C27.8139 8.02678 29.0287 10.5483 29.3327 13.2537M13.6354 18.4844C12.0333 16.8823 10.7682 15.0708 9.84021 13.138C9.76038 12.9717 9.72047 12.8886 9.68981 12.7834C9.58085 12.4096 9.65911 11.9506 9.8858 11.634C9.94958 11.5449 10.0258 11.4687 10.1782 11.3163C10.6443 10.8502 10.8774 10.6171 11.0298 10.3827C11.6045 9.49886 11.6045 8.35942 11.0298 7.47557C10.8774 7.2412 10.6444 7.00813 10.1782 6.54198L9.91838 6.28216C9.20979 5.57357 8.8555 5.21927 8.47499 5.02681C7.71824 4.64405 6.82455 4.64405 6.06781 5.02682C5.6873 5.21927 5.333 5.57357 4.62441 6.28216L4.41423 6.49234C3.70807 7.1985 3.35499 7.55158 3.08532 8.03163C2.7861 8.5643 2.57095 9.39162 2.57277 10.0026C2.5744 10.5532 2.68121 10.9295 2.89482 11.6821C4.04278 15.7266 6.20874 19.5431 9.39272 22.7271C12.5767 25.911 16.3932 28.077 20.4377 29.225C21.1903 29.4386 21.5666 29.5454 22.1172 29.547C22.7282 29.5488 23.5555 29.3337 24.0881 29.0345C24.5682 28.7648 24.9213 28.4117 25.6274 27.7055L25.8376 27.4954C26.5462 26.7868 26.9005 26.4325 27.093 26.052C27.4757 25.2952 27.4757 24.4015 27.093 23.6448C26.9005 23.2643 26.5462 22.91 25.8376 22.2014L25.5778 21.9416C25.1117 21.4754 24.8786 21.2424 24.6442 21.09C23.7604 20.5153 22.6209 20.5153 21.7371 21.09C21.5027 21.2424 21.2696 21.4754 20.8035 21.9416C20.6511 22.094 20.5749 22.1702 20.4858 22.234C20.1692 22.4607 19.7102 22.5389 19.3364 22.43C19.2312 22.3993 19.1481 22.3594 18.9818 22.2796C17.049 21.3516 15.2375 20.0865 13.6354 18.4844Z"
                          stroke={theme === 'dark' ? 'white' : '#6b7280'}
                          strokeWidth="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="relative z-10 text-[18px]">{t('nav.contact')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                    </Link>
                    {/* <a
                      href="/#how-it-works"
                      className="relative flex gap-4 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden dark:text-gray-200 text-gray-500 group"
                      onClick={scrollToHowItWorks}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path
                          opacity="0.4"
                          d="M2.6665 16L15.5228 22.4282C15.6977 22.5156 15.7852 22.5593 15.8769 22.5765C15.9582 22.5918 16.0415 22.5918 16.1228 22.5765C16.2145 22.5593 16.302 22.5156 16.4769 22.4282L29.3332 16M2.6665 22.6667L15.5228 29.0948C15.6977 29.1823 15.7852 29.226 15.8769 29.2432C15.9582 29.2585 16.0415 29.2585 16.1228 29.2432C16.2145 29.226 16.302 29.1823 16.4769 29.0948L29.3332 22.6667"
                          stroke="#F2CD5C"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M16.4769 2.90494C16.302 2.81749 16.2145 2.77376 16.1228 2.75655C16.0415 2.74131 15.9582 2.74131 15.8769 2.75655C15.7852 2.77376 15.6977 2.81749 15.5228 2.90494L2.6665 9.33309L15.5228 15.7612C15.6977 15.8487 15.7852 15.8924 15.8769 15.9096C15.9582 15.9249 16.0415 15.9249 16.1228 15.9096C16.2145 15.8924 16.302 15.8487 16.4769 15.7612L29.3332 9.33309L16.4769 2.90494Z"
                          stroke={theme === 'dark' ? 'white' : '#6b7280'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <span className="relative z-10 text-[18px]">{t('nav.howItUse')}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                    </a> */}

                    <Link
                      href="/profile"
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg border dark:border-white/20 border-gray-400 dark:text-gray-200 text-gray-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke={theme === 'dark' ? 'white' : '#6b7280'}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-[18px]">{t('nav.profile')}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={theme === 'dark' ? 'white' : '#6b7280'}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <Link
                      href="/profile/edit"
                      className="w-full flex items-center justify-between px-4 py-3 rounded-lg border dark:border-white/20 border-gray-400 dark:text-gray-200 text-gray-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke={theme === 'dark' ? 'white' : '#6b7280'}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-[18px]">{t('nav.editProfile')}</span>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke={theme === 'dark' ? 'white' : '#6b7280'}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>

                    <div className="flex flex-col items-center justify-center w-full gap-4">
                      <div className="grid grid-cols-2 w-full gap-3">
                        <button
                          onClick={() => {
                            switchLocale(locale === 'en' ? 'ar' : 'en');
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border dark:border-white/20 border-gray-400 dark:text-gray-200 text-gray-500"
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <g id="language">
                                <path
                                  id="icon"
                                  d="M2.6665 16L15.5228 22.4282C15.6977 22.5156 15.7852 22.5593 15.8769 22.5765C15.9582 22.5918 16.0415 22.5918 16.1228 22.5765C16.2145 22.5593 16.302 22.5156 16.4769 22.4282L29.3332 16M2.6665 22.6667L15.5228 29.0948C15.6977 29.1823 15.7852 29.226 15.8769 29.2432C15.9582 29.2585 16.0415 29.2585 16.1228 29.2432C16.2145 29.226 16.302 29.1823 16.4769 29.0948L29.3332 22.6667"
                                  stroke="#F2CD5C"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M16.4769 2.90494C16.302 2.81749 16.2145 2.77376 16.1228 2.75655C16.0415 2.74131 15.9582 2.74131 15.8769 2.75655C15.7852 2.77376 15.6977 2.81749 15.5228 2.90494L2.6665 9.33309L15.5228 15.7612C15.6977 15.8487 15.7852 15.8924 15.8769 15.9096C15.9582 15.9249 16.0415 15.9249 16.1228 15.9096C16.2145 15.8924 16.302 15.8487 16.4769 15.7612L29.3332 9.33309L16.4769 2.90494Z"
                                  stroke={theme === 'dark' ? 'white' : '#6b7280'}
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                            </svg>
                            <span className="text-[18px]">{locale === 'en' ? 'العربية' : 'English'}</span>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            toggleTheme();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 rounded-lg border dark:border-white/20 border-gray-400 dark:text-gray-200 text-gray-500"
                        >
                          <div className="flex items-center gap-3">
                            {theme === 'light' ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="gray"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                />
                              </svg>
                            )}
                            <span className="text-[18px]">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                          </div>
                        </button>
                      </div>
                      <div className="w-full">
                        {isAuthenticated ? (
                          <button
                            onClick={() => {
                              handleLogout();
                              setMobileMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border dark:border-white/20 border-gray-400 dark:text-gray-200 text-gray-500"
                          >
                            <div className="flex items-center gap-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke={theme === 'dark' ? 'white' : '#6b7280'}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              <span className="text-[18px]">{t('nav.logout')}</span>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke={theme === 'dark' ? 'white' : '#6b7280'}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ) : (
                          <Link
                            href="/login"
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border dark:border-white/20 border-gray-400 dark:text-gray-200 text-gray-500"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            <div className="flex items-center gap-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke={theme === 'dark' ? 'white' : '#6b7280'}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              <span className="text-[18px]">{t('nav.login')}</span>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke={theme === 'dark' ? 'white' : '#6b7280'}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
};

export default Header;
