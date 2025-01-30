import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      fontSize: {
        // Body Text
        body: 'clamp(14px, 1.2vw, 18px)',
        // Headers
        h1: 'clamp(32px, 4vw, 48px)', // Main Header
        h2: 'clamp(24px, 3vw, 32px)', // Sub Header
        h3: 'clamp(20px, 2.5vw, 24px)', // Smaller Header
      },
      lineHeight: {
        header: '1.2', // Line height for headers
        body: '1.6', // Line height for paragraphs
      },
      fontFamily: {
        poppins: ['var(--font-poppins)'],
        quicksand: ['var(--font-quicksand)'],
        cairo: ['Cairo', 'sans-serif'],
        mochiy: ['var(--font-mochiy)'],
      },
      backgroundColor: {
        primary: 'var(--background-primary)',
        secondary: 'var(--background-secondary)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
      },
      colors: {
        liner: {
          primary: 'var(--liner-primary)',
          gradientStart: 'var(--liner-gradient-start)',
          gradientEnd: 'var(--liner-gradient-end)',
        },
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(-10deg)' },
          '100%': { opacity: '1', transform: 'rotate(0)' },
        },
        skewIn: {
          '0%': { opacity: '0', transform: 'skewX(10deg)' },
          '100%': { opacity: '1', transform: 'skewX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        marquee: {
          from: { transform: 'translateX(70%)' },
          to: { transform: 'translateX(-70%)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
        fadeInUp: 'fadeInUp 1s ease-in-out forwards',
        fadeInDown: 'fadeInDown 1s ease-in-out forwards',
        fadeInLeft: 'fadeInLeft 1s ease-in-out forwards',
        fadeInRight: 'fadeInRight 1s ease-in-out forwards',
        scaleIn: 'scaleIn 0.5s ease-out forwards',
        rotateIn: 'rotateIn 1s ease-in-out forwards',
        skewIn: 'skewIn 1s ease-in-out forwards',
        float: 'float 3s ease-in-out infinite',
        'float-delay-1': 'float 3s ease-in-out infinite 1s',
        'float-delay-2': 'float 3s ease-in-out infinite 2s',
        shimmer: 'shimmer 2s linear infinite',
        slideDown: 'slideDown 0.5s ease-out forwards',
        marquee: 'marquee 10s linear infinite',
      },
    },
  },
  plugins: [],
  // Enable RTL support
  future: {
    hoverOnlyWhenSupported: true,
  },
  // Add RTL specific utilities
  variants: {
    extend: {
      margin: ['rtl'],
      padding: ['rtl'],
      textAlign: ['rtl'],
    },
  },
};

export default config;
