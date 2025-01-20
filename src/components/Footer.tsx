import Image from 'next/image';
import Link from 'next/link';
import { SiteData } from 'services/api.service';
import { NewsletterForm } from './NewsletterForm';
import FooterNavigation from './FooterNavigation';

interface FooterProps {
  siteData: SiteData;
}

const Footer = ({ siteData }: FooterProps) => {
  const socialLinks = [
    { href: siteData.contactWhatsapp, icon: '/icons/whatsapp.svg', alt: 'WhatsApp' },
    { href: siteData.contactFacebook, icon: '/icons/facebook.svg', alt: 'Facebook' },
    { href: siteData.contactInstagram, icon: '/icons/instagram.svg', alt: 'Instagram' },
    { href: siteData.contactTiktok, icon: '/icons/tiktok.svg', alt: 'TikTok' },
    { href: siteData.contactSnapchat, icon: '/icons/snapchat.svg', alt: 'Snapchat' },
    { href: siteData.contactX, icon: '/icons/twitter.svg', alt: 'X (Twitter)' },
  ].filter(link => link.href);

  return (
    <footer className="text-white mt-auto" style={{ background: 'linear-gradient(239deg, rgba(12, 13, 13, 0.50) 29.09%, rgba(41, 47, 54, 0.50) 109.67%)' }}>
      <div className="container mx-auto px-4 pt-16 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-6">
            <Image
              src={siteData.siteLogo}
              alt={siteData.siteName}
              height={60}
              width={60}
              className="w-auto"
            />
            <p className="text-gray-300 max-w-sm">
              Communication between people easily and in the fastest way while saving time and money,
              Its the perfect alternative to the digital business card for teams & individuals.
            </p>
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <Link key={index} href={link.href ?? ''} className="hover:opacity-80" target="_blank" rel="noopener noreferrer">
                  <Image src={link.icon} alt={link.alt} width={24} height={24} />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="md:col-span-2">
            <h2 className="text-[#F1911B] text-2xl font-semibold mb-6">Contact</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Image src="/icons/phone.svg" alt="Phone" width={24} height={24} />
                <span>{siteData.contactPhone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Image src="/icons/email.svg" alt="Email" width={24} height={24} />
                <span>{siteData.contactEmail}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Image src="/icons/location.svg" alt="Location" width={24} height={24} />
                <span>{siteData.contactLocation}</span>
              </div>
              {/* Newsletter Form (Client Component) */}
              <div className="lg:w-1/3">
                <NewsletterForm withTitle />
              </div>
            </div>
          </div>

          {/* Pages Section */}
          <div>
            <h2 className="text-[#F1911B] text-2xl font-semibold mb-6">Pages</h2>
            <FooterNavigation />
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-16 pt-8 border-t border-gray-700">
          <p> {new Date().getFullYear()} {siteData.siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
