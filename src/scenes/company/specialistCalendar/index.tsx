/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";

import TimeLineCalendar from "@/components/timeLineCalendar";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";

type Props = {
  companyId: string;
  specialistId: TSpecialist["id"];
};

const SpecialistCalendarScene = ({ companyId, specialistId }: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="w-full h-full flex-1 flex flex-col">
      {isLoading && (
        <div className="absolute left-0 z-[100] w-full h-screenExHeaderAndFooter flex flex-col items-center justify-center bg-white">
          <div className="w-full flex flex-col items-center justify-center">
            <Player
              src={BlackLogoAnimation}
              autoplay
              loop
              className="w-[200px] h-[200px]"
            />
          </div>
        </div>
      )}
      <TimeLineCalendar
        companyId={companyId}
        specialistIds={[specialistId]}
        onStopLoading={setIsLoading}
      />
    </div>
  );
};

export default SpecialistCalendarScene;
