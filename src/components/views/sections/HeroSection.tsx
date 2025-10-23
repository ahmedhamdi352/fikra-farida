'use client'

import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import homeBg from 'assets/images/homePageBackground.png'
import Link from 'next/link'
import { cn } from 'utils'
import { useSiteData } from 'context/SiteContext'
export default function HeroSection() {
  const t = useTranslations('home')
  const locale = useLocale();
  const siteData = useSiteData();

  return (
    <section className="animate-fadeIn relative min-h-fit lg:min-h-[90vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        <Image
          src={homeBg}
          alt="Hero Background"
          fill
          className="object-cover opacity-1"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-20 my-auto text-center">
        <div className="flex items-center justify-center mb-5 animate-bounce">
          <h2 className=" text-h2 font-semibold uppercase tracking-wider relative inline-block">
            {t("hero.title")}{" "} <br className='lg:hidden' />
            <span className="relative text-black font-bold">
              <span
                className="absolute  inset-0 -z-10 bg-[url('/brush.svg')] bg-no-repeat bg-contain"
                style={{
                  height: "50px",
                  width: "200px",
                  transform: locale === 'en' ? "translate(-20%, -10px)" : "translate(20%, -10px)",
                }}
              ></span>
              {t('hero.titleMore')}
            </span>
          </h2>
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8">
          <div className={cn('flex flex-col rounded-2xl  border border-[#FEC400] shadow-lg p-2 py-8 lg:border-none lg:bg-transparent lg:shadow-none lg:text-left',
            { 'lg:text-right': locale === 'ar' }
          )}>
            <h1 className="text-h1 font-bold  w-full  mb-6 animate-fadeInLeft">
              {t('hero.headTitle')}
            </h1>
            <h2 className="text-h2 font-bold  w-full text-[--main-color1] mb-8 animate-fadeInRight">
              {t('hero.subtitle')}
            </h2>
            <p className="text-body  mb-8 max-w-3xl w-full mx-auto animate-scaleIn">
              {t('hero.description')}
            </p>

            <div className="flex flex-wrap justify-center gap-4 animate-rotateIn">
              <Link
                href='/collections'
                className="bg-[--main-color1] text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                {t('hero.buttonForProducts')}
              </Link>
              <Link
                href='/teams' 
                className="border border-[--main-color1] text-[--main-color1] px-8 py-3 rounded-lg font-semibold hover:bg-[--main-color1] hover:text-black transition-colors flex items-center gap-2">
                {t('hero.buttonForTeams')}
                <svg className="w-4 h-4 rtl:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {siteData.reviewMedia1 && <video
            src={siteData.reviewMedia1}
            muted
            autoPlay
            loop
            playsInline
            width={400}
            height={400}
            className="max-h-fit lg:w-[35%] max-w-full rounded-lg shadow-lg bg-transparent"
          />}
        </div>

      </div>
    </section>
  )
}
