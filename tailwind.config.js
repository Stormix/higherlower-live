/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["'Press Start 2P'", "sans-serif"],
        display: ["'Inter'", "sans-serif"],
      },
      colors: {
        background: "#0c0d0c",
        border: "#131413",
        primary: "#236ABD",
        red: "#D4281D",
        blue: "#236ABD",
        twitch: {
          DEFAULT: "#6441A5",
          dark: "#543787",
        },
        muted: "#808080",
      },
    },
  },
  plugins: [],
};
