import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper as SwiperBase } from "swiper/react";
import style from "./style.module.scss";
import { cn } from "@/utils/cn";

type SwiperProps = React.ComponentProps<typeof SwiperBase>;

const Swiper = (props: SwiperProps) => {
  return (
    <SwiperBase {...props} className={cn(style.swiper, props.className)}>
      {props.children}
    </SwiperBase>
  );
};

export default Swiper;
