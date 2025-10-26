import type { Config } from 'tailwindcss';

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: { navy:"#0A1628", gold:"#C9A55C", cream:"#F8F6F3" },
      keyframes: {
        marquee: { from:{ transform:"translateX(0)" }, to:{ transform:"translateX(-50%)" } },
        reveal: { to:{ opacity:"1", transform:"none" } },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        reveal: "reveal .6s ease forwards",
      },
    },
  },
  plugins: [],
} satisfies Config;



