module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    fontFamily: {
      display: "Poppins",
      head: "Poppins",
    },
    extend: {
      colors: {
        meadow: {
          DEFAULT: "#23C2A2",
          50: "#9AEDDC",
          100: "#8BEAD6",
          200: "#6CE4CC",
          300: "#4EDFC1",
          400: "#30D9B7",
          500: "#23C2A2",
          600: "#1FAD90",
          700: "#1C977E",
          800: "#18816C",
          900: "#146C5A",
        },
        kape: {
          DEFAULT: "#A37566",
          50: "#D7C3BC",
          100: "#D1BAB3",
          200: "#C6A99F",
          300: "#BA988C",
          400: "#AF8779",
          500: "#A37566",
          600: "#896052",
          700: "#6C4C41",
          800: "#503830",
          900: "#33241F",
        },
        salmon: {
          DEFAULT: "#FF8A70",
          50: "#FFFAFA",
          100: "#FFEDEB",
          200: "#FFD2CC",
          300: "#FFB9AD",
          400: "#FFA18F",
          500: "#FF8A70",
          600: "#FF7552",
          700: "#FF6133",
          800: "#FF4D14",
          900: "#F54000",
        },
      },
      borderWidth: {
        3: "3px",
      },
      height: {
        112: "28rem",
        144: "36rem",
        "scrn-8": "80vh",
        "scrn-9": "90vh",
      },
      boxShadow: {
        sprd: "0 3px 10px rgb(0 0 0 / 0.11)",
      },
      gradientDividedGray: ["hover", "focus", "group-hover"],
      gradientDividedMeadow: ["hover", "focus", "group-hover"],
      gradientDividedKape: ["hover", "focus", "group-hover"],
      gradientDividedFroly: ["hover", "focus", "group-hover"],
      gradientDividedAmber: ["hover", "focus", "group-hover"],
      keyframes: {
        slideToR: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "0px" },
        },
        slideToL: {
          "100%": { transform: "translateX(-100%)" },
          "0%": { transform: "0px" },
        },
      },
      animation: {
        slideToR: "slideToR .25s ease-out",
        slideToL: "slideToL .25s ease-out",
      },
    },
  },
  plugins: [],
};
