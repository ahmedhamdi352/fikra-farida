"use client"

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import CartIcon from './CartIcon';
import { SiteData } from 'services/api.service';

interface HeaderProps {
  siteData: SiteData;
}

const Header = ({ siteData }: HeaderProps) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className="p-2 text-white bg-black" >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src={siteData.siteLogo}
            alt={siteData.siteName}
            height={45}
            width={45}
            className="w-auto"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="animate-scaleIn hidden lg:flex space-x-8 px-[50px] py-[20px] mt-8 z-10 rounded-b-xl bg-gradient-to-r from-[#F1911B] via-[rgba(254,196,0,0.90)] to-[#F1911B] text-black">
          <Link href="/" className="text-yellow-400 hover:text-yellow-500">
            Home
          </Link>
          <Link href="/products" className="hover:text-gray-300">
            Products
          </Link>
          <Link href="/blogs" className="hover:text-gray-300">
            Blog
          </Link>
          <Link href="/contact" className="hover:text-gray-300">
            Contact Us
          </Link>
          <Link href="/how-it-use" className="hover:text-gray-300">
            How it use
          </Link>
        </nav>

        {/* Icons Section */}
        <div className="flex items-center space-x-4">
          <Link href="/login" className="hover:text-gray-300 p-2 rounded-full">
            <span className="sr-only">Login</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
        <div className="lg:hidden fixed w-[80%] inset-y-0 right-0 z-50">
          <div
            ref={menuRef}
            className="w-[85%] h-screen bg-[#737373]/95 rounded-l-3xl overflow-hidden ml-auto"
          >
            <nav className="h-full p-4 flex flex-col space-y-2">
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-[#F1911B] text-black font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </Link>

              <Link
                href="/products"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>Products</span>
              </Link>

              <Link
                href="/blogs"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
                </svg>
                <span>Blog</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Connect Us</span>
              </Link>

              <Link
                href="/how-it-use"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>how it work</span>
              </Link>

              <div className="mt-auto flex flex-col space-y-3">
                <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-white/20 text-white">
                  <div className="flex items-center space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
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
      )}
    </header>
  );
};

export default Header;
