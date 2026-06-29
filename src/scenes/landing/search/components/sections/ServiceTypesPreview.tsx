import Image from "next/image";

import BGPattern from "@/assets/search/serviceTypesPreview/bg_pattern.png";
import FacialsImg from "@/assets/search/serviceTypesPreview/facials_and_skincare.jpg";
import MassageImg from "@/assets/search/serviceTypesPreview/massage.jpg";
import NailImg from "@/assets/search/serviceTypesPreview/nail.jpg";
import HairImg from "@/assets/search/serviceTypesPreview/hair_and_styling.jpg";
import Button from "@/components/ui/button";
import MoreIcon from "@/components/ui/icons/More";
import { SERVICE_TYPES_ENUM } from "@/constants/serviceTypes";

type Props = {
  handleSelectPreset: (args: { st: TServiceType[]; title: string }) => void;
};

const ServiceTypesPreview = ({ handleSelectPreset }: Props) => {
  return (
    <div className="mt-[100px] max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm w-full pt-10 pb-5 flex gap-6 sm:flex-col">
      <div className="relative w-1/2 min-h-[670px] pt-[78px] flex flex-col items-center rounded-2xl overflow-hidden sm:w-full">
        <Image
          fill
          className="-z-10 object-cover"
          src={BGPattern}
          alt="Local Beauty And Wellness Store - Discover handpicked salons, spas, and personal care specialists near you — anytime, anywhere. | Bowers"
        />
        <div
          className="relative w-[360px] 1h-[333px] p-4 rounded-2xl md:w-[300px] sm:w-4/5"
          style={{
            background:
              "radial-gradient(105.59% 104.06% at 95.59% 2.75%, #9885D9 0%, #DBD1FF 52.41%, #FEFFFF 100%)",
          }}
        >
          <div className="relative w-full p-[1px] flex flex-col rounded-lg overflow-hidden bg-white">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-[#EAEAEA] to-purplePrimary"></div>
            <div className="z-10 h-[55px] p-2 flex justify-end rounded-t-lg bg-gradient-to-r from-[#B266C7] to-[#A789EE]">
              <div className="size-10 rounded-2xl flex items-center justify-center bg-[#27272B40]">
                <MoreIcon />
              </div>
            </div>
            <div className="z-10 p-4 rounded-b-lg bg-white">
              <h6 className="text-xl leading-[30px] font-bold text-[#27272B] sm:text-sm">
                Glow & Go Beauty Plan
              </h6>
              <p className="text-base leading-6 text-[#61616B] sm:text-xs">
                Handpicked treatments from top-rated beauty studios near you.
              </p>
              <div className="py-2 flex items-center justify-between">
                <div>
                  <p className="w-fit py-1 px-2 rounded-full text-xs leading-[18px] font-bold text-[#61616B] bg-[#F7F7F8] sm:text-[8px]">
                    Total services included: 12
                  </p>
                  <p className="w-fit mt-1 py-1 px-2 rounded-full text-xs leading-[18px] font-bold text-[#61616B] bg-[#F7F7F8] sm:text-[8px]">
                    Booking available: 23/01/2025
                  </p>
                </div>
                <div></div>
              </div>
              <div className="mt-2 flex items-end justify-between">
                <div>
                  <p className="text-xs leading-[18px] text-[#B0B0BF] sm:text-[8px]">
                    Price from
                  </p>
                  <p className="mt-1 text-xl leading-[30px] font-bold text-[#27272B] sm:text-xs">
                    ฿800.00
                  </p>
                </div>
                <Button
                  variant="resting"
                  className="pointer-events-none py-2 px-4 !text-[#27272B] !font-normal !leading-6 border border-[#E9E9ED] bg-[#F7F7F8] sm:py-1 sm:px-2 sm:text-[10px]"
                >
                  Book now
                </Button>
              </div>
            </div>
          </div>

          <div className="absolute -z-10 w-[100px] h-[290px] -left-5 top-1/2 -translate-y-1/2 rounded-[14px] bg-white/40"></div>
          <div className="absolute -z-10 w-[100px] h-[240px] -left-10 top-1/2 -translate-y-1/2 rounded-[14px] bg-white/30"></div>
          <div className="absolute -z-10 w-[100px] h-[200px] -left-[60px] top-1/2 -translate-y-1/2 rounded-[14px] bg-white/20"></div>

          <div className="absolute -z-10 w-[100px] h-[290px] -right-5 top-1/2 -translate-y-1/2 rounded-[14px] bg-white/40"></div>
          <div className="absolute -z-10 w-[100px] h-[240px] -right-10 top-1/2 -translate-y-1/2 rounded-[14px] bg-white/30"></div>
          <div className="absolute -z-10 w-[100px] h-[200px] -right-[60px] top-1/2 -translate-y-1/2 rounded-[14px] bg-white/20"></div>
        </div>
        <div className="w-full mt-[50px] px-[62px] pb-10 flex flex-col items-center gap-4">
          <h4 className="text-2xl font-extrabold leading-[40px] text-center text-white">
            Local Beauty And Wellness Store
          </h4>
          <p className="text-lg leading-6 text-center text-white">
            Discover handpicked salons, spas, and personal care specialists near you —
            anytime, anywhere.
          </p>
          <Button variant="primary" className="py-3 px-6 !rounded-full">
            Explore All Listings
          </Button>
        </div>
      </div>

      <div className="w-1/2 grid grid-cols-2 gap-6 sm:w-full">
        <div
          className="group relative flex items-center justify-center rounded-[14px] overflow-hidden cursor-pointer sm:h-[200px]"
          onClick={() =>
            handleSelectPreset({
              st: [SERVICE_TYPES_ENUM["SKIN"]],
              title: "Facials & Skincare",
            })
          }
        >
          <Image
            fill
            className="object-cover object-right-top transition-all group-hover:scale-110"
            src={FacialsImg}
            alt="Facials & Skincare - Cleansing, anti-aging treatments | Bowers"
          />
          <div className="absolute top-0 left-0 w-full h-full pb-5 flex flex-col justify-end transition-all bg-gradient-to-t from-black/100 to-black/0 group-hover:to-black/20">
            <h5 className="text-xl font-extrabold leading-[38px] text-center text-white sm:text-base">
              Facials & Skincare
            </h5>
            <p className="leading-[24px] text-center text-white sm:text-sm">
              Cleansing, anti-aging treatments
            </p>
          </div>
        </div>
        <div
          className="group relative flex items-center justify-center rounded-[14px] overflow-hidden cursor-pointer sm:h-[200px]"
          onClick={() =>
            handleSelectPreset({
              st: [SERVICE_TYPES_ENUM["MASSAGE"]],
              title: "Massage Therapy",
            })
          }
        >
          <Image
            fill
            className="object-cover object-bottom scale-110 transition-all group-hover:scale-[1.2]"
            src={MassageImg}
            alt="Massage Therapy - Thai massage, hot stone, deep tissue | Bowers"
          />
          <div className="absolute top-0 left-0 w-full h-full pb-5 flex flex-col justify-end transition-all bg-gradient-to-t from-black/100 to-black/0 group-hover:to-black/20">
            <h5 className="text-xl font-extrabold leading-[38px] text-center text-white sm:text-base">
              Massage Therapy
            </h5>
            <p className="leading-[24px] text-center text-white sm:text-sm">
              Thai massage, hot stone, deep tissue
            </p>
          </div>
        </div>
        <div
          className="group relative flex items-center justify-center rounded-[14px] overflow-hidden cursor-pointer sm:h-[200px]"
          onClick={() =>
            handleSelectPreset({
              st: [SERVICE_TYPES_ENUM["NAIL"]],
              title: "Nail Services",
            })
          }
        >
          <Image
            fill
            className="object-cover object-center transition-all group-hover:scale-110"
            src={NailImg}
            alt="Nail Services - Manicure, pedicure, gel nails, nail art | Bowers"
          />
          <div className="absolute top-0 left-0 w-full h-full pb-5 flex flex-col justify-end transition-all bg-gradient-to-t from-black/100 to-black/0 group-hover:to-black/20">
            <h5 className="text-xl font-extrabold leading-[38px] text-center text-white sm:text-base">
              Nail Services
            </h5>
            <p className="leading-[24px] text-center text-white sm:text-sm">
              Manicure, pedicure, gel nails, nail art
            </p>
          </div>
        </div>
        <div
          className="group relative flex items-center justify-center rounded-[14px] overflow-hidden cursor-pointer sm:h-[200px]"
          onClick={() =>
            handleSelectPreset({
              st: [SERVICE_TYPES_ENUM["HAIR"]],
              title: "Hair & Styling",
            })
          }
        >
          <Image
            fill
            className="object-cover object-[80%] transition-all group-hover:scale-110"
            src={HairImg}
            alt="Hair & Styling - Haircuts, coloring, blowouts | Bowers"
          />
          <div className="absolute top-0 left-0 w-full h-full pb-5 flex flex-col justify-end transition-all bg-gradient-to-t from-black/100 to-black/0 group-hover:to-black/20">
            <h5 className="text-xl font-extrabold leading-[38px] text-center text-white sm:text-base">
              Hair & Styling
            </h5>
            <p className="leading-[24px] text-center text-white sm:text-sm">
              Haircuts, coloring, blowouts
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTypesPreview;
