import { useRef, useState } from "react";
import Image from "next/image";
import { useScroll, useTransform, motion, useMotionValueEvent } from "framer-motion";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "@/i18n";
import { Syne } from "next/font/google";

import { SearchForm as TSearchForm } from "..";
// import SearchForm from "./SearchForm";

import BgLeftFigure from "@/assets/search/section_1_left_figure.png";
import BgRightFigure from "@/assets/search/section_1_right_figure.png";
import { cn } from "@/utils/cn";

const syne = Syne({ weight: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

const BottomArrow = ({ className }: { className?: string }) => {
  return (
    <svg
      width="121"
      height="120"
      viewBox="0 0 121 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <rect
        x="1.57031"
        y="1"
        width="118"
        height="118"
        rx="59"
        stroke="url(#paint0_linear_2092_64)"
        strokeWidth="2"
      />
      <path
        d="M60.5703 81.3333L76.5703 65.3333M60.5703 81.3333L44.5703 65.3333M60.5703 81.3333V53.3333M60.5703 38.6667V45.3333"
        stroke="url(#paint1_linear_2092_64)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2092_64"
          x1="64.0703"
          y1="9.76339e-08"
          x2="60.5703"
          y2="148"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#603FEF" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_2092_64"
          x1="60.5703"
          y1="38.6667"
          x2="60.5703"
          y2="81.3333"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#603FEF" stopOpacity="0" />
          <stop offset="1" stopColor="#603FEF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

type Props = {
  form: UseFormReturn<TSearchForm>;
  companies: TCompany[];
  handleSearchServices: (formData: TSearchForm) => void;
};

const FirstSection = ({ form, companies, handleSearchServices }: Props) => {
  const t = useTranslations();

  const [formIsSmall, setFormIsSmall] = useState(false);

  const containerRef = useRef(null);
  const scroll = useScroll({
    target: containerRef,
    offset: ["start start", "end center"],
  });

  const opacityText = useTransform(scroll.scrollYProgress, [0.5, 1], [1, 0]);
  const opacityBottomText = useTransform(scroll.scrollYProgress, [0.5, 0.9], [1, 0]);
  const opacityBottomArrow = useTransform(scroll.scrollYProgress, [0.5, 0.85], [1, 0]);
  const overflowMarginImgValue = useTransform(
    scroll.scrollYProgress,
    [0.5, 1],
    ["0px", "-400px"]
  );

  useMotionValueEvent(scroll.scrollYProgress, "change", (latest) => {
    if (latest === 1) {
      setFormIsSmall(true);
    } else {
      setFormIsSmall(false);
    }
  });

  return (
    <div ref={containerRef} className="h-[calc(100vh+156px)] border">
      <div className="1fixed z-[90] w-full h-screen sm:h-[calc(100vh+156px)] pointer-events-none">
        <div className="fixed z-[1] top-[60px] bottom-0 left-0 right-0 w-full h-full object-cover overflow-hidden flex items-center justify-between">
          <motion.div
            className="relative"
            style={{
              left: overflowMarginImgValue,
            }}
          >
            <Image className="relative h-full" src={BgLeftFigure} alt="Bowers" />
          </motion.div>
          <motion.div
            className="relative"
            style={{
              right: overflowMarginImgValue,
            }}
          >
            <Image className="relative h-full" src={BgRightFigure} alt="Bowers" />
          </motion.div>
        </div>
        <div className="z-[2] max-w-content h-full mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm flex flex-col items-center justify-center gap-[60px] md:gap-[40px]">
          <motion.h1
            className={cn(
              "text-[70px] text-center sm:mt-0 sm:text-[60px]",
              syne.className
            )}
            style={{
              opacity: opacityText,
            }}
          >
            {t.rich("landingSearch.title", {
              br: () => <br />,
              colored: (t) => <span className="text-purplePrimary">{t}</span>,
            })}
          </motion.h1>

          <div className="sticky top-[100px] w-full h-[50px] bg-purplePrimary"></div>

          {/* <SearchForm
            form={form}
            companies={companies}
            handleSearch={handleSearchServices}
            isSmall={formIsSmall}
          /> */}
        </div>
      </div>
      <motion.div
        className="fixed bottom-[100px] w-full flex justify-center sm:bottom-[50px]"
        style={{
          opacity: opacityBottomArrow,
        }}
      >
        <BottomArrow className="size-[120px] sm:size-[90px]" />
      </motion.div>
    </div>
  );
};

export default FirstSection;
