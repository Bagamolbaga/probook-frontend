import type { Config } from "tailwindcss";
// import conf from "@repo/ui/tailwindcss-conf"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/scenes/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      sm: { max: "768px" },
      md: { min: "769px", max: "1024px" },
      lg: { min: "1024px" },
    },
    colors: {
      purplePrimary: "#603FEF",
      purpleExtraLight: "#603FEF1A",
      purpleDark: "#4732BA",
      purplePrimary_hover: "#4833a8",
      darkPrimary: "#1C1D21",

      bluePrimary: "#5E81F4",
      blueDark: "#1B51E5",
      blueExtraLight: "#40E1FA1A",
      redPrimary: "#F92718",
      redExtraLight: "#F927181A",
      greenPrimary: "#4CCE18",
      greenExtraLight: "#4CCE181A",
      yellowPrimary: "#FCDA00",
      yellowExtraLight: "#FCDA001A",
      greyPrimary: "#8181A5",
      greyOutline: "#F0F0F3",
      greyOutlineSecondary: "#ECECF2",
      greyBackground: "#F6F6F6",
      greyBackgroundLight: "#F5F5FA",
      white: "#ffffff",
      black: "#000000",

      purpleLightSecondary: "#9698D61A",
      grey: "#52525B",
      greyLight: "#D8D8D8",
      "grey-800": "#434343",
      "neutral-900": "#2F2F2F",
      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        main: ["Lato", "sans-serif"],
        secondary: ["Kaisei Decol", "sans-serif"],
        zillaSlab: ["Zilla Slab"]
      },
      maxWidth: {
        content: "1440px",
      },
      height: {
        header: "78px",
        footer: "78px",
        sidebarRightPanelHeader: "86px",
        fullExSidebarRightPanelHeader: "calc(100% - 86px)",
        screenExHeader: "calc(100vh - 78px)",
        screenExHeaderAndFooter: "calc(100vh - 78px - 78px)",
      },
      minHeight: {
        screenExHeader: "calc(100vh - 78px)",
        screenExHeaderAndFooter: "calc(100vh - 78px - 78px)",
      },
      padding: {
        layoutLeftRight: "100px",
        layoutLeftRight_md: "40px",
        layoutLeftRight_sm: "20px",
        header: "78px",
      },
      boxShadow: {
        primary: "0px 6px 20px 0px rgba(153, 155, 168, 0.10)",
        secondary: "0px 8px 24px -3px rgba(16, 24, 40, 0.05)",
        toast: "0px 2px 6px 0px rgba(16, 24, 40, 0.08)",
      },
      backgroundImage: {
        pinkCircleGradient: "radial-gradient(circle at center, #EF3FE820 10%, transparent 60%)",
        purpleCircleGradient: "radial-gradient(circle at center, #603FEF20 10%, transparent 60%)",
        fromTopLeftToBottomRight: "linear-gradient(150deg, #e8d5f1 0%, #923bc6 100%)"
      }
    },
  },
  plugins: [],
};

export default config;
