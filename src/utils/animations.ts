import { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: 'easeInOut' },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: 'easeInOut' },
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: 'easeInOut' },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: 'easeInOut' },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: 'easeInOut' },
  },
};

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -10 },
  visible: {
    opacity: 1,
    rotate: 0,
    transition: { duration: 1, ease: 'easeInOut' },
  },
};

export const skewIn: Variants = {
  hidden: { opacity: 0, skewX: 10 },
  visible: {
    opacity: 1,
    skewX: 0,
    transition: { duration: 1, ease: 'easeInOut' },
  },
};
