import { cn } from "@/src/utils/cn";
import Image from "next/image";
import LogoIconSvg from "@/src/assets/LogoIcon.svg";

const LogoIcon = ({ className }: { className?: string }) => {
  return (
    <Image
      src={LogoIconSvg as string}
      alt="ProBook"
      className={cn("h-auto w-auto", className)}
    />
  );
};

export default LogoIcon;
