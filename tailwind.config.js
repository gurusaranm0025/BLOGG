/** @type {import('tailwindcss').Config} */
import defaultColors from "tailwindcss/colors";
import { createThemes } from "tw-colors";

const colors = {
  gunmetal: "#132D2F",
  "french-gray": "#BDBABF",
  "cadet-gray": "#8E9AA9",
  "rose-quartz": "#AA9897",
  "gunmetal-2": "#062528",
  black: "#242424",
  red: "#FF4E4E",
  transparent: "transparent",
  purple: "#8846FF",
  twitter: "#1DA1F2",
  grey: "#F3F3F3",
  "dark-grey": "#6B6B6B",
  white: "#FFFFFF",
};

export const content = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
];

export const theme = {
  fontSize: {
    sm: "12px",
    base: "14px",
    lg: "15px",
    xl: "16px",
    "2xl": "20px",
    "3xl": "28px",
    "4xl": "38px",
    "5xl": "50px",
  },
  // colors: {
  //   ...defaultColors,
  //   ...colors,
  // },
  extend: {
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic":
        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      "logo-gradient":
        "linear-gradient(105deg, hsl(186deg 43% 13%) 0%, hsl(192deg 35% 17%) 7%, hsl(197deg 28% 21%) 14%, hsl(203deg 22% 25%) 21%, hsl(210deg 17% 29%) 29%, hsl(218deg 13% 32%) 36%, hsl(230deg 9% 36%) 43%, hsl(249deg 7% 40%) 50%, hsl(270deg 6% 42%) 57%, hsl(294deg 5% 45%) 64%, hsl(318deg 5% 49%) 71%, hsl(333deg 6% 52%) 79%, hsl(344deg 8% 56%) 86%, hsl(354deg 8% 60%) 93%, hsl(3deg 10% 63%) 100%)",
    },
    fontFamily: {
      logo: ['"Fredericka The Great", serif'],
      montserrat: ['"Montserrat", "Poppins", sans-serif'],
      poppins: ['"Poppins", "Montserrat", sans-serif'],
      noto: ['"Noto Sans", sans-serif'],
      rale: ['"Raleway", serif'],
    },
  },
};
export const plugins = [
  createThemes({
    light: {
      ...defaultColors,
      gunmetal: "#132D2F",
      "french-gray": "#BDBABF",
      "cadet-gray": "#8E9AA9",
      "rose-quartz": "#AA9897",
      "gunmetal-2": "#062528",
      black: "#242424",
      red: "#FF4E4E",
      transparent: "transparent",
      purple: "#8846FF",
      twitter: "#1DA1F2",
      grey: "#F3F3F3",
      "dark-grey": "#6B6B6B",
      white: "#FFFFFF",
    },
    dark: {
      ...defaultColors,
      gunmetal: "#F3F3F3",
      "french-gray": "#BDBABF",
      "cadet-gray": "#8E9AA9",
      "rose-quartz": "#AA9897",
      "gunmetal-2": "#062528",
      black: "#BDBABF",
      red: "#991F1F",
      transparent: "transparent",
      purple: "#582C8E",
      twitter: "#0E71A8",
      grey: "#2A2A2A",
      "dark-grey": "#E7E7E7",
      white: "#242424",
    },
  }),
];
