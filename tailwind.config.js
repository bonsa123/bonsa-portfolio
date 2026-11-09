/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0E0E10',
        card: '#17171A',
        elevated: '#1F1F23',
        border: '#2A2A2E',
        accent: '#E07A3C',
        'accent-soft': '#C9A86A',
        primary: '#F2F2EF',
        secondary: '#A1A1A6',
        muted: '#6B6B70',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(224,122,60,0.25)' },
          '50%': { boxShadow: '0 0 35px 8px rgba(224,122,60,0.4)' },
        },
      },
    },
  },
  plugins: [],
}
