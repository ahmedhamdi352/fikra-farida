import Image from 'next/image'
// import { useTranslations } from 'next-intl'
import homeBg from 'assets/images/homePageBackground.png'

export default function HeroSection() {
  // const t = useTranslations('home')

  return (
    <section className="animate-fadeIn relative min-h-fit lg:min-h-screen flex items-center">
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

      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-yellow-400 text-body mb-4 uppercase tracking-wider">
            SHARE ANY THING & MORE
          </p>
          <h1 className="text-h1 font-bold text-white mb-6">
            DIGITAL BUSINESS CARD
          </h1>
          <h2 className="text-h2 font-bold text-yellow-400 mb-8">
            THE FUTURE OF BUSINESS COMMUNICATION
          </h2>
          <p className="text-body mb-8 max-w-3xl mx-auto">
            Communication between people easily and in the fastest way while saving time and money.
            We can help you easily widen your social network in a new and easy way for all of your clients
            whether you are an artist, photographer, businessman, salesperson, model, celebrity, recruiter,
            athlete, business owner, or entrepreneur.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
      </div>
    </section>
  )
}
