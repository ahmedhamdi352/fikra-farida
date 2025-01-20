import React from 'react';
import { NewsletterForm } from './NewsletterForm';

export const Newsletter = () => {
  return (
    <div className="bg-black/25 border border-[#FEC400] flex flex-col items-center rounded-[15px] p-8 text-center  lg:mx-0">
      <h2 className="text-white text-[24px] md:text-[32px] lg:text-[50px] font-medium leading-[110.5%] mb-8">
        Subscribe to our <span className="text-[#FEC400] font-bold">newsletter</span>
      </h2>
      <div className="w-full max-w-[600px]">
        <NewsletterForm />
      </div>
    </div>
  );
};
