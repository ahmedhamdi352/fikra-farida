import Image from 'next/image';
import scanningNfc from 'assets/images/scanningNfc.png'
import scanningQR from 'assets/images/scanningQR.png'
import worldInternet from 'assets/images/worldInternet.png'
import socialIcons from 'assets/images/socialIcons.png'


export default function SmartCardSection() {
  return (
    <section className="relative py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto rounded-2xl border border-[#FEC400] p-12 relative overflow-hidden">
          <div className="text-center mb-12 relative z-10">
            <p className="text-white/80 uppercase tracking-wider mb-4 text-[20px]">CONNECT WITH A TOUCH</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[32px]">
              <span className="text-white">Smart & Digital </span>
              <span className="text-[#FEC400]">Business Card</span>
              <span className="text-white"> In Your Hand</span>
            </h2>
            <p className="text-white/80 text-lg mb-4 text-[20px]">
              Get digital business cards for yourself or your team,
              <span className='block'>Join millions of professionals</span>
            </p>

            {/* Decorative Line */}
            <div className="flex justify-center my-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="464" height="40" viewBox="0 0 464 40" fill="none">
                <path d="M0 24.1912C47.3156 24.4845 140.596 23.3404 187.974 23.6318C188.038 23.6321 188.097 23.6571 188.143 23.7014L193.968 29.2924C194.08 29.4005 194.263 29.3801 194.349 29.25L212.816 1.32686C212.917 1.17444 213.142 1.17814 213.238 1.33379L227.077 23.8347C227.176 23.9959 227.411 23.9928 227.506 23.8292L230.642 18.4238C230.739 18.2562 230.982 18.2581 231.076 18.4272L242.317 38.5321C242.421 38.7175 242.694 38.6974 242.769 38.4989L255.136 5.94099C255.209 5.74785 255.472 5.722 255.581 5.89712L266.957 24.0738C267.003 24.1468 267.083 24.1912 267.169 24.1912H464" stroke="url(#paint0_linear_862_5901)" strokeWidth="2" />
                <defs>
                  <linearGradient id="paint0_linear_862_5901" x1="0" y1="20" x2="464" y2="20" gradientUnits="userSpaceOnUse">
                    <stop offset="0.015" stopColor="#F1911B" stopOpacity="0" />
                    <stop offset="0.22" stopColor="#F1911B" />
                    <stop offset="0.505" stopColor="#FFCA29" stopOpacity="0.9" />
                    <stop offset="0.76" stopColor="#8B5410" />
                    <stop offset="0.975" stopColor="#8B5410" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="absolute right-0 top-0 w-1/2 h-full">
            <Image
              src={socialIcons}
              alt="social"
              className="animate-float object-contain"
              style={{
                position: 'absolute',
                right: '-5%',
                top: '35%',
                transform: 'translateY(-50%) scale(1.2)',
                width: '90%',
                height: 'auto',
                opacity: 0.9
              }}
            />
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-2xl">
            {/* Features List */}
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image src={scanningNfc} alt="Device" layout="fill" objectFit="contain" />
                </div>
                <p className="text-white text-lg">Works on any type of device.</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image src={scanningQR} alt="Team" layout="fill" objectFit="contain" />
                </div>
                <p className="text-white text-lg">The perfect alternative to the business card for teams and individuals</p>
              </div>

              <div className="flex items-center gap-6">
                <div className="w-16 h-16 relative flex-shrink-0">
                  <Image src={worldInternet} alt="NFC" layout="fill" objectFit="contain" />
                </div>
                <p className="text-white text-lg">Compatible with NFC technology and Qr Code.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
