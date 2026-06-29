/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";

import Button from "@/components/ui/button";
import CheckmarkCircle from "@/components/ui/icons/CheckmarkCircle";

import Image1 from "@/assets/services_page_section_1.png";
import Image2_1 from "@/assets/services_page_section_2_1.png";
import Image2_2 from "@/assets/services_page_section_2_2.png";
import Image2_3 from "@/assets/services_page_section_2_3.png";
import Image3_1 from "@/assets/services_page_section_3_1.png";
import Image3_2 from "@/assets/services_page_section_3_2.png";
import Image3_3 from "@/assets/services_page_section_3_3.png";
import SettingsIcon from "@/components/ui/icons/Settings";
import ChartLineIcon from "@/components/ui/icons/ChartLine";
import PeoplesIcon from "@/components/ui/icons/Peoples";
import PaperIcon from "@/components/ui/icons/Paper";
import LampIcon from "@/components/ui/icons/lamp";
import WindTurbineIcon from "@/components/ui/icons/WindTurbine";
import { getTranslations, Link } from "@/i18n";

const ServicesScene: any = async () => {
  const t = await getTranslations();

  return (
    <div className="relative w-full min-h-screenExHeaderAndFooter">
      <section className="w-full py-[96px] bg-purpleExtraLight sm:py-[60px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm flex justify-between items-center gap-16 md:gap-[40px] md:flex-col md:justify-center sm:flex-col sm:justify-center">
          <div className="min-w-[40%] md:flex md:flex-col md:items-center sm:flex sm:flex-col sm:items-center">
            <h2 className="md:w-[60%] md:text-center sm:text-center">
              {t.rich("landingServices.section1.title", {
                purple: (t) => <span className="text-purplePrimary">{t}</span>,
              })}
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <span className="stroke-purplePrimary">
                <CheckmarkCircle />
              </span>
              <p className="text-xl text-greyPrimary">
                {t("landingServices.section1.preTitle1")}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span className="stroke-purplePrimary">
                <CheckmarkCircle />
              </span>
              <p className="text-xl text-greyPrimary">
                {t("landingServices.section1.preTitle2")}
              </p>
            </div>
            <form className="w-full mt-9 py-2 pl-6 pr-2 flex items-center gap-4 rounded-xl bg-white">
              <input
                className="h-[45px] flex-1 outline-none"
                type="email"
                placeholder={t("landingServices.section1.form.placeholder")}
                required
              />
              <Link href="/contact">
                <Button variant="primary" type="submit">
                  {t("ui.getStartedFree")}
                </Button>
              </Link>
            </form>
          </div>
          <div className="max-w-[670px] rounded-xl overflow-hidden">
            <Image src={Image1} alt="Bowers" />
          </div>
        </div>
      </section>
      <section className="w-full py-[96px] bg-white sm:py-[60px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h3 className="text-center">
            {t.rich("landingServices.section2.title", {
              br: () => <br />,
            })}
          </h3>
          <div className="relative mt-16 flex justify-between items-start gap-5 md:flex-col md:items-center md:gap-12 sm:flex-col sm:items-center sm:gap-12">
            <div className="max-w-[360px] w-1/3 flex flex-col items-center text-center md:w-full sm:w-full">
              <Image
                className="w-full rounded-xl border shadow-primary border-purpleExtraLight"
                src={Image2_1}
                alt="Bowers"
              />
              <p className="mt-6 text-xl font-bold">
                {t("landingServices.section2.items.item1.title")}
              </p>
              <p className="mt-3 w-2/3 text-greyPrimary">
                {t("landingServices.section2.items.item1.text")}
              </p>
            </div>
            <div className="max-w-[360px] w-1/3 flex flex-col items-center text-center md:w-full sm:w-full">
              <Image
                className="w-full rounded-xl border shadow-primary border-purpleExtraLight"
                src={Image2_2}
                alt="Bowers"
              />
              <p className="mt-6 text-xl font-bold">
                {t("landingServices.section2.items.item2.title")}
              </p>
              <p className="mt-3 w-2/3 text-greyPrimary">
                {t("landingServices.section2.items.item2.text")}
              </p>
            </div>
            <div className="max-w-[360px] w-1/3 flex flex-col items-center text-center md:w-full sm:w-full">
              <Image
                className="w-full rounded-xl shadow-primary border border-purpleExtraLight"
                src={Image2_3}
                alt="Bowers"
              />
              <p className="mt-6 text-xl font-bold">
                {t("landingServices.section2.items.item3.title")}
              </p>
              <p className="mt-3 w-2/3 text-greyPrimary">
                {t("landingServices.section2.items.item3.text")}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-[96px] bg-darkPrimary sm:py-[60px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h3 className="text-center text-white">
            {t("landingServices.section3.title")}
          </h3>
          <div className="mt-20 flex justify-between items-center gap-[100px] sm:flex-col sm:gap-[60px]">
            <Image
              className="max-w-[550px] w-[40%] sm:w-full"
              src={Image3_1}
              alt="Bowers"
            />
            <div className="w-[50%] flex flex-col items-start sm:w-full">
              <h5 className="text-[32px] sm:text-center text-white">
                {t("landingServices.section3.item1.title")}
              </h5>
              <p className="mt-6 sm:text-center text-white">
                {t("landingServices.section3.item1.test")}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="stroke-purplePrimary">
                  <CheckmarkCircle />
                </span>
                <p className="text-xl text-white">
                  {t("landingServices.section3.item1.listItem1")}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="stroke-purplePrimary">
                  <CheckmarkCircle />
                </span>
                <p className="text-xl text-white">
                  {t("landingServices.section3.item1.listItem2")}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="stroke-purplePrimary">
                  <CheckmarkCircle />
                </span>
                <p className="text-xl text-white">
                  {t("landingServices.section3.item1.listItem3")}
                </p>
              </div>
              <Link href="/contact">
                <Button variant="primary" className="mt-8">
                  {t("ui.getStartedFree")}
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-20 flex justify-between items-center gap-[100px] sm:flex-col-reverse sm:gap-[60px]">
            <div className="w-1/2 flex flex-col items-start sm:w-full">
              <h5 className="text-[32px] sm:text-center text-white">
                {t("landingServices.section3.item2.title")}
              </h5>
              <p className="mt-6 sm:text-center text-white">
                {t("landingServices.section3.item2.test")}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="stroke-purplePrimary">
                  <CheckmarkCircle />
                </span>
                <p className="text-xl text-white">
                  {t("landingServices.section3.item2.listItem1")}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="stroke-purplePrimary">
                  <CheckmarkCircle />
                </span>
                <p className="text-xl text-white">
                  {t("landingServices.section3.item2.listItem2")}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="stroke-purplePrimary">
                  <CheckmarkCircle />
                </span>
                <p className="text-xl text-white">
                  {t("landingServices.section3.item2.listItem3")}
                </p>
              </div>
              <Link href="/contact">
                <Button variant="primary" className="mt-8 sm:ml-auto">
                  {t("ui.getStartedFree")}
                </Button>
              </Link>
            </div>
            <Image
              className="max-w-[550px] w-[40%] sm:w-full"
              src={Image3_2}
              alt="Bowers"
            />
          </div>
          <div className="mt-20 flex justify-between items-center gap-[100px] sm:flex-col sm:gap-[60px]">
            <Image
              className="max-w-[550px] w-[40%] rounded-xl sm:w-full"
              src={Image3_3}
              alt="Bowers"
            />
            <div className="w-1/2 flex flex-col items-start sm:w-full">
              <h5 className="text-[32px] sm:text-center text-white">
                {t("landingServices.section3.item3.title")}
              </h5>
              <p className="mt-6 sm:text-center text-white">
                {t("landingServices.section3.item3.test")}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <span className="stroke-purplePrimary">
                  <CheckmarkCircle />
                </span>
                <p className="text-xl text-white">
                  {t("landingServices.section3.item3.listItem1")}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="stroke-purplePrimary">
                  <CheckmarkCircle />
                </span>
                <p className="text-xl text-white">
                  {t("landingServices.section3.item3.listItem2")}
                </p>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <span className="stroke-purplePrimary">
                  <CheckmarkCircle />
                </span>
                <p className="text-xl text-white">
                  {t("landingServices.section3.item3.listItem3")}
                </p>
              </div>
              <Link href="/contact">
                <Button variant="primary" className="mt-8">
                  {t("ui.getStartedFree")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-[96px] bg-greyBackgroundLight sm:py-[60px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <h3 className="text-center">{t("landingServices.featuresSection.title")}</h3>
          <div className="mt-16 flex justify-between flex-wrap gap-y-20 gap-x-5 sm:flex-nowrap sm:flex-col sm:items-center sm:gap-12">
            <div className="max-w-[315px] flex flex-col items-start sm:items-center sm:text-center">
              <SettingsIcon className="stroke-redPrimary" />
              <h5 className="mt-6">
                {t("landingServices.featuresSection.items.1.title")}
              </h5>
              <p className="mt-3 text-greyPrimary">
                {t("landingServices.featuresSection.items.1.text")}
              </p>
            </div>
            <div className="max-w-[315px] flex flex-col items-start sm:items-center sm:text-center">
              <ChartLineIcon className="fill-greenPrimary stroke-greenPrimary" />
              <h5 className="mt-6">
                {t("landingServices.featuresSection.items.2.title")}
              </h5>
              <p className="mt-3 text-greyPrimary">
                {t("landingServices.featuresSection.items.2.text")}
              </p>
            </div>
            <div className="max-w-[315px] flex flex-col items-start sm:items-center sm:text-center">
              <PeoplesIcon className="fill-bluePrimary stroke-bluePrimary" />
              <h5 className="mt-6">
                {t("landingServices.featuresSection.items.3.title")}
              </h5>
              <p className="mt-3 text-greyPrimary">
                {t("landingServices.featuresSection.items.3.text")}
              </p>
            </div>
            <div className="max-w-[315px] flex flex-col items-start sm:items-center sm:text-center">
              <PaperIcon />
              <h5 className="mt-6">
                {t("landingServices.featuresSection.items.4.title")}
              </h5>
              <p className="mt-3 text-greyPrimary">
                {t("landingServices.featuresSection.items.4.text")}
              </p>
            </div>
            <div className="max-w-[315px] flex flex-col items-start sm:items-center sm:text-center">
              <LampIcon className="" />
              <h5 className="mt-6">
                {t("landingServices.featuresSection.items.5.title")}
              </h5>
              <p className="mt-3 text-greyPrimary">
                {t("landingServices.featuresSection.items.5.text")}
              </p>
            </div>
            <div className="max-w-[315px] flex flex-col items-start sm:items-center sm:text-center">
              <WindTurbineIcon className="text-greenPrimary" />
              <h5 className="mt-6">
                {t("landingServices.featuresSection.items.6.title")}
              </h5>
              <p className="mt-3 text-greyPrimary">
                {t("landingServices.featuresSection.items.6.text")}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 w-full py-[112px] bg-white sm:py-[80px]">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="py-20 px-5 flex flex-col items-center rounded-xl text-center bg-purplePrimary sm:py-16">
            <h3 className="text-white">{t("landingServices.purpleSection.title")}</h3>
            <p className="mt-6 text-center text-white">
              {t.rich("landingServices.purpleSection.title", {
                br: () => <br />,
              })}
            </p>
            <Link href="/contact">
              <Button className="mt-9" variant="dark">
                {t("landingServices.purpleSection.btn")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <div className="w-full h-[80px] bg-darkPrimary"></div>
    </div>
  );
};

export default ServicesScene;
