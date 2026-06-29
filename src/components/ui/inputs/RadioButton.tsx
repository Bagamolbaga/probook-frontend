/* eslint-disable @typescript-eslint/no-unused-vars */
import { Radio, RadioProps, styled } from "@mui/material";

const BpIcon = styled("span")(({ theme }) => ({
  borderRadius: "50%",
  width: 20,
  height: 20,
  backgroundColor: "#D8D8D8",
  "&::before": {
    borderRadius: "50%",
    position: "relative",
    display: "block",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 15,
    height: 15,
    backgroundColor: "white",
    content: '""',
  },
  ".Mui-focusVisible &": {},

  ".MuiFormControlLabel-root.MuiFormControlLabel-label": {
    color: "red",
  },
}));

const BpCheckedIcon = styled(BpIcon)(({ theme }) => ({
  backgroundColor: "#603fef",
  "&::before": {
    width: 8,
    height: 8,
  },
  "input:hover ~ &": {
    backgroundColor: "#603fef",
  },
}));

const RadioButton = (props: RadioProps) => {
  return (
    <Radio
      disableRipple
      color="default"
      checkedIcon={<BpCheckedIcon />}
      icon={<BpIcon />}
      {...props}
    />
  );
};

export default RadioButton;
