/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./apps/**/*.{js,ts,jsx,tsx}",
    "./packages/ui/**/*.{js,ts,jsx,tsx}", // include shared lib files
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
