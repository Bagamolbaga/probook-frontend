import { useEffect, useState } from "react";
import Image from "next/image";
import { Autoplay, Pagination } from "swiper/modules";
import { SwiperSlide } from "swiper/react";

import Swiper from "@/components/ui/swiper";
import MainLoader from "@/components/ui/loaders/MainLoader";

type Props = {
  images: string[]
}

const ImagesSwiper = ({images}: Props) => {
  const [firstImageIsLoaded, setFirstImageIsLoaded] = useState<"loading" | "loaded">();

  useEffect(() => {
    const timer = setTimeout(() => {
      // setFirstImageIsLoaded("loading");
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden">
      <Swiper
        className="w-full h-full"
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
        }}
        loop
        pagination={{ clickable: true }}
      >
        {images.map((i, index) => (
          <SwiperSlide key={index} className="relative w-full h-full">
            <Image
              fill
              src={i}
              alt={`Slide ${index + 1}`}
              className="w-full h-auto object-cover"
              onLoadingComplete={() => setFirstImageIsLoaded("loaded")}
            />

            {firstImageIsLoaded === "loading" && (
              <div className="absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center">
                <MainLoader />
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImagesSwiper;
