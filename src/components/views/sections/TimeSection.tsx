import file from 'assets/icons/file-heart.svg'
import repeat from 'assets/icons/repeat.svg'
import send from 'assets/icons/send.svg'
import wallet from 'assets/icons/wallet.svg'
import corner from 'assets/icons/corner.svg'
import Image from 'next/image'

export default function TimeSection() {
  const cards = [
    {
      icon: send,
      title: "Go Direct",
      description: "If you own a business - office, shop, restaurant or café, you can direct customers to your site, your social media, and easily list your products and offers."
    },
    {
      icon: send,
      title: "For Businesses & Teams",
      description: "Now You are ready to GO",
      special: true
    },
    {
      icon: corner,
      title: "Grow Faster",
      description: "If you are a professional, you can increase your fans and add more people to your channel You can add only one link and direct people"
    },
    {
      icon: repeat,
      title: "Reusable",
      description: "When an employee leaves work, just update the data and hand it over to the new employee."
    },
    {
      icon: wallet,
      title: "Save Money",
      description: "No need to print paper cards anymore"
    },
    {
      icon: file,
      title: "Building",
      description: "Strong working relationships that help teams and people be successful."
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="rounded-[15px] border-2 border-[#F4DD94]  p-16 relative">
          {/* Grid of Cards */}
          <div className="grid grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className={`text-center p-8 rounded-[15px] ${card.special
                  ? 'bg-[#F4DD94] border-2 border-[#FFF]'
                  : ''
                  } transition-colors`}
              >
                {card.special ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-[#FEC400]/30"></div>
                      <div className="w-8 h-8 rounded-full bg-[#FEC400]/30"></div>
                      <div className="w-8 h-8 rounded-full bg-[#FEC400]/30"></div>
                      <span className="w-6 h-6 rounded-full bg-[#FEC400]/30 flex items-center justify-center text-white text-sm">+1</span>
                    </div>
                    <h3 className="text-[32px] leading-[40px] font-semibold text-black mb-4">{card.title}</h3>
                    <p className="text-black text-[32px] leading-[48px] font-semibold">{card.description}</p>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <Image src={card.icon} alt={`${card.title} icon`} width={32} height={32} className="mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                    <p className="text-gray-400">{card.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
