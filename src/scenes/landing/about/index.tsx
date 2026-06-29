import Image from "next/image";

import Button from "@/components/ui/button";
import GridIcon from "@/components/ui/icons/Grid";
import PieChartIcon from "@/components/ui/icons/PieChart";
import VertexBrandIcon from "@/components/ui/icons/VertexBrand";
import MartinoBrandIcon from "@/components/ui/icons/MartinoBrand";
import ViroganBrandIcon from "@/components/ui/icons/ViroganBrand";
import WaverioBrandIcon from "@/components/ui/icons/WaverioBrand";
import SquareStoneBrandIcon from "@/components/ui/icons/SquareStoneBrand";
import LightningInCircleIcon from "@/components/ui/icons/LightningInCircle";
import Image1 from "@/assets/about_page_section_1.png";
import Image3_1 from "@/assets/about_page_section_3_1.png";
import Image3_2 from "@/assets/about_page_section_3_2.png";
import Image3_3 from "@/assets/about_page_section_3_3.png";
import Image5 from "@/assets/about_page_section_5.png";
import Image6_1 from "@/assets/about_page_section_6_1.png";
import Image6_2 from "@/assets/about_page_section_6_2.png";
import Image6_3 from "@/assets/about_page_section_6_3.png";
import Image7_1 from "@/assets/about_page_section_7_1.png";
import Image7_2 from "@/assets/about_page_section_7_2.png";
import Image7_3 from "@/assets/about_page_section_7_3.png";
import Image7_4 from "@/assets/about_page_section_7_4.png";
import { Link } from "@/i18n";

