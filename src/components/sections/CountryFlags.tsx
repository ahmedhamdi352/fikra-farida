import Image from 'next/image';
import { useTranslations } from 'next-intl';
import bgImage from 'assets/images/flags/Map.png';
import egyptFlag from 'assets/images/flags/eg.png';
import saudiFlag from 'assets/images/flags/sa.png';
import uaeFlag from 'assets/images/flags/ae.png';
import locationIcon from 'assets/icons/location.png';

const countries = [
  { code: 'eg', translationKey: 'egypt', flag: egyptFlag },
  { code: 'sa', translationKey: 'saudiArabia', flag: saudiFlag },
  { code: 'ae', translationKey: 'uae', flag: uaeFlag },
];

export default function CountryFlags() {
  const t = useTranslations('home.countries');

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden  min-h-[400px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={bgImage}
              alt="Background"
              className="object-cover"
              priority
              fill
              sizes="(max-width: 708px) 60vw, (max-width: 1100px) 30vw, 33vw"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 py-16 px-6">
            <div className="text-center mb-16">
              <h2 className="text-white text-center text-[12px] md:text-[30px] lg:text-[36px] font-bold capitalize flex items-center justify-center gap-4"
                style={{ lineHeight: 'normal' }}>
                <Image
                  src={locationIcon}
                  alt="Location"
                  width={40}
                  height={40}
                  className="inline-block"
                />
                {t('title')}
              </h2>
            </div>

            <div className="flex justify-center items-center gap-3 md:gap-12">
              {countries.map((country, index) => (
                <div
                  key={index}
                  className="relative w-40 h-24 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                >
                  <Image
                    src={country.flag}
                    alt={t(country.translationKey)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 708px) 60vw, (max-width: 1100px) 30vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
