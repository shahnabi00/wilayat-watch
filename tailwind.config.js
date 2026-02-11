/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                midnight: {
                    DEFAULT: '#0a1628',
                    light: '#1a2744',
                    dark: '#060e1a',
                    50: '#e8ecf4',
                    100: '#c5cfe0',
                    200: '#9eafcb',
                    300: '#778fb6',
                    400: '#5977a6',
                    500: '#3b5f96',
                    600: '#2d4a78',
                    700: '#1f355a',
                    800: '#1a2744',
                    900: '#0a1628',
                },
                gold: {
                    DEFAULT: '#d4a843',
                    light: '#f0d078',
                    dark: '#b08a2e',
                    50: '#fdf8eb',
                    100: '#f9eccc',
                    200: '#f4d999',
                    300: '#f0d078',
                    400: '#e7be56',
                    500: '#d4a843',
                    600: '#b08a2e',
                    700: '#8c6c1f',
                    800: '#684f14',
                    900: '#44330c',
                },
                cream: '#f5f0e8',
                'soft-white': '#fafaf7',
                wiladat: '#4ade80',
                shahadat: '#ef4444',
                eid: '#d4a843',
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'Georgia', 'serif'],
                sans: ['Inter', 'system-ui', 'sans-serif'],
                arabic: ['Amiri', '"Noto Naskh Arabic"', 'serif'],
            },
            backgroundImage: {
                'geometric-pattern': "url('/patterns/geometric.svg')",
                'gradient-gold': 'linear-gradient(135deg, #d4a843 0%, #f0d078 50%, #d4a843 100%)',
                'gradient-midnight': 'linear-gradient(180deg, #0a1628 0%, #1a2744 100%)',
            },
            boxShadow: {
                'gold-glow': '0 0 20px rgba(212, 168, 67, 0.3)',
                'gold-strong': '0 0 40px rgba(212, 168, 67, 0.5)',
                'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s ease-in-out infinite',
                'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% center' },
                    '100%': { backgroundPosition: '200% center' },
                },
                'pulse-gold': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(212, 168, 67, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(212, 168, 67, 0.6)' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
