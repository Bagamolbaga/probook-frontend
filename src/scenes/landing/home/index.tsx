import { getTranslations, Link } from "@/i18n";
import Image from "next/image";

import PriceCart from "@/components/ui/pricingCart";
import Button from "@/components/ui/button";
import GridIcon from "@/components/ui/icons/Grid";
import VideoIcon from "@/components/ui/icons/Video";
import VSCodeIcon from "@/components/ui/icons/VSCode";
import PieChartIcon from "@/components/ui/icons/PieChart";
import CopyPasteIcon from "@/components/ui/icons/CopyPaste";
import FourAngleStarIcon from "@/components/ui/icons/FourAngleStar";
import LightningInCircleIcon from "@/components/ui/icons/LightningInCircle";

import Image1 from "@/assets/home_page_section_1.png";
import Image3 from "@/assets/home_page_section_3.png";
import Image4 from "@/assets/home_page_section_4.png";
import Image5 from "@/assets/home_page_section_5.png";
import Image7_1 from "@/assets/home_page_section_7_1.png";
import Image7_2 from "@/assets/home_page_section_7_2.png";
import Image7_3 from "@/assets/home_page_section_7_3.png";
import Line from "@/components/ui/icons/Line";
import PersonIcon from "@/components/ui/icons/Person";
import Pricing from "./components/Pricing";
// import B from "@repo/ui/button/index.tsx"

