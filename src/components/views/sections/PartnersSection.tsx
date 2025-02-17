// import Image from 'next/image'
import weImg from 'assets/images/partners/we.png'
import winnersImg from 'assets/images/partners/winners.png'
import sevenImg from 'assets/images/partners/seven.png'
import qatariImg from 'assets/images/partners/qatarTameen.png'
import midbankImg from 'assets/images/partners/midBank.png'
import harvestImg from 'assets/images/partners/harvest.png'
import aldawaaImg from 'assets/images/partners/aldawaa.png'
import afaqImg from 'assets/images/partners/afaq.png'
import LogoGridSection from 'components/common/LogoGridSection'
import { useTranslations } from 'next-intl'

export default function PartnersSection() {
  const t = useTranslations('home')

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Left Section */}
          <div className="flex-1 text-center lg:text-left rtl:text-right">
            <h2 className="text-[64px] lg:text-[100px] font-extrabold text-[#FEC400] leading-none mb-6">
              {t('partners.headTitle')}
            </h2>
            <p className=" text-lg lg:text-2xl font-semibold mb-4">
              {t('partners.subTitle')}

            </p>
            <p className="text-[#FEC400] text-base lg:text-lg font-medium">
              {t('partners.description')}
              <br />
              {t('partners.description2')}
            </p>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px bg-[#FEC400]/40 self-stretch my-8"></div>

          {/* Right Section */}
          <div className="flex-1 max-w-full lg:max-w-[50%]">
            <LogoGridSection images={[weImg, winnersImg, sevenImg, qatariImg, midbankImg, harvestImg, aldawaaImg, afaqImg]} />

          </div>
        </div>
      </div>
    </section>
  )
}
