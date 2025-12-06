'use client';

import './logoGridSection.scss';
import { repeatArray, splitIntoUniqueArrays } from 'utils';
import Image from 'next/image'
// import HtmlContent from './HtmlContent';

type LogoGridSectionProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  images?: unknown[];
};

export default function LogoGridSection({ images, className }: LogoGridSectionProps) {
  const [images1, images2] = splitIntoUniqueArrays(images as string[], 2);

  return (
    <section className={`py-0 lg:py-[50px] ${className}`}>
      <div className="v-slider">
        <div className="v-slide-track h-[62px] lg:h-[82px]">
          {repeatArray(images1, 20)?.map((el, index) => (
            <Image src={el} alt={`image_${index}`} key={index} className="h-full w-full" loading="lazy" width={100} height={62} sizes="100px" />
          ))}
        </div>
      </div>
      <div className="v-slider v-slider-reverse">
        <div className="v-slide-track h-[62px] lg:h-[82px]">
          {repeatArray(images2, 20)?.map((el, index) => (
            <Image src={el} alt={`image_${index}`} key={index} className="h-full w-full" loading="lazy" width={100} height={62} sizes="100px" />
          ))}
        </div>
      </div>
    </section>
  );
}