const AboutScene = () => {
  return (
    <div className="relative w-full min-h-screenExHeaderAndFooter">
      <section className="relative w-full py-[100px] sm:py-[60px]">
        <div className="absolute z-10 top-0 w-full h-full bg-darkPrimary bg-opacity-40"></div>
        <Image
          className="absolute top-0 w-full h-full object-cover object-center"
          src={Image1}
          alt="Bowers"
        />
        <div className="relative z-[12] max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm flex justify-center items-center">
          <h3 className="text-white">About us</h3>
        </div>
      </section>
      <section className="w-full py-[80px] bg-white sm:py-[60px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h4 className="text-[32px] text-center">Trusted by these brands and more</h4>
          <div className="mt-16 flex justify-around items-center gap-5 gap-y-10 flex-wrap">
            <WaverioBrandIcon />
            <SquareStoneBrandIcon />
            <MartinoBrandIcon />
            <ViroganBrandIcon />
            <VertexBrandIcon />
          </div>
        </div>
      </section>
      <section className="w-full pt-[112px] pb-[140px] bg-white sm:pt-[80px] sm:pb-[110px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="w-full flex justify-between items-center gap-20 sm:flex-col">
            <div className="w-[55%] flex justify-center gap-5 sm:w-full">
              <Image className="w-[30%]" src={Image3_1} alt="Bowers" />
              <Image className="w-[30%] relative top-10" src={Image3_2} alt="Bowers" />
              <Image className="w-[30%]" src={Image3_3} alt="Bowers" />
            </div>
            <div className="w-[45%] flex flex-col gap-6 sm:w-full">
              <h3>Who we are</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full pt-[80px] pb-[80px] bg-darkPrimary sm:pt-[60px] sm:pb-[60px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h3 className="text-center text-white">Our values</h3>
          <div className="mt-16 flex justify-between items-start gap-10 sm:flex-col sm:items-center">
            <div className="flex flex-col items-center w-1/4 sm:w-full">
              <div className="w-10 h-10">
                <GridIcon />
              </div>
              <h4 className="mt-8 text-white">Professional</h4>
              <p className="mt-3 font-normal text-greyPrimary text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore
              </p>
            </div>
            <div className="flex flex-col items-center w-1/4 sm:w-full">
              <div className="w-10 h-10">
                <LightningInCircleIcon />
              </div>
              <h4 className="mt-8 text-white">Passionate</h4>
              <p className="mt-3 font-normal text-greyPrimary text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore
              </p>
            </div>
            <div className="flex flex-col items-center w-1/4 sm:w-full">
              <div className="w-10 h-10">
                <PieChartIcon />
              </div>
              <h4 className="mt-8 text-white">Honestly</h4>
              <p className="mt-3 font-normal text-greyPrimary text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative w-full flex flex-col justify-between">
        <div className="absolute -z-[1] -top-2 w-full h-1/2 bg-darkPrimary"></div>
        <div className="max-w-content mx-auto px-[100px] sm:px-10">
          <Image
            className="max-w-[1030px] max-h-[530px] aspect-[16/9] w-full rounded-xl object-cover"
            src={Image5}
            alt="Bowers"
          />
        </div>
      </section>
      <section className="w-full pt-[112px] pb-[140px] bg-white sm:pt-[80px] sm:pb-[110px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="w-full flex justify-between items-center gap-20 sm:flex-col">
            <div className="w-[45%] flex flex-col gap-6 sm:w-full">
              <h3>Why choose us</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
                velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
                est laborum.
              </p>
              <div className="mt-9 flex justify-start items-center gap-12 sm:flex-col sm:gap-6">
                <div className="flex items-center gap-5">
                  <span className="text-[42px] font-bold text-purplePrimary">12K+</span>
                  <p className="text-sm text-gray">
                    Project <br /> Created
                  </p>
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-[42px] font-bold text-purplePrimary">1947</span>
                  <p className="text-sm text-gray">
                    Agencies <br /> Joined
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[55%] flex justify-center gap-5 sm:w-full">
              <Image className="w-[30%]" src={Image6_1} alt="Bowers" />
              <Image className="w-[30%] relative top-10" src={Image6_2} alt="Bowers" />
              <Image className="w-[30%]" src={Image6_3} alt="Bowers" />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-[112px] bg-purpleExtraLight sm:py-[80px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h3 className="text-center">Meet our team</h3>
          <div className="mt-16 flex justify-center items-stretch gap-5 flex-wrap">
            <div className="max-w-[295px] pb-3 flex flex-col items-center rounded-xl bg-white overflow-hidden">
              <Image className="rounded-xl overflow-hidden" src={Image7_1} alt="Bowers" />
              <p className="mt-3 text-lg">Lawrence</p>
              <p className="mt-2 text-sm text-greyPrimary">CEO & Founder</p>
            </div>
            <div className="max-w-[295px] pb-3 flex flex-col items-center rounded-xl bg-white overflow-hidden">
              <Image className="rounded-xl overflow-hidden" src={Image7_2} alt="Bowers" />
              <p className="mt-3 text-lg">Mavis Mata</p>
              <p className="mt-2 text-sm text-greyPrimary">CEO & Founder</p>
            </div>
            <div className="max-w-[295px] pb-3 flex flex-col items-center rounded-xl bg-white overflow-hidden">
              <Image className="rounded-xl overflow-hidden" src={Image7_3} alt="Bowers" />
              <p className="mt-3 text-lg">Richard Joseph</p>
              <p className="mt-2 text-sm text-greyPrimary">CEO & Founder</p>
            </div>
            <div className="max-w-[295px] pb-3 flex flex-col items-center rounded-xl bg-white overflow-hidden">
              <Image className="rounded-xl overflow-hidden" src={Image7_4} alt="Bowers" />
              <p className="mt-3 text-lg">Aastha Thakur</p>
              <p className="mt-2 text-sm text-greyPrimary">CEO & Founder</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-[112px] bg-white sm:py-[80px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="py-20 px-5 flex flex-col items-center rounded-xl text-center bg-purplePrimary sm:py-16">
            <h3 className="text-white">Ready to get started?</h3>
            <p className="mt-6 text-center text-white">
              With lots of unique blocks, you can easily build a page without coding.
              <br />
              Build your next landing page.
            </p>
            <Link href="/contact">
              <Button className="mt-9" variant="dark">
                Get our 14 days free trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutScene;
