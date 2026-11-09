/** @type {import('tailwindcss').Config} */
// Paleta "prancha técnica": papel, tinta e um único sinal (laranja de segurança). Valores em src/index.css.
const c = (v) => `rgb(var(--${v}) / <alpha-value>)`
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: c('paper'),
        'paper-2': c('paper-2'),
        panel: c('panel'),
        ink: c('ink'),
        'ink-2': c('ink-2'),
        rule: c('rule'),
        signal: c('signal'),
        'signal-text': c('signal-text'),
        ok: c('ok'),
        crit: c('crit'),
        warn: c('warn'),
      },
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { sheet: '84rem' },
    },
  },
  plugins: [],
}
