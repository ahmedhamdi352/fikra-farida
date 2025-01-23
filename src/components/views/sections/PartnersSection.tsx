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

export default function PartnersSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-6">

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
          {/* Left Section */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-[64px] lg:text-[100px] font-extrabold text-[#FEC400] leading-none mb-6">
              100 K+
            </h2>
            <p className="text-white text-lg lg:text-2xl font-semibold mb-4">
              People And Businesses Place Their Trust
            </p>
            <p className="text-white text-lg lg:text-2xl font-semibold mb-6">
              In All Of Our Services And Products
            </p>
            <p className="text-[#FEC400] text-base lg:text-lg font-medium">
              We Help Businesses Strengthen Relationships
              <br />
              Quickly And Easily, While Reducing Costs
            </p>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px bg-[#FEC400]/40 self-stretch my-8"></div>

          {/* Right Section */}
          <div className="flex-1 max-w-full lg:max-w-[50%]">
            <LogoGridSection images={[weImg, winnersImg, sevenImg, qatariImg, midbankImg, harvestImg, aldawaaImg, afaqImg]} />

            {/* {[weImg, winnersImg, sevenImg, qatariImg, midbankImg, harvestImg, aldawaaImg, afaqImg].map((img, index) => (
              <div
                key={index}
                className="bg-white opacity-70 rounded-xl p-6 aspect-square flex items-center justify-center hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg"
              >
                <Image
                  src={img}
                  alt={`Partner ${index + 1}`}
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </section>
  )
}
