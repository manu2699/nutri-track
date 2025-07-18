import uiConfig from '@nutri-track/ui/tailwind-config';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', ...uiConfig.content],
  theme: {
    ...uiConfig.theme,
    extend: {
      ...uiConfig.theme.extend,
    },
  },
  plugins: [...uiConfig.plugins],
};
