/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Light theme (ivory architectural)
        bg: {
          DEFAULT: "#F5F2EC",
          dark: "#12110F",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#1C1B17",
        },
        primary: {
          DEFAULT: "#2B2A27",
          dark: "#E8E3D8",
        },
        text: {
          DEFAULT: "#1A1917",
          dark: "#EDE8DC",
        },
        subtext: {
          DEFAULT: "#6B675F",
          dark: "#8F8A7E",
        },
        border: {
          DEFAULT: "#E3DED2",
          dark: "#2A2824",
        },
        accent: {
          DEFAULT: "#B8855A",
          dark: "#D4A574",
        },
        success: {
          DEFAULT: "#5A7A4E",
          dark: "#8BB17A",
        },
        danger: {
          DEFAULT: "#A14A3A",
          dark: "#D17A6A",
        },
      },
      fontFamily: {
        mono: ["Courier", "monospace"],
      },
    },
  },
  plugins: [],
};
