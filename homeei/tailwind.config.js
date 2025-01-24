/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      scale: {
        '102': '1.02',
      },
    },
  },
  safelist: [
    {
      pattern: /from-(amber|emerald|purple|rose|cyan|indigo|fuchsia)-(400|500|600)/,
    },
    {
      pattern: /shadow-(amber|emerald|purple|rose|cyan|indigo|fuchsia)-500/,
    },
    {
      pattern: /text-(amber|emerald|purple|rose|cyan|indigo|fuchsia)-500/,
    },
    {
      pattern: /bg-(amber|emerald|purple|rose|cyan|indigo|fuchsia)-(400|500|600)/,
    },
  ],
  plugins: [],
};