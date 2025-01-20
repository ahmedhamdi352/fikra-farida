'use client';

import { AnimatedElement } from 'components';
import { Variants } from 'framer-motion';

interface AnimatedSectionProps<T> {
  animationVariant: Variants;
  Component: React.ComponentType<{ data: T }>;
  data: T;
  className?: string;
}

export default function AnimatedSection<T>({
  animationVariant,
  Component,
  data,
  className
}: AnimatedSectionProps<T>) {
  return (
    <AnimatedElement animationVariant={animationVariant} className={className}>
      <Component data={data} />
    </AnimatedElement>
  );
}
