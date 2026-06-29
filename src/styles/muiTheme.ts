"use client";
import { Lato } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
});

const muiTheme = createTheme({
  typography: {
    fontFamily: lato.style.fontFamily,
  },
  palette: {
    primary: {
      main: "#603FEF"
    }
  }
});

export default muiTheme;
