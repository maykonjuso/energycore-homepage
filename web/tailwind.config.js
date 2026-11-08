/** @type {import('tailwindcss').Config} */
const c = (v) => `rgb(var(--${v}) / <alpha-value>)`
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: c('bg'), surface: c('surface'), elevated: c('elevated'), line: c('line'),
        text: c('text'), muted: c('muted'), faint: c('faint'),
        brand: c('brand'), brandbtn: c('brand-btn'), 'brand-strong': c('brand-strong'), accent: c('accent'),
        ok: c('ok'), warn: c('warn'), crit: c('crit'),
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { page: '1200px' },
    },
  },
  plugins: [],
}
