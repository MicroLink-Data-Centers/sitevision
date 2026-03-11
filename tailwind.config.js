/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: 'var(--cream)',
        warmWhite: 'var(--warm-white)',
        sand: 'var(--sand)',
        navy: 'var(--navy)',
        steel: 'var(--steel)',
        midBlue: 'var(--mid-blue)',
        ice: 'var(--ice)',
        verdant: 'var(--verdant)',
        amber: 'var(--amber)',
        softRed: 'var(--soft-red)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textTertiary: 'var(--text-tertiary)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
