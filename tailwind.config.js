const config = require("tailwindcss/defaultConfig");
const forms = require("@tailwindcss/forms");
const lineClamp = require("@tailwindcss/line-clamp");
const typography = require("@tailwindcss/typography");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...config.theme.fontFamily.sans],
      },
    },
  },
  plugins: [forms, lineClamp, typography],
};
