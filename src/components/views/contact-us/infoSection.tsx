'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import phoneIcon from 'assets/icons/phone.svg';
import pinIcon from 'assets/icons/pin.svg';
import emailIcon from 'assets/icons/mail.svg';
import { useSiteData } from 'context/SiteContext';

export default function InfoSection() {
  const t = useTranslations('contact');
  const siteData = useSiteData();

  return (
    <div className="hidden lg:pl-12 lg:flex flex-col justify-center">
      <div className="mb-8">
        <h3 className="text-[var(--main-color1)] text-xl font-semibold mb-4">
          {t('info.title')}
        </h3>
        <p className="text-white/80">
          {t('info.subtitle')}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-start justify-start gap-4">
          <div className="text-[var(--main-color1)]">
            <a
              href={`tel:${siteData.contactPhone}`}
              className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[300px] overflow-hidden text-ellipsis"
            >
              <Image src={phoneIcon} alt="Phone" width={30} height={30} />
              <div>
                <p className="text-white font-bold text-[20px]">
                  {t('info.phone.label')}
                </p>
                <span className="truncate text-[16px]">{siteData.contactPhone}</span>
              </div>
            </a>
          </div>

          <div className="text-[var(--main-color1)]">
            <a
              href={`mailto:${siteData.contactEmail}`}
              className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[300px] overflow-hidden text-ellipsis"
            >
              <Image src={emailIcon} alt="Phone" width={30} height={30} />
              <div>
                <p className="text-white font-bold text-[20px]">
                  {t('info.email.label')}
                </p>
                <span className="truncate text-[16px]">{siteData.contactEmail}</span>
              </div>
            </a>
          </div>

          <div
            className="flex items-center gap-3 hover:text-[var(--main-color1)] transition-colors max-w-[300px] overflow-hidden text-ellipsis"
          >
            <Image src={pinIcon} alt="Phone" width={30} height={30} />
            <div>
              <span className="truncate text-[var(--main-color1)] font-bold text-[16px]">{siteData.contactLocation}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}