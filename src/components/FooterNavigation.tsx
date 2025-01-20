'use client';

import Link from 'next/link';

const FooterNavigation = () => {
  return (
    <nav className="space-y-4">
      <Link href="/" className="block hover:text-[#F1911B] transition-colors">
        Home
      </Link>
      <Link href="/products" className="block hover:text-[#F1911B] transition-colors">
        Products
      </Link>
      <Link href="/about" className="block hover:text-[#F1911B] transition-colors">
        About
      </Link>
      <Link href="/contact" className="block hover:text-[#F1911B] transition-colors">
        Contact
      </Link>
    </nav>
  );
};

export default FooterNavigation;
