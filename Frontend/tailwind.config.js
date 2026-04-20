/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6C63FF",
        secondary: "#48CAE4",
        accent: "#F72585",
        background: "#F0F4FF",
        card: "#FFFFFF",
        textDark: "#1E1E2D",
        textMuted: "#8E8EA0",
        success: "#4CC9A0",
        warning: "#FFB347",
        danger: "#FF6B6B"
      }
    }
  },
  plugins: []
};
