/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Inter"', "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 20px 45px -35px rgba(15,23,42,0.45)",
      },
    },
  },
  plugins: [],
};

