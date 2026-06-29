/* eslint-disable @typescript-eslint/no-unused-vars */
import { Select, styled } from "@mui/material";

const CustomSelect = styled(Select)(({ theme }) => ({
  borderRadius: 0,
  "& .MuiInputBase-input": {
    paddingLeft: 0,
    paddingTop: 0,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottomWidth: "1px",
    borderBottomColor: "#F0F0F3",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderBottomColor: "#F0F0F3",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderBottomColor: "#5E81F4",
    borderBottomWidth: "1px",
  },
}));

export default CustomSelect;
