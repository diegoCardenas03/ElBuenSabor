import { type Config } from "tailwindcss"

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bowlby: ['"Bowlby One SC"', 'cursive'],
        poppins: ['Poppins', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config;
