import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        palm: {
          blue: "#0066CC",
          green: "#00A86B",
          orange: "#FF6B35",
          red: "#DC143C",
        },
      },
    },
  },
  plugins: [],
};
export default config;