const HomePageScene: any = async () => {
  const t = await getTranslations();

  return (
    <div className="relative w-full">
      <div className="w-full bg-darkPrimary">
        <section className="max-w-content pt-[96px] mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm sm:pt-[60px]">
          <div className="w-full flex flex-col items-center text-center">
            <h1 className="text-white">
              {t.rich("landingHome.section1.title", {
                purple: (text) => <span className="text-purplePrimary">{text}</span>,
                br: (t) => <br />,
              })}
            </h1>
            <p className="mt-6 text-xl text-center text-white md:text-base sm:text-base">
              {t.rich("landingHome.section1.subTitle", {
                br: (t) => <br />,
              })}
            </p>
            <div className="mt-9 flex justify-center gap-4 sm:flex-col sm:gap-4">
              <Link href="https://lin.ee/9b2UE3T" className="flex items-center gap-5">
                <Button
                  variant="primary"
                  className="py-[10px]"
                  iconLeft={<Line className="stroke-none" />}
                >
                  {t("ui.connectViaLine")}
                </Button>
              </Link>
              {/* <Link href="/sign-up" className="flex items-center gap-5">
                <Button
                  variant="dark-outline"
                  iconLeft={<PersonIcon className="stroke-darkPrimary" />}
                >
                  {t("ui.getStarted")}
                </Button>
              </Link> */}
              {/* <Button variant="dark-outline" iconLeft={<VideoIcon />}>
                Watch our video
              </Button> */}

            </div>
            <div className="mt-16 border-t-2 border-x-2 border-greyLight rounded-t-2xl overflow-hidden">
              <Image src={Image1} alt="Bowers" />
            </div>
          </div>
        </section>
      </div>
      <section className="w-full py-20 bg-white">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm flex justify-between items-start gap-[100px] md:gap-[40px] sm:flex-col sm:justify-center">
          <div className="flex flex-col items-start w-1/3 sm:w-full sm:items-center">
            <div className="w-10 h-10">
              <GridIcon />
            </div>
            <h4 className="mt-8">{t("landingHome.section2.item1.title")}</h4>
            <p className="mt-3 font-normal text-greyPrimary sm:text-center">
              {t("landingHome.section2.item1.text")}
            </p>
          </div>
          <div className="flex flex-col items-start w-1/3 sm:w-full sm:items-center">
            <div className="w-10 h-10">
              <LightningInCircleIcon />
            </div>
            <h4 className="mt-8">{t("landingHome.section2.item2.title")}</h4>
            <p className="mt-3 font-normal text-greyPrimary sm:text-center">
              {t("landingHome.section2.item2.text")}
            </p>
          </div>
          <div className="flex flex-col items-start w-1/3 sm:w-full sm:items-center">
            <div className="w-10 h-10">
              <PieChartIcon />
            </div>
            <h4 className="mt-8">{t("landingHome.section2.item3.title")}</h4>
            <p className="mt-3 font-normal text-greyPrimary sm:text-center">
              {t("landingHome.section2.item3.text")}
            </p>
          </div>
        </div>
      </section>
      <section className="w-full py-[96px] bg-greyBackgroundLight md:py-[60px] sm:py-[60px]">
        <div className="max-w-content mx-auto  px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm flex flex-col items-center text-center">
          <p className="text-sm font-bold text-purplePrimary">
            {t("landingHome.section3.preTitle")}
          </p>
          <h3 className="mt-4">
            {t.rich("landingHome.section3.title", {
              purple: (text) => <span className="text-purplePrimary">{text}</span>,
              br: (t) => <br />,
            })}
          </h3>
          <div className="w-full mt-20 flex items-center justify-between gap-[20px] md:flex-col sm:flex-col md:mt-[60px] sm:mt-[40px]">
            <div className="w-2/5 py-4 flex flex-col justify-between gap-5 md:w-full md:flex-row md:gap-5 sm:w-full sm:flex-col sm:gap-5">
              <div className="w-full p-6 rounded-xl flex items-start gap-4 bg-purplePrimary md:flex-col sm:flex-col">
                <div>
                  <CopyPasteIcon />
                </div>
                <div className="text-left">
                  <h5 className="text-white">
                    {t("landingHome.section3.items.item1.title")}
                  </h5>
                  <p className="mt-3 text-white">
                    {t("landingHome.section3.items.item1.text")}
                  </p>
                </div>
              </div>
              <div className="w-full p-6 rounded-xl flex items-start gap-4 bg-white md:flex-col sm:flex-col">
                <div>
                  <FourAngleStarIcon />
                </div>
                <div className="text-left">
                  <h5>{t("landingHome.section3.items.item2.title")}</h5>
                  <p className="mt-3 text-greyPrimary">
                    {t("landingHome.section3.items.item2.text")}
                  </p>
                </div>
              </div>
              <div className="w-full p-6 rounded-xl flex items-start gap-4 bg-white md:flex-col sm:flex-col">
                <div>
                  <VSCodeIcon />
                </div>
                <div className="text-left">
                  <h5>{t("landingHome.section3.items.item3.title")}</h5>
                  <p className="mt-3 text-greyPrimary">
                    {t("landingHome.section3.items.item2.text")}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-3/5 border-[2px] border-darkPrimary rounded-md overflow-hidden md:w-full md:flex md:justify-center sm:w-full sm:flex sm:justify-center">
              <Image src={Image3} alt="Bowers" />
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-[112px] bg-white md:py-[80px] sm:py-[60px]">
        <div className="max-w-content mx-auto px-[200px] md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm flex justify-center gap-20 sm:flex-col sm:items-center sm:gap-10">
          <div className="w-[60%] sm:w-full">
            <Image src={Image4} alt="Bowers" />
          </div>
          <div className="w-1/2 sm:w-full flex flex-col items-start gap-6 sm:items-center">
            <h3 className="mt-4 sm:text-center">
              {t.rich("landingHome.section4.title", {
                purple: (text) => <span className="text-purplePrimary">{text}</span>,
              })}
            </h3>
            <p className=" text-greyPrimary sm:text-center">
              {t("landingHome.section4.text")}
            </p>
            <Link href="https://lin.ee/9b2UE3T" className="flex items-center gap-5">
              <Button
                variant="primary"
                className="py-[10px]"
                iconLeft={<Line className="stroke-none" />}
              >
                {t("ui.connectViaLine")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <section className="w-full py-[96px] bg-darkPrimary md:py-[60px] sm:py-[60px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm flex justify-between gap-[60px] sm:flex-col sm:items-center sm:gap-10">
          <div className="w-1/2 flex flex-col items-start sm:w-full">
            <h3 className="text-white">
              {t.rich("landingHome.section5.title", {
                purple: (text) => <span className="text-purplePrimary">{text}</span>,
              })}
            </h3>
            <p className="mt-6 text-white">{t("landingHome.section5.text")}</p>
            <div className="mt-9 flex justify-start items-center gap-12 sm:flex-col sm:gap-6">
              <div className="flex items-center gap-5">
                <span className="text-[42px] font-bold text-purplePrimary">
                  {t("landingHome.section5._2k")}
                </span>
                <p className="text-sm text-white">
                  {t.rich("landingHome.section5.smsCreated", {
                    br: () => <br />,
                  })}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <span className="text-[42px] font-bold text-white">
                  {t("landingHome.section5._100")}
                </span>
                <p className="text-sm text-white">
                  {t.rich("landingHome.section5.emailSent", {
                    br: () => <br />,
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="w-[55%] sm:w-full">
            <Image src={Image5} alt="Bowers" />
          </div>
        </div>
      </section>
      {/* <Pricing /> */}
      {/* <section className="w-full pt-[96px] pb-[320px] bg-white md:pt-[60px] sm:pt-[60px] sm:pb-[280px]">
        <div className="max-w-content mx-auto px-[200px] md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm text-center">
          <h3>
            Trusted by <span className="text-purplePrimary">100+</span> World Class <br />{" "}
            Spa & Salon
          </h3>
          <div className="w-full mt-16 flex justify-between items-stretch gap-5 sm:mt-12 sm:flex-col sm:items-center">
            <div className="p-8 flex flex-col justify-start items-center rounded-xl shadow-sm border border-greyBackground">
              <div className="w-[90px] h-[90px] rounded-full">
                <Image src={Image7_1} alt="Bowers" />
              </div>
              <p className="mt-8">
                “Booking my salon appointment through Bowers was so easy! I love how fast
                and simple the process is.”
              </p>
              <p className="mt-16 text-lg font-bold">Korn Kijwattanapong</p>
            </div>
            <div className="p-8 flex flex-col justify-start items-center rounded-xl shadow-sm border border-greyBackground">
              <div className="w-[90px] h-[90px] rounded-full">
                <Image src={Image7_2} alt="Bowers" />
              </div>
              <p className="mt-8">
                “Booking appointments has never been this simple. Bowers makes everything
                so efficient, and my staff loves it too!”
              </p>
              <p className="mt-16 text-lg font-bold">Peter Peekanone</p>
            </div>
            <div className="p-8 flex flex-col justify-start items-center rounded-xl shadow-sm border border-greyBackground">
              <div className="w-[90px] h-[90px] rounded-full">
                <Image src={Image7_3} alt="Bowers" />
              </div>
              <p className="mt-8">
                “I managed to find the perfect time slot in just a few clicks—Bowers makes
                scheduling a breeze!”
              </p>
              <p className="mt-16 text-lg font-bold">Vivat Chaivikrai</p>
            </div>
          </div>
        </div>
      </section> */}
      <section className="absolute bottom-[100px] w-full">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="py-[80px] flex flex-col items-center text-center rounded-xl px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm sm:py-[60px] bg-purplePrimary">
            <h3 className="text-white">
              {t.rich("landingHome.purpleSection.title", {
                br: () => <br />,
              })}
            </h3>
            <p className="mt-6 text-white">{t("landingHome.purpleSection.text")}</p>
            <div className="mt-9 flex justify-center gap-4 sm:flex-col">
              <Link href="https://lin.ee/9b2UE3T" className="flex items-center gap-5">
                <Button
                  variant="dark"
                  className="py-[10px]"
                  iconLeft={<Line className="stroke-none" />}
                >
                  {t("ui.connectViaLine")}
                </Button>
              </Link>
              {/* <Link href="/sign-up" className="flex items-center gap-5">
                <Button
                  variant="dark-outline"
                  iconLeft={<PersonIcon className="stroke-darkPrimary" />}
                >
                  {t("ui.getStarted")}
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </section>
      <div className="w-full h-[520px] bg-darkPrimary"></div>
    </div>
  );
};

export default HomePageScene;
