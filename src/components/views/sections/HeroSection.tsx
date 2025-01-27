import Image from 'next/image'
// import { useTranslations } from 'next-intl'
import homeBg from 'assets/images/homePageBackground.png'
export default function HeroSection() {
  // const t = useTranslations('home')

  return (
    <section className="animate-fadeIn relative min-h-fit lg:min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={homeBg}
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-20 my-auto text-center">
        <div className="flex items-center justify-center mb-5 animate-bounce">
          <h2 className="text-white text-h2 font-semibold uppercase tracking-wider relative inline-block">
            SHARE ANY THING{" "} <br className='lg:hidden' />
            <span className="relative text-black font-bold">
              <span
                className="absolute  inset-0 -z-10 bg-[url('assets/icons/brush.svg')] bg-no-repeat bg-contain"
                style={{
                  height: "50px",
                  width: "200px",
                  transform: "translate(-20%, -10px)",
                }}
              ></span>
              & MORE
            </span>
          </h2>
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-8">
          <div className='flex flex-col rounded-2xl bg-[#3b3b3b] border border-[#FEC400] shadow-lg p-2 py-8
          lg:border-none lg:bg-transparent lg:shadow-none
          '>
            <h1 className="text-h1 font-bold lg:text-left w-full text-white mb-6 animate-fadeInLeft">
              DIGITAL BUSINESS CARD
            </h1>
            <h2 className="text-h2 font-bold lg:text-left w-full text-yellow-400 mb-8 animate-fadeInRight">
              THE FUTURE OF BUSINESS COMMUNICATION
            </h2>
            <p className="text-body lg:text-left mb-8 max-w-3xl w-full mx-auto animate-scaleIn">
              Communication between people easily and in the fastest way while saving time and money.
              We can help you easily widen your social network in a new and easy way for all of your clients
              whether you are an artist, photographer, businessman, salesperson, model, celebrity, recruiter,
              athlete, business owner, or entrepreneur.
            </p>

            <div className="flex flex-wrap justify-center gap-4 animate-rotateIn">
              <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors">
                Products
              </button>
              <button className="border border-yellow-400 text-yellow-400 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 hover:text-black transition-colors flex items-center gap-2">
                For teams
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <video
            src="/c12_site_1.mp4"
            muted
            autoPlay
            loop
            playsInline
            width={400}
            height={400}
            className="max-h-fit lg:w-[35%] max-w-full rounded-lg shadow-lg bg-transparent"
          />
        </div>

      </div>
    </section>
  )
}
