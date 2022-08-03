/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        highlightPurple: "#5904ce",
        grayBar: "#b4b4b4",
        xred: "#DB4C3F",
        black: "#262C35",
        purple: "#3025B9",
        blue: "#00ACD7",
        urgent: "#FF2831",
        high: "#E38901",
        medium: "#3483E1",
        low: "#8C8C8C",
        category: "#545454",
        time: "#6EBE6D",
        completed: {
          100: "#DBEDDE",
          400: "#08A835",
        },
        inprogress: "#00ACD7",
      },
    },
  },
  plugins: [],
};
