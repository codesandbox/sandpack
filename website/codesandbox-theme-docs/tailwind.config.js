const colors = require("tailwindcss/colors");

const makePrimaryColor =
  (l) =>
  ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `hsl(var(--nextra-primary-hue) 100% ${l}%)`;
    }
    return `hsl(var(--nextra-primary-hue) 100% ${l}% / ${opacityValue})`;
  };

module.exports = {
  prefix: "nx-",
  content: [
    "./src/**/*.tsx",
    "../nextra/src/icons/*.tsx",
    "../nextra/src/components/*.tsx",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "4rem",
    },
    letterSpacing: {
      tight: "-0.015em",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: "#000",
      white: "#fff",
      gray: colors.gray,
      slate: colors.slate,
      neutral: colors.neutral,
      red: colors.red,
      orange: colors.orange,
      blue: colors.blue,
      yellow: colors.yellow,
      primary: {
        50: makePrimaryColor(75),
        100: makePrimaryColor(75),
        200: makePrimaryColor(75),
        300: makePrimaryColor(75),
        400: makePrimaryColor(75),
        500: makePrimaryColor(75),
        600: makePrimaryColor(45),
        700: makePrimaryColor(75),
        750: makePrimaryColor(75),
        800: makePrimaryColor(75),
        900: makePrimaryColor(75),
        1000: makePrimaryColor(10),
      },
    },
    extend: {
      colors: {
        dark: "#111",
      },
    },
  },
  darkMode: ["class", 'html[class~="dark"]'],
};
