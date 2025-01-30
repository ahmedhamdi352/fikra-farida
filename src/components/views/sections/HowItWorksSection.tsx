import ECommerceImg from 'assets/images/E-commerce.png'
import EasyImg from 'assets/images/Easy.png'
import { useTranslations } from 'next-intl';
import Image from 'next/image'
export default function HowItWorksSection() {
  const t = useTranslations('home')

  const steps = [
    {
      number: "1",
      title: t("howItWork.step1")
    },
    {
      number: "2",
      title: t("howItWork.step2")
    },
    {
      number: "3",
      title: t("howItWork.step3")
    },
    {
      number: "4",
      title: t("howItWork.step4")
    },
    {
      number: "5",
      title: t("howItWork.step5")
    }
  ];

  return (
    <section id="how-it-works" className="py-10 relative">
      <div className="container mx-auto px-4 flex items-center justify-center flex-col">
        {/* Title with Icon */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-4 mb-4 lg:mb-8">
            <Image
              src={EasyImg}
              alt="Easy icon"
              width={64}
              height={64}
              className="object-contain"
            />
            <h2 className="font-bold capitalize" style={{ lineHeight: 'normal' }}>
              <span className="text-h2">{t("howItWork.headTitle")}</span>
              <span className="text-[#FEC400] text-h2">{t("howItWork.headTitle2")}</span>
              <span className="text-h2"> !</span>
            </h2>
          </div>
          <div className="h-[1px] w-[80%] mb-8 lg:mb-16 bg-gradient-to-r from-transparent via-[#FEC400] to-transparent" style={{
            background: 'linear-gradient(90deg, rgba(254, 196, 0, 0.00) 0%, #FEC400 47.5%, rgba(152, 117, 0, 0.00) 100%)'
          }}></div>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">
          {/* Left Side - Steps */}
          <div className="w-full lg:w-1/2">
            {/* Steps */}
            <div className="flex flex-col gap-10">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-6 lg:gap-8">
                  <div className="aspect-square w-[50px] min-w-[50px] h-[50px] md:w-[60px] md:min-w-[60px] md:h-[60px] rounded-full border border-white flex items-center justify-center text-2xl font-bold text-white
                    bg-gradient-to-r from-[#8B5410] from-3.46% to-[rgba(254,196,0,0.90)] to-92.21%
                    shadow-[0px_0px_30px_0px_rgba(255,202,41,0.50),inset_0px_0px_4px_0px_rgba(255,255,255,0.22)]">
                    {step.number}
                  </div>
                  <span className="text-h3 font-medium" style={{ lineHeight: 'normal' }}>{step.title}</span>
                </div>
              ))}
            </div>

            {/* Button */}

          </div>

          {/* Right Side - Image */}
          <div className="hidden lg:flex w-full lg:w-1/2  justify-end">
            <div className="relative w-full max-w-[500px]">
              <Image
                src={ECommerceImg}
                alt="E-commerce illustration"
                width={500}
                height={500}
                className="object-contain"
                priority
              />
            </div>
          </div>


        </div>
        {/* <div className="mt-16">
          <Button
            href="/how-it-use"
            withArrow
            className="relative group px-8 py-3 text-white rounded-[10px] bg-transparent border-2 border-transparent hover:opacity-100 transition-colors"
          // customGradient="bg-gradient-to-r from-[#F1911B] via-[#FEC400E5] to-[#8B5410]"
          >
            how it work
          </Button>
        </div> */}
      </div>
    </section>
  );
}
