import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        app: "radial-gradient(900px circle at 18% 12%, rgba(176, 38, 255, 0.16), transparent 55%), radial-gradient(820px circle at 70% 28%, rgba(42, 14, 79, 0.55), transparent 58%), linear-gradient(180deg, rgba(6, 3, 12, 0.95) 0%, rgba(5, 3, 10, 1) 55%, rgba(4, 2, 8, 1) 100%)",
      },
      colors: {
        ink: {
          DEFAULT: "#05030a",
          900: "#0b0614",
        },
        brand: {
          DEFAULT: "#2a0e4f",
          700: "#3a136b",
          500: "#5b1ca6",
        },
        neon: {
          DEFAULT: "#b026ff",
          300: "#d58bff",
        },
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(176, 38, 255, 0.22), 0 12px 30px rgba(0,0,0,0.55)",
        card: "0 0 0 1px rgba(255,255,255,0.06), 0 18px 50px rgba(0,0,0,0.65)",
      },
    },
  },
  plugins: [],
} satisfies Config;
