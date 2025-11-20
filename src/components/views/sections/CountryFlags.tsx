import Image from 'next/image';
import bgImage from 'assets/images/flags/Map.png';
import egyptFlag from 'assets/images/flags/eg.png';
import saudiFlag from 'assets/images/flags/sa.png';
import uaeFlag from 'assets/images/flags/ae.png';
import qatarFlag from 'assets/images/flags/qatar.png';
import kuwaitFlag from 'assets/images/flags/kwuit.png';
import bahrainFlag from 'assets/images/flags/bhren.png';

// import locationIcon from 'assets/icons/location.png';

const countries = [
  { code: 'eg', translationKey: 'egypt', flag: egyptFlag },
  { code: 'sa', translationKey: 'saudiArabia', flag: saudiFlag },
  { code: 'ae', translationKey: 'uae', flag: uaeFlag },
  { code: 'qa', translationKey: 'qatar', flag: qatarFlag },
  { code: 'kw', translationKey: 'kuwait', flag: kuwaitFlag },
  { code: 'bh', translationKey: 'bahrain', flag: bahrainFlag },
  
];

export default function CountryFlags() {

  return (
    <section className="lg:py-16">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden  min-h-[250px]">
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
          <div className="w-full relative z-10 py-16 px-6">

            <div className="w-full grid grid-cols-2 md:flex md:justify-center md:items-center md:flex-wrap gap-3 md:gap-12">
              {countries.map((country, index) => (
                <div
                  key={index}
                  className="relative w-full h-20 md:w-40 md:h-24 rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-110 hover:shadow-2xl"
                >
                  <Image
                    src={country.flag}
                    alt={`${country?.translationKey} flag`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 45vw, (max-width: 1100px) 30vw, 33vw"
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
