import Image from "next/image";
import { cn } from "@/src/utils/cn";
import Logo from "@/src/assets/Logo.svg";

const LogoFullIcon = ({
  className,
}: {
  className?: string;
  fillColor?: string;
}) => {
  return (
    <Image
      src={Logo as string}
      alt="ProBook"
      className={cn("h-auto w-[190px]", className)}
    />
  );
};

export default LogoFullIcon;
