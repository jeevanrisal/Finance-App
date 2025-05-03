// tailwind.config.js
module.exports = {
  content: [
    './index.html', // your html
    './src/**/*.{js,jsx,ts,tsx}', // your normal glob
    './src/**/*', // ← catch *any* file under src
  ],
  theme: {
    extend: {
      /* … */
    },
  },
  plugins: [],
};
