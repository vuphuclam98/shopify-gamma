module.exports = {
  content: ['./src/**/*.{js,liquid}'],
  mode: 'jit',
  theme: {
    screens: {
      xs: '376px',
      sm: '640px',
      md: '768px',
      'md-max': { max: '767px' },
      'md-checkout': { min: '1000px' },
      lg: '1024px',
      'lg-max': { max: '1023px' },
      xl: '1200px',
      'xl-max': { max: '1199px' },
      '2xl': '1440px',
      '3xl': '1536px'
    },
    fontSize: {
      '4xl': ['36px', { lineHeight: '42px' }],
      '3xl': ['30px', { lineHeight: '36px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
      xl: ['20px', { lineHeight: '28px' }],
      lg: ['18px', { lineHeight: '24px' }],
      base: ['16px', { lineHeight: '24px' }],
      sm: ['14px', { lineHeight: '22px' }],
      xs: ['12px', { lineHeight: '16px' }]
    },
    fontFamily: {
      sans: ['BrownStd', 'sans-serif']
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        md: '24px',
        xl: '32px'
      }
    },
    extend: {
      colors: {
        primary: {
          DEFAULT:  '#5046E5',
          hover: '#6D64EE'
        },
        secondary: {
          DEFAULT: '#66D6D6',
          hover: '#76EDED',
        },
        white: {
          DEFAULT: '#FFFFFF',
          overlay: 'rgba(255, 255, 255, 0.3)'
        },
        dark: {
          overlay: 'rgba(0, 0, 0, 0.2)'
        },
        warning: {
          bg: '#FEFCEA',
          content: '#C18B00'
        },
        error: {
          bg: '#FCF2F2',
          content: '#C9211B'
        },
        info: {
          bg: '#E7E7E7',
          content: '#232323'
        },
        success: {
          bg: '#F2FDF5',
          content: '#3B8584'
        },
        'accent-1': {
          DEFAULT: '#078F67',
          hover: '#3AB893'
        },
        'accent-2': {
          DEFAULT: '#F9C201'
        },
        link: {
          DEFAULT: '#404346',
          hover: '#5046E5'
        },
        default: '#E7E7E7',
        grey: {
          100: '#E7E7E7',
          400: '#A4A8AF',
          500: '#7A7D81',
          700: '#404346',
          900: '#232323'
        }
      },
      borderColor: {
        DEFAULT: '#E7E7E7',
        default: '#E7E7E7',
        focus: '#7A7D81',
        error: '#C9211B'
      },
      boxShadow: {
        0: '0'
      },
      maxWidth: {
        md: '704px',
        lg: '925px',
        xl: '1290px'
      },
      borderRadius: {
        none: '0px',
        sm: '0.125rem', /* 2px */
        DEFAULT: '0.25rem', /* 4px */
        md: '0.375rem', /* 6px */
        lg: '0.5rem', /* 8px */
        xl: '0.75rem', /* 12px */
        '2xl': '1rem', /* 16px */
        '3xl': '1.5rem', /* 24px */
        full: '9999px'
      }
    }
  },
  variants: {},
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [require('@tailwindcss/aspect-ratio'), require('@tailwindcss/forms')]
}
