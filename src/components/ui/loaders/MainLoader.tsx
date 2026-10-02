import { FC } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import BlackLogoAnimation from "@/src/assets/lottiefiles/blackLogoAnimation.json";
import { cn } from "@/src/utils/cn";

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
