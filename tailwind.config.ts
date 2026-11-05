import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Clay Theme Colors
        clay: {
          bg: "#FBF9F5",
          card: "#FFFFFF",
          border: "#EBE7DF",
          borderHover: "#DBD5C8",
          dark: "#1C1613",
          banner: "#231C18",
          muted: "#7D756D",
          soft: "#F4F0E8",
        },
        // Solar Gold Clay Accent (Replacing #F59E0B with #FCD34D)
        solar: {
          50: "#FFFDF5",
          100: "#FEF9E7",
          200: "#FDEFC4",
          300: "#FCE5A2",
          400: "#FCD34D", // Primary Accent Requested
          500: "#FCD34D", // Primary Accent Requested
          600: "#F5B82E",
          700: "#D99814",
          800: "#A87208",
          900: "#754E05",
        },
        slate: {
          850: "#1A1512",
          900: "#14100D",
          950: "#0D0A08",
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.35rem",
      },
    },
  },
  plugins: [],
};

export default config;
