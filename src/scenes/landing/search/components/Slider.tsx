import { FC } from "react";
import { SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

import Swiper from "@/components/ui/swiper";
import StoreCard from "./sections/FindedStores/StoreCard";

type Props = {
  isDark?: boolean;
  companies: TCompany[];
};

const Slider: FC<Props> = ({ isDark, companies }) => {
  return (
    <Swiper
      className="w-full h-full"
      modules={[Pagination, Navigation, Autoplay]}
      spaceBetween={20}
      slidesPerView={1}
      pagination={false}
      navigation={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 20,
        },
      }}
    >
      {companies.map((c) => (
        <SwiperSlide key={c.id}>
          <StoreCard
            key={c.id}
            company={
              c as TCompany<{
                price_from: string;
                price_to: string;
              }>
            }
            isDark={isDark}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
