/** @type {import('tailwindcss').Config} */


module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './app/**/*.{js,ts,tsx}', "./global.css"],

  darkMode: 'class',

  presets: [require('nativewind/preset')],
  theme: {
    extend: {    
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
        // Custom fonts
        'instrument-serif': ['InstrumentSerif-Regular'],
        'instrument-serif-italic': ['InstrumentSerif-Italic'],
      },
      
      borderRadius: {
        // Border radius
        'apple': '16px',
        'apple-sm': '12px',
        'apple-lg': '20px',
      },
      
      boxShadow: {  
        'apple': '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
        'apple-lg': '0 8px 32px 0 rgba(0, 0, 0, 0.16)',
      },
      
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
};
