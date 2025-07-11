import Image from 'next/image';
import Link from 'next/link';
import { SiteData } from 'services/api.service';
import { NewsletterForm } from './NewsletterForm';
import FooterNavigation from './FooterNavigation';
import phoneIcon from 'assets/icons/phone.svg';
import pinIcon from 'assets/icons/pin.svg';
import emailIcon from 'assets/icons/mail.svg';
import FacebookIcon from 'assets/social-media/Facebook.png';
import InstagramIcon from 'assets/social-media/Instagram.png';
import TiktokIcon from 'assets/social-media/TikTok.png';
import SnapchatIcon from 'assets/social-media/Snapchat.png';
import TwitterIcon from 'assets/social-media/TwitterX.png';
import WhatsappIcon from 'assets/social-media/WhatsApp.png';
import { useTranslations } from 'next-intl';
import { useTheme } from './ThemeProvider';

interface FooterProps {
  siteData: SiteData;
}

const Footer = ({ siteData }: FooterProps) => {
  const t = useTranslations('common');
  const { theme } = useTheme();

  const socialLinks = [
    { href: siteData.contactWhatsapp, icon: WhatsappIcon, alt: 'WhatsApp' },
    { href: siteData.contactFacebook, icon: FacebookIcon, alt: 'Facebook' },
    { href: siteData.contactInstagram, icon: InstagramIcon, alt: 'Instagram' },
    { href: siteData.contactTiktok, icon: TiktokIcon, alt: 'TikTok' },
    { href: siteData.contactSnapchat, icon: SnapchatIcon, alt: 'Snapchat' },
    { href: siteData.contactX, icon: TwitterIcon, alt: 'X (Twitter)' },
  ].filter(link => link.href);

  return (
    <footer
      className={`${theme === 'light' ? 'bg-black/85 text-white' : ''}`}
      style={{ background: theme === 'dark' ? 'var(--FOOTER)' : undefined }}
    >
      {/* Mobile Layout */}
      <div className="lg:hidden container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* First Row: Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center text-start">
              <Image
                src={siteData.siteLogo}
                alt={siteData.siteName}
                height={40}
                width={140}
                className="w-[100px] h-[100px] mt-4 lg:w-auto brightness-0 invert"
              />
              <p className="text-gray-300 text-sm leading-relaxed mt-6">{t('footer.title')}</p>
            </div>
          </div>

          {/* Second Row: Pages and Contact */}
          <div className="flex justify-between ">
            {/* Pages Section */}
            <div className="space-y-6 flex-1 max-w-[170px]">
              <h2 className="text-[var(--main-color1)] text-xl font-semibold">{t('footer.pages')}</h2>
              <FooterNavigation />
            </div>

            {/* Contact Section */}
            <div className="space-y-6 flex-1">
              <h2 className="text-[var(--main-color1)] text-xl font-semibold">{t('footer.contact')}</h2>
              <div className="space-y-4">
                <a
                  href={`tel:${siteData.contactPhone}`}
                  className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[300px] overflow-hidden text-ellipsis"
                >
                  <Image src={phoneIcon} alt="Phone" width={24} height={24} />
                  <span className="truncate">{siteData.contactPhone}</span>
                </a>
                <a
                  href={`mailto:${siteData.contactEmail}`}
                  className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[300px] overflow-hidden text-ellipsis"
                >
                  <Image src={emailIcon} alt="Email" width={24} height={24} />
                  <span className="truncate">{siteData.contactEmail}</span>
                </a>
                <div className="flex items-center gap-3">
                  <Image src={pinIcon} alt="Location" width={24} height={24} />
                  <span>{siteData.name}</span>
                </div>
                {/* Social Media Icons */}
                <div className="flex items-center  gap-4">
                  {socialLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href ?? ''}
                      className="hover:opacity-80 transition-opacity"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image src={link.icon} alt={link.alt} width={24} height={24} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <NewsletterForm withTitle />
          </div>
        </div>

        <div className="mt-8 ">
          <div
            className="h-[1px] w-full mb-4 bg-gradient-to-r from-transparent via-[#FEC400] to-transparent"
            style={{
              background:
                'linear-gradient(90deg, rgba(254, 196, 0, 0.00) 0%, #FEC400 47.5%, rgba(152, 117, 0, 0.00) 100%)',
            }}
          ></div>
          <p className="text-center text-sm text-gray-400">
            {new Date().getFullYear()} {siteData.siteName} . {t('footer.copyright')}
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block container mx-auto px-4 pt-16">
        <div className="flex justify-between gap-[10%]">
          {/* Logo and Description Column */}
          <div className="w-[40%] space-y-8">
            <Image
              src={siteData.siteLogo}
              alt={siteData.siteName}
              height={80}
              width={180}
              className="w-auto brightness-0 invert"
            />
            <p className="text-gray-300 text-sm leading-relaxed">{t('footer.title')}</p>
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pt-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href ?? ''}
                  className="hover:opacity-80 transition-opacity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={link.icon} alt={link.alt} width={24} height={24} />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div className="w-[40%] space-y-8">
            <h2 className="text-[var(--main-color1)] text-2xl font-semibold">{t('footer.contact')}</h2>
            <div className="space-y-6">
              <a
                href={`tel:${siteData.contactPhone}`}
                className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[300px] overflow-hidden text-ellipsis"
              >
                <Image src={phoneIcon} alt="Phone" width={24} height={24} />
                <span className="truncate">{siteData.contactPhone}</span>
              </a>
              <a
                href={`mailto:${siteData.contactEmail}`}
                className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[300px] overflow-hidden text-ellipsis"
              >
                <Image src={emailIcon} alt="Email" width={24} height={24} />
                <span className="truncate">{siteData.contactEmail}</span>
              </a>
              <div className="flex items-center gap-3">
                <Image src={pinIcon} alt="Location" width={24} height={24} />
                <span>EGYPT</span>
              </div>
            </div>
            {/* Newsletter in Contact column for desktop */}
            <div className="space-y-4 mt-12">
              <NewsletterForm withTitle />
            </div>
          </div>

          {/* Pages Column */}
          <div className="w-[20%] space-y-8">
            <h2 className="text-[var(--main-color1)] text-2xl font-semibold">{t('footer.pages')}</h2>
            <div className="w-fit">
              <FooterNavigation />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 pb-6">
          <div
            className="h-[1px] w-full mb-4 bg-gradient-to-r from-transparent via-[#FEC400] to-transparent"
            style={{
              background:
                'linear-gradient(90deg, rgba(254, 196, 0, 0.00) 0%, #FEC400 47.5%, rgba(152, 117, 0, 0.00) 100%)',
            }}
          ></div>
          <p className="text-center text-sm text-gray-400 ">
            {new Date().getFullYear()} {siteData.siteName} . {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
