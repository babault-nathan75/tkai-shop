/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}', './lib/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        surface2: "rgb(var(--surface-raised) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        paper: "rgb(var(--paper) / <alpha-value>)",
        "paper-muted": "rgb(var(--paper-muted) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        glow: "0 0 28px rgb(228 67 50 / 24%)",
        paper: "0 32px 80px rgb(0 0 0 / 24%)",
      },
      backgroundImage: {
        "red-sun":
          "radial-gradient(circle at 50% 20%, rgb(228 67 50 / 30%), transparent 38%)",
        grid: "linear-gradient(rgb(255 255 255 / 4%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 4%) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
