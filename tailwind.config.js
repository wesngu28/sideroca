/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const fs = require("fs");
const postcss = require("postcss");

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [plugin(function ({ addBase }) {
    const preflightStyles = postcss.parse(
      fs.readFileSync(require.resolve('tailwindcss/lib/css/preflight.css'), "utf8"),
    );
  
    preflightStyles.walkRules((rule) => {
      rule.selector = ".tailwind-preflight " + rule.selector;
    });
  
    addBase(preflightStyles.nodes);
  })],
}
