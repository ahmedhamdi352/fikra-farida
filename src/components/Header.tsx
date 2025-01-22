/* eslint-disable @next/next/no-html-link-for-pages */
"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import CartIcon from './CartIcon';
import { SiteData } from 'services/api.service';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl';

interface HeaderProps {
  siteData: SiteData;
}

const Header = ({ siteData }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter()
  const locale = useLocale();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // Show header in these conditions:
      // 1. Scrolling up
      // 2. At the top of the page
      // 3. Scrolled less than 100px
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

  const scrollToHowItWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const section = document.getElementById('how-it-works');
    if (pathname === '/') {
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      router.push('/#how-it-works');
    }
  };

  const switchLocale = (newLocale: string) => {
    // Since we're not using prefixes, just refresh the page with the new locale
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    router.refresh();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 p-2 text-white z-50 transition-all duration-300 ${isVisible
        ? 'translate-y-0 opacity-100'
        : '-translate-y-full opacity-0'
        }`}
      style={{
        background: 'linear-gradient(239deg, rgba(12, 13, 13, 0.90) 29.09%, rgba(41, 47, 54, 0.90) 109.67%)',
        backdropFilter: 'blur(8px)'
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
        <nav className="animate-scaleIn hidden lg:flex space-x-8 px-[50px] py-[20px] mt-8 z-10 rounded-b-xl bg-gradient-to-r from-[#F1911B] via-[rgba(254,196,0,0.90)] to-[#F1911B] text-black">
          <Link
            href="/"
            className={`relative px-3 py-1 rounded-md transition-all duration-300 ${pathname === '/'
              ? 'text-white font-bold bg-white/20'
              : 'text-black hover:text-white group'
              }`}
          >
            <span className="relative z-10">Home</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
          </Link>
          <Link
            href="/products"
            className={`relative px-3 py-1 rounded-md transition-all duration-300 ${pathname.includes('/products')
              ? 'text-white font-bold bg-white/20'
              : 'text-black hover:text-white group'
              }`}
          >
            <span className="relative z-10">Products</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
          </Link>
          <Link
            href="/blogs"
            className={`relative px-3 py-1 rounded-md transition-all duration-300 ${pathname.includes('/blogs')
              ? 'text-white font-bold bg-white/20'
              : 'text-black hover:text-white group'
              }`}
          >
            <span className="relative z-10">Blog</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
          </Link>
          <Link
            href="/contact"
            className={`relative px-3 py-1 rounded-md transition-all duration-300 ${pathname.includes('/contact')
              ? 'text-white font-bold bg-white/20'
              : 'text-black hover:text-white group'
              }`}
          >
            <span className="relative z-10">Contact Us</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
          </Link>
          <a
            href="/#how-it-works"
            onClick={scrollToHowItWorks}
            className="relative px-3 py-1 rounded-md transition-all duration-300 text-black hover:text-white group"
          >
            <span className="relative z-10">How it use</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 rounded-md transition-all duration-300 group-hover:scale-105"></div>
          </a>
        </nav>

        {/* Icons Section */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="hover:text-gray-300 p-2 rounded-full">
            <span className="sr-only">Login</span>
            <svg width="24" height="24" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="vuesax/outline/frame">
                <g id="frame">
                  <path id="Vector" d="M16.2124 15.9934C16.1724 15.9934 16.1458 15.9934 16.1058 15.9934C16.0391 15.9801 15.9458 15.9801 15.8658 15.9934C11.9991 15.8734 9.0791 12.8334 9.0791 9.08675C9.0791 5.27341 12.1858 2.16675 15.9991 2.16675C19.8124 2.16675 22.9191 5.27341 22.9191 9.08675C22.9058 12.8334 19.9724 15.8734 16.2524 15.9934C16.2391 15.9934 16.2258 15.9934 16.2124 15.9934ZM15.9991 4.16675C13.2924 4.16675 11.0791 6.38008 11.0791 9.08675C11.0791 11.7534 13.1591 13.9001 15.8124 13.9934C15.8791 13.9801 16.0658 13.9801 16.2391 13.9934C18.8524 13.8734 20.9058 11.7267 20.9191 9.08675C20.9191 6.38008 18.7058 4.16675 15.9991 4.16675Z" fill="white" />
                  <path id="Vector_2" d="M16.2261 30.5666C13.6128 30.5666 10.9861 29.8999 8.99948 28.5666C7.14615 27.3399 6.13281 25.6599 6.13281 23.8333C6.13281 22.0066 7.14615 20.3133 8.99948 19.0733C12.9995 16.4199 19.4795 16.4199 23.4528 19.0733C25.2928 20.2999 26.3195 21.9799 26.3195 23.8066C26.3195 25.6333 25.3061 27.3266 23.4528 28.5666C21.4528 29.8999 18.8395 30.5666 16.2261 30.5666ZM10.1061 20.7533C8.82615 21.6066 8.13281 22.6999 8.13281 23.8466C8.13281 24.9799 8.83948 26.0732 10.1061 26.9132C13.4261 29.1399 19.0261 29.1399 22.3461 26.9132C23.6261 26.0599 24.3195 24.9666 24.3195 23.8199C24.3195 22.6866 23.6128 21.5933 22.3461 20.7533C19.0261 18.5399 13.4261 18.5399 10.1061 20.7533Z" fill="white" />
                </g>
              </g>
            </svg>

          </Link>
          <ThemeSwitcher />
          <CartIcon count={3} />
          <LanguageSwitcher />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden hover:text-gray-300 p-2 rounded-full"
          >
            <span className="sr-only">Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className="fixed inset-0 bg-[#1a1a1a]/95 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="lg:hidden fixed inset-0 z-50">
            <div className="min-h-screen flex items-start pt-[20%] justify-center">
              <div
                ref={menuRef}
                className={`relative w-[95%] p-4 h-[550px] bg-[#292929] rounded-3xl overflow-hidden transition-transform ease-out duration-500 ${isMobileMenuOpen ? 'animate-slideDown' : ''
                  }`}
              >
                {/* Close Button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-2 left-1/2 -translate-x-1/2 p-2.5 rounded-full bg-white hover:bg-gray-100 transition-colors duration-200 shadow-lg z-[60]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <nav className="h-full mt-[35px] p-4 flex flex-col space-y-3">
                  <Link
                    href="/"
                    className={`relative flex gap-2 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname === '/'
                      ? 'bg-yellow-500 text-white font-bold'
                      : 'text-gray-200 group'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M12 28V18.1333C12 17.3866 12 17.0132 12.1453 16.728C12.2732 16.4771 12.4771 16.2731 12.728 16.1453C13.0132 16 13.3866 16 14.1333 16H17.8667C18.6134 16 18.9868 16 19.272 16.1453C19.5229 16.2731 19.7268 16.4771 19.8547 16.728C20 17.0132 20 17.3866 20 18.1333V28M14.6903 3.68533L5.64719 10.7188C5.04269 11.189 4.74045 11.4241 4.5227 11.7185C4.32982 11.9793 4.18614 12.273 4.0987 12.5854C4 12.938 4 13.3209 4 14.0867V23.7333C4 25.2268 4 25.9735 4.29065 26.544C4.54631 27.0457 4.95426 27.4537 5.45603 27.7093C6.02646 28 6.77319 28 8.26667 28H23.7333C25.2268 28 25.9735 28 26.544 27.7093C27.0457 27.4537 27.4537 27.0457 27.7094 26.544C28 25.9735 28 25.2268 28 23.7333V14.0867C28 13.3209 28 12.938 27.9013 12.5854C27.8139 12.273 27.6702 11.9793 27.4773 11.7185C27.2596 11.4241 26.9573 11.189 26.3528 10.7188L17.3097 3.68533C16.8413 3.32099 16.6071 3.13883 16.3485 3.0688C16.1203 3.00701 15.8797 3.00701 15.6515 3.0688C15.3929 3.13883 15.1587 3.32099 14.6903 3.68533Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span className="relative z-10 text-[20px]">Home</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </Link>
                  <Link
                    href="/products"
                    className={`relative flex gap-2 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname.includes('/products')
                      ? 'bg-yellow-500 text-white font-bold'
                      : 'text-gray-200 group'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M21.3337 12.0003V8.00033C21.3337 5.05481 18.9458 2.66699 16.0003 2.66699C13.0548 2.66699 10.667 5.05481 10.667 8.00033V12.0003M4.78967 13.8029L3.98967 22.3363C3.7622 24.7625 3.64847 25.9757 4.05106 26.9127C4.40473 27.7358 5.02449 28.4164 5.81102 28.8454C6.70636 29.3337 7.92482 29.3337 10.3617 29.3337H21.6389C24.0758 29.3337 25.2943 29.3337 26.1896 28.8454C26.9762 28.4164 27.5959 27.7358 27.9496 26.9127C28.3522 25.9757 28.2385 24.7625 28.011 22.3363L27.211 13.8029C27.0189 11.7541 26.9229 10.7297 26.4621 9.95521C26.0563 9.27311 25.4568 8.72714 24.7398 8.38679C23.9256 8.00033 22.8967 8.00033 20.8389 8.00033L11.1617 8.00033C9.10392 8.00033 8.07501 8.00033 7.26089 8.38678C6.54388 8.72714 5.94434 9.2731 5.53854 9.95521C5.07778 10.7297 4.98174 11.7541 4.78967 13.8029Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span className="relative z-10 text-[20px]">Products</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </Link>
                  <Link
                    href="/blogs"
                    className={`relative flex gap-2 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname.includes('/blogs')
                      ? 'bg-yellow-500 text-white font-bold'
                      : 'text-gray-200 group'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M15.9998 28L15.8664 27.7999C14.9402 26.4106 14.4771 25.716 13.8653 25.2131C13.3236 24.7679 12.6995 24.4339 12.0286 24.2301C11.2708 24 10.436 24 8.76627 24H6.93317C5.4397 24 4.69296 24 4.12253 23.7094C3.62076 23.4537 3.21282 23.0457 2.95715 22.544C2.6665 21.9735 2.6665 21.2268 2.6665 19.7333V8.26667C2.6665 6.77319 2.6665 6.02646 2.95715 5.45603C3.21282 4.95426 3.62076 4.54631 4.12253 4.29065C4.69296 4 5.4397 4 6.93317 4H7.4665C10.4535 4 11.9469 4 13.0878 4.5813C14.0913 5.09262 14.9072 5.90852 15.4185 6.91205C15.9998 8.05291 15.9998 9.54639 15.9998 12.5333M15.9998 28V12.5333M15.9998 28L16.1332 27.7999C17.0594 26.4106 17.5225 25.716 18.1344 25.2131C18.676 24.7679 19.3002 24.4339 19.971 24.2301C20.7288 24 21.5637 24 23.2334 24H25.0665C26.56 24 27.3067 24 27.8771 23.7094C28.3789 23.4537 28.7869 23.0457 29.0425 22.544C29.3332 21.9735 29.3332 21.2268 29.3332 19.7333V8.26667C29.3332 6.77319 29.3332 6.02646 29.0425 5.45603C28.7869 4.95426 28.3789 4.54631 27.8771 4.29065C27.3067 4 26.56 4 25.0665 4H24.5332C21.5462 4 20.0528 4 18.9119 4.5813C17.9084 5.09262 17.0925 5.90852 16.5811 6.91205C15.9998 8.05291 15.9998 9.54639 15.9998 12.5333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span className="relative z-10 text-[20px]">Blog</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </Link>
                  <Link
                    href="/contact"
                    className={`relative flex gap-2 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname.includes('/contact')
                      ? 'bg-yellow-500 text-white font-bold'
                      : 'text-gray-200 group'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M18.7327 8.00033C20.035 8.25441 21.2319 8.89134 22.1701 9.82957C23.1084 10.7678 23.7453 11.9647 23.9994 13.267M18.7327 2.66699C21.4384 2.96757 23.9615 4.17923 25.8877 6.103C27.8139 8.02678 29.0287 10.5483 29.3327 13.2537M13.6354 18.4844C12.0333 16.8823 10.7682 15.0708 9.84021 13.138C9.76038 12.9717 9.72047 12.8886 9.68981 12.7834C9.58085 12.4096 9.65911 11.9506 9.8858 11.634C9.94958 11.5449 10.0258 11.4687 10.1782 11.3163C10.6443 10.8502 10.8774 10.6171 11.0298 10.3827C11.6045 9.49886 11.6045 8.35942 11.0298 7.47557C10.8774 7.2412 10.6444 7.00813 10.1782 6.54198L9.91838 6.28216C9.20979 5.57357 8.8555 5.21927 8.47499 5.02681C7.71824 4.64405 6.82455 4.64405 6.06781 5.02682C5.6873 5.21927 5.333 5.57357 4.62441 6.28216L4.41423 6.49234C3.70807 7.1985 3.35499 7.55158 3.08532 8.03163C2.7861 8.5643 2.57095 9.39162 2.57277 10.0026C2.5744 10.5532 2.68121 10.9295 2.89482 11.6821C4.04278 15.7266 6.20874 19.5431 9.39272 22.7271C12.5767 25.911 16.3932 28.077 20.4377 29.225C21.1903 29.4386 21.5666 29.5454 22.1172 29.547C22.7282 29.5488 23.5555 29.3337 24.0881 29.0345C24.5682 28.7648 24.9213 28.4117 25.6274 27.7055L25.8376 27.4954C26.5462 26.7868 26.9005 26.4325 27.093 26.052C27.4757 25.2952 27.4757 24.4015 27.093 23.6448C26.9005 23.2643 26.5462 22.91 25.8376 22.2014L25.5778 21.9416C25.1117 21.4754 24.8786 21.2424 24.6442 21.09C23.7604 20.5153 22.6209 20.5153 21.7371 21.09C21.5027 21.2424 21.2696 21.4754 20.8035 21.9416C20.6511 22.094 20.5749 22.1702 20.4858 22.234C20.1692 22.4607 19.7102 22.5389 19.3364 22.43C19.2312 22.3993 19.1481 22.3594 18.9818 22.2796C17.049 21.3516 15.2375 20.0865 13.6354 18.4844Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span className="relative z-10 text-[20px]">Contact Us</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </Link>
                  <a
                    href="/#how-it-works"
                    className="relative flex gap-2 items-center justify-start p-2 rounded-md transition-all duration-300 overflow-hidden text-gray-200 group"
                    onClick={(e) => {
                      scrollToHowItWorks(e);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path opacity="0.4" d="M2.6665 16L15.5228 22.4282C15.6977 22.5156 15.7852 22.5593 15.8769 22.5765C15.9582 22.5918 16.0415 22.5918 16.1228 22.5765C16.2145 22.5593 16.302 22.5156 16.4769 22.4282L29.3332 16M2.6665 22.6667L15.5228 29.0948C15.6977 29.1823 15.7852 29.226 15.8769 29.2432C15.9582 29.2585 16.0415 29.2585 16.1228 29.2432C16.2145 29.226 16.302 29.1823 16.4769 29.0948L29.3332 22.6667" stroke="#F2CD5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M16.4769 2.90494C16.302 2.81749 16.2145 2.77376 16.1228 2.75655C16.0415 2.74131 15.9582 2.74131 15.8769 2.75655C15.7852 2.77376 15.6977 2.81749 15.5228 2.90494L2.6665 9.33309L15.5228 15.7612C15.6977 15.8487 15.7852 15.8924 15.8769 15.9096C15.9582 15.9249 16.0415 15.9249 16.1228 15.9096C16.2145 15.8924 16.302 15.8487 16.4769 15.7612L29.3332 9.33309L16.4769 2.90494Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span className="relative z-10 text-[20px]">How it use</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </a>
                  <div className="mt-auto flex flex-col space-y-5">
                    <button
                      onClick={() => switchLocale(locale === 'en' ? 'ar' : 'en')}
                      className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/20 text-white">
                      <div className="flex items-center space-x-3">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g id="language">
                            <path id="icon" d="M15.9998 29.3337C14.1776 29.3337 12.4554 28.9837 10.8332 28.2837C9.21095 27.5837 7.79428 26.6281 6.58317 25.417C5.37206 24.2059 4.4165 22.7892 3.7165 21.167C3.0165 19.5448 2.6665 17.8225 2.6665 16.0003C2.6665 14.1559 3.0165 12.4281 3.7165 10.817C4.4165 9.20588 5.37206 7.79477 6.58317 6.58366C7.79428 5.37255 9.21095 4.41699 10.8332 3.71699C12.4554 3.01699 14.1776 2.66699 15.9998 2.66699C17.8443 2.66699 19.5721 3.01699 21.1832 3.71699C22.7943 4.41699 24.2054 5.37255 25.4165 6.58366C26.6276 7.79477 27.5832 9.20588 28.2832 10.817C28.9832 12.4281 29.3332 14.1559 29.3332 16.0003C29.3332 17.8225 28.9832 19.5448 28.2832 21.167C27.5832 22.7892 26.6276 24.2059 25.4165 25.417C24.2054 26.6281 22.7943 27.5837 21.1832 28.2837C19.5721 28.9837 17.8443 29.3337 15.9998 29.3337ZM15.9998 26.6003C16.5776 25.8003 17.0776 24.967 17.4998 24.1003C17.9221 23.2337 18.2665 22.3114 18.5332 21.3337H13.4665C13.7332 22.3114 14.0776 23.2337 14.4998 24.1003C14.9221 24.967 15.4221 25.8003 15.9998 26.6003ZM12.5332 26.067C12.1332 25.3337 11.7832 24.5725 11.4832 23.7837C11.1832 22.9948 10.9332 22.1781 10.7332 21.3337H6.79984C7.44428 22.4448 8.24984 23.4114 9.2165 24.2337C10.1832 25.0559 11.2887 25.667 12.5332 26.067ZM19.4665 26.067C20.7109 25.667 21.8165 25.0559 22.7832 24.2337C23.7498 23.4114 24.5554 22.4448 25.1998 21.3337H21.2665C21.0665 22.1781 20.8165 22.9948 20.5165 23.7837C20.2165 24.5725 19.8665 25.3337 19.4665 26.067ZM5.6665 18.667H10.1998C10.1332 18.2225 10.0832 17.7837 10.0498 17.3503C10.0165 16.917 9.99984 16.467 9.99984 16.0003C9.99984 15.5337 10.0165 15.0837 10.0498 14.6503C10.0832 14.217 10.1332 13.7781 10.1998 13.3337H5.6665C5.55539 13.7781 5.47206 14.217 5.4165 14.6503C5.36095 15.0837 5.33317 15.5337 5.33317 16.0003C5.33317 16.467 5.36095 16.917 5.4165 17.3503C5.47206 17.7837 5.55539 18.2225 5.6665 18.667ZM12.8665 18.667H19.1332C19.1998 18.2225 19.2498 17.7837 19.2832 17.3503C19.3165 16.917 19.3332 16.467 19.3332 16.0003C19.3332 15.5337 19.3165 15.0837 19.2832 14.6503C19.2498 14.217 19.1998 13.7781 19.1332 13.3337H12.8665C12.7998 13.7781 12.7498 14.217 12.7165 14.6503C12.6832 15.0837 12.6665 15.5337 12.6665 16.0003C12.6665 16.467 12.6832 16.917 12.7165 17.3503C12.7498 17.7837 12.7998 18.2225 12.8665 18.667ZM21.7998 18.667H26.3332C26.4443 18.2225 26.5276 17.7837 26.5832 17.3503C26.6387 16.917 26.6665 16.467 26.6665 16.0003C26.6665 15.5337 26.6387 15.0837 26.5832 14.6503C26.5276 14.217 26.4443 13.7781 26.3332 13.3337H21.7998C21.8665 13.7781 21.9165 14.217 21.9498 14.6503C21.9832 15.0837 21.9998 15.5337 21.9998 16.0003C21.9998 16.467 21.9832 16.917 21.9498 17.3503C21.9165 17.7837 21.8665 18.2225 21.7998 18.667ZM21.2665 10.667H25.1998C24.5554 9.55588 23.7498 8.58921 22.7832 7.76699C21.8165 6.94477 20.7109 6.33366 19.4665 5.93366C19.8665 6.66699 20.2165 7.4281 20.5165 8.21699C20.8165 9.00588 21.0665 9.82255 21.2665 10.667ZM13.4665 10.667H18.5332C18.2665 9.68921 17.9221 8.76699 17.4998 7.90033C17.0776 7.03366 16.5776 6.20033 15.9998 5.40033C15.4221 6.20033 14.9221 7.03366 14.4998 7.90033C14.0776 8.76699 13.7332 9.68921 13.4665 10.667ZM6.79984 10.667H10.7332C10.9332 9.82255 11.1832 9.00588 11.4832 8.21699C11.7832 7.4281 12.1332 6.66699 12.5332 5.93366C11.2887 6.33366 10.1832 6.94477 9.2165 7.76699C8.24984 8.58921 7.44428 9.55588 6.79984 10.667Z" fill="white" />
                          </g>
                        </svg>

                        <span>{locale === 'en' ? 'العربية' : 'English'}</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>


                    <Link
                      href="/login"
                      className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/20 text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Log In</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
