'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaPhone, FaEnvelope } from 'react-icons/fa';
import { BsChatDots } from 'react-icons/bs';

interface FloatingActionButtonsProps {
  whatsappNumber?: string;
  phoneNumber?: string;
  email?: string;
}

const FloatingActionButtons = ({ whatsappNumber, phoneNumber, email }: FloatingActionButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  };

  const buttons = [
    {
      icon: <FaWhatsapp className="w-6 h-6" />,
      color: 'bg-green-500 hover:bg-green-600',
      href: whatsappNumber,
      show: !!whatsappNumber,
    },
    {
      icon: <FaPhone className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: `tel:${phoneNumber}`,
      show: !!phoneNumber,
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      color: 'bg-red-500 hover:bg-red-600',
      href: `mailto:${email}`,
      show: !!email,
    },
  ].filter(button => button.show);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col-reverse gap-4 mb-4">
            {buttons.map((button, index) => (
              <motion.a
                key={index}
                href={button.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-full ${button.color} flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform duration-200`}
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                custom={index}
              >
                {button.icon}
              </motion.a>
            ))}
          </div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center text-white shadow-lg transform transition-transform duration-200 ${isOpen ? 'rotate-45' : ''
          }`}
      >
        <BsChatDots className="w-7 h-7" />
      </button>
    </div>
  );
};

export default FloatingActionButtons;
