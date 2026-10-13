/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind scans these files and only generates CSS for the classes it finds.
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Our own design tokens (same palette as Assignment 1's CSS variables).
      // Use them as: bg-navy, text-accent, border-line, ...
      colors: {
        navy: '#0f1a3a',
        charcoal: '#26262b',
        accent: { DEFAULT: '#f59e0b', dark: '#d98506' },
        ink: { DEFAULT: '#2d2f36', soft: '#5d6370', muted: '#8a909c' },
        line: '#e4e7ec',
        surface: { DEFAULT: '#f5f7fa', alt: '#f0f1f4' },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,26,58,.05), 0 4px 14px rgba(15,26,58,.05)',
      },
    },
  },
  plugins: [],
};
