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

interface HeaderProps {
  siteData: SiteData;
}

const Header = ({ siteData }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter()
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

                <nav className="h-full mt-[35px] p-4 flex flex-col space-y-2">
                  <Link
                    href="/"
                    className={`relative p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname === '/'
                      ? 'bg-yellow-500 text-white font-bold'
                      : 'text-gray-200 group'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">Home</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </Link>
                  <Link
                    href="/products"
                    className={`relative p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname.includes('/products')
                      ? 'bg-yellow-500 text-white font-bold'
                      : 'text-gray-200 group'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">Products</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </Link>
                  <Link
                    href="/blogs"
                    className={`relative p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname.includes('/blogs')
                      ? 'bg-yellow-500 text-white font-bold'
                      : 'text-gray-200 group'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">Blog</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </Link>
                  <Link
                    href="/contact"
                    className={`relative p-2 rounded-md transition-all duration-300 overflow-hidden ${pathname.includes('/contact')
                      ? 'bg-yellow-500 text-white font-bold'
                      : 'text-gray-200 group'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="relative z-10">Contact Us</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </Link>
                  <a
                    href="/#how-it-works"
                    className="relative p-2 rounded-md transition-all duration-300 overflow-hidden text-gray-200 group"
                    onClick={(e) => {
                      scrollToHowItWorks(e);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <span className="relative z-10">How it use</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 animate-shimmer bg-[length:200%_100%]"></div>
                  </a>
                  <div className="mt-auto flex flex-col space-y-3">
                    <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/20 text-white">
                      <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        <span>English</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

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
