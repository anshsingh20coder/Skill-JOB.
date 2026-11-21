/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070D1E',
          900: '#0B132B',
          850: '#111C3D',
          800: '#1C2541',
          700: '#27385E',
          600: '#3A506B',
          500: '#4A6588',
          100: '#E8ECF5',
          50: '#F4F6FB',
        },
        slate: {
          850: '#151F32',
          950: '#090D1A',
        },
        brand: {
          primary: '#0B132B',
          secondary: '#1C2541',
          accent: '#0284C7',
          highlight: '#38BDF8',
          surface: '#FFFFFF',
          muted: '#64748B',
          border: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.06)',
        'premium': '0 12px 30px -4px rgba(11, 19, 43, 0.08), 0 4px 8px -2px rgba(11, 19, 43, 0.03)',
        'glow-sky': '0 0 25px -5px rgba(14, 165, 233, 0.25)',
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.25)',
      }
    },
  },
  plugins: [],
}
