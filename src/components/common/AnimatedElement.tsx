'use client';

import { motion, useAnimation, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

type AnimatedElementProps = {
  children: React.ReactNode;
  animationVariant: Variants;
  className?: string;
};

export default function AnimatedElement({ children, animationVariant, className }: AnimatedElementProps) {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.15,
  });

  useEffect(() => {
    controls.start(inView ? 'visible' : 'hidden');
  }, [controls, inView]);

  return (
    <motion.div ref={ref} initial="hidden" animate={controls} variants={animationVariant} className={className}>
      {children}
    </motion.div>
  );
}
