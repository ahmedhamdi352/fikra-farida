import ECommerceImg from 'assets/images/E-commerce.png'
import EasyImg from 'assets/images/Easy.png'
import Image from 'next/image'
import { Button } from '../ui/Button';

export default function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Get any of our products you like"
    },
    {
      number: "2",
      title: "Activate the product"
    },
    {
      number: "3",
      title: "Start setting up your profile account"
    },
    {
      number: "4",
      title: "Add your favorite links"
    },
    {
      number: "5",
      title: "Share your profile using NFC or QR code"
    }
  ];

  return (
    <section className="py-10 relative">
      <div className="container mx-auto px-4 flex items-center justify-center flex-col">
        {/* Title with Icon */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <Image
            src={EasyImg}
            alt="Easy icon"
            width={64}
            height={64}
            className="object-contain"
          />
          <h2 className="text-4xl lg:text-5xl">
            <span className="text-white text-[32px] font-bold">Easy Steps To Know </span>
            <span className="text-[#FEC400] text-[36px] font-bold">How It&apos;s Work</span>
            <span className="text-white text-[32px] font-bold"> !</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-20">
          {/* Left Side - Steps */}
          <div className="w-full lg:w-1/2">
            {/* Steps */}
            <div className="flex flex-col gap-10">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[51.451px] border border-white flex items-center justify-center text-2xl font-bold text-white
                    bg-gradient-to-r from-[#8B5410] from-3.46% to-[rgba(254,196,0,0.90)] to-92.21%
                    shadow-[0px_0px_30px_0px_rgba(255,202,41,0.50),inset_0px_0px_4px_0px_rgba(255,255,255,0.22)]">
                    {step.number}
                  </div>
                  <span className="text-2xl text-white font-light">{step.title}</span>
                </div>
              ))}
            </div>

            {/* Button */}

          </div>

          {/* Right Side - Image */}
          <div className="w-full lg:w-1/2 flex justify-end">
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
        <div className="mt-16">
          <Button
            href="/how-it-use"
            withArrow
            className="relative group px-8 py-3 text-white rounded-[10px] bg-transparent border-2 border-transparent hover:opacity-100 transition-colors"
          // customGradient="bg-gradient-to-r from-[#F1911B] via-[#FEC400E5] to-[#8B5410]"
          >
            how it work
          </Button>
        </div>
      </div>
    </section>
  );
}
