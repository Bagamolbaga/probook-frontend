import { FC } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import { cn } from "@/utils/cn";

type Props = {
  className?: string;
};

const MainLoader: FC<Props> = ({ className }) => {
  return (
    <Player
      src={BlackLogoAnimation}
      autoplay
      loop
      className={cn("w-[100px] h-[100px]", className)}
    />
  );
};

export default MainLoader;
