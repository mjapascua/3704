module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    fontFamily: {
      display: "Karla",
      head: "Work Sans",
    },
    extend: {
      colors: {
        emperor: {
          DEFAULT: "#574A46",
          50: "#A99994",
          100: "#A1908B",
          200: "#917D77",
          300: "#7F6C66",
          400: "#6B5B56",
          500: "#574A46",
          600: "#4C403D",
          700: "#403734",
          800: "#352D2B",
          900: "#2A2422",
        },
      },
      height: {
        "scrn-8": "80vh",
        "scrn-8.5": "85vh",
      },
      boxShadow: {
        sprd: "0 5px 12px rgb(0 0 0 / 0.09)",
      },
    },
  },
  plugins: [],
};
