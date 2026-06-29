/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Syne } from "next/font/google";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Link, usePathname, useRouter, useTranslations } from "@/i18n";
import { cn } from "@/utils/cn";

import { TTimeSlot } from "@/constants/timeSlots";

import {
  useGetCompaniesQuery,
  useSearchCompaniesQuery,
  useSearchServicesAndStoresQuery,
} from "@/api/queries/company";
import Slider from "./components/Slider";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { PREVIOUSLY_BOOKED_SERVICES } from "@/constants/keys";
import Button from "@/components/ui/button";
import ServiceTypesPreview from "./components/sections/ServiceTypesPreview";
import TopServiceProviders from "./components/sections/TopServiceProviders";
import LogoFullIcon from "@/components/ui/icons/LogoFull";
import ChangeLanguage from "@/components/ui/button/ChangeLanguage";
import Search from "./components/Search";
import BGPattern from "@/assets/search/serviceTypesPreview/bg_pattern_large.png";

import CircleImgLeft1 from "@/assets/search/mainSectionCircles/left_1.jpg";
import CircleImgLeft2 from "@/assets/search/mainSectionCircles/left_2.jpg";
import CircleImgLeft3 from "@/assets/search/mainSectionCircles/left_3.jpg";
import CircleImgRight1 from "@/assets/search/mainSectionCircles/right_1.jpg";
import CircleImgRight2 from "@/assets/search/mainSectionCircles/right_2.jpg";
import CircleImgRight3 from "@/assets/search/mainSectionCircles/right_3.jpg";
import Figure1 from "@/assets/search/figures/figure_1.png";
import Figure2 from "@/assets/search/figures/figure_2.png";
import Figure3 from "@/assets/search/figures/figure_3.png";
import FindedStores from "./components/sections/FindedStores";
import FindedStoresMobile from "./components/sections/FindedStores/FindedStoresMobile";

const syne = Syne({ weight: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

export type TLocation = {
  address1: string | undefined;
  address2: string | undefined;
  city: string | undefined;
  country: {
    code: string;
    name: string;
  };
  initial: {
    address1: string | undefined;
    address2: string | undefined;
    country:
      | {
          code: string;
          name: string;
        }
      | undefined;
    city: string | undefined;
  };
};

export type SearchForm = {
  search?: string;
  serviceTypes: TServiceType[];
  date?: Date;
  time?: {
    from: TTimeSlot;
    to: TTimeSlot;
  };
  _formInHeader?: boolean;
};

const SearchPageScene = () => {
  const t = useTranslations();
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const search = useMemo(() => params.get("search"), [params]);
  const category = useMemo(() => params.get("category"), [params]);
  const location = useMemo(() => params.get("location"), [params]);
  const date = useMemo(() => params.get("date"), [params]);
  const timeFrom = useMemo(() => params.get("time_from"), [params]);
  const timeTo = useMemo(() => params.get("time_to"), [params]);

  const findedStoresTopElementRef = useRef<HTMLDivElement>(null);

  const isHaveSearchParams = search || category || location || date || timeFrom || timeTo;

  const form = useForm<SearchForm>({
    mode: "onSubmit",
    defaultValues: {
      serviceTypes: [],
    },
  });

  // useEffect(() => {
  //   if (isHaveSearchParams) {
  //     console.log("scroll");
  //     // resultContainerRef.current.scrollIntoView()
  //     window?.scrollTo({
  //       top: 800,
  //       behavior: "smooth"
  //     })
  //   }
  // }, [isHaveSearchParams])

  // useEffect(() => {
  //   const queryString = new URLSearchParams(params);

  //   if (!search) {
  //     queryString.delete("search");
  //   } else {
  //     form.setValue("search", search);
  //   }

  //   // if (!category) {
  //   //   queryString.delete("category");
  //   //   form.setValue("category", { id: "ALL", name: "All categories" });
  //   // } else {
  //   //   const finded = (getCompanyServicesTypesQuery.data?.results || []).find((c) => c.name === category);

  //   //   if (finded) {
  //   //     form.setValue("category", {id: finded.name, name: finded.name});  //TODO use TServiceType_new
  //   //   }
  //   // }

  //   if (!location) {
  //     queryString.delete("location");
  //   } else {
  //     form.setValue("location", location);
  //   }

  //   if (!date) {
  //     queryString.delete("date");
  //   } else {
  //     form.setValue("date", parse(date, "dd-MM-yyyy", new Date()));
  //   }

  //   if (!timeFrom) {
  //     queryString.delete("time_from");
  //   } else {
  //     const findedTime = TIME_SLOTS.find((s) => s.label === timeFrom);
  //     if (findedTime) {
  //       form.setValue("time.from", { id: findedTime.label, ...findedTime });
  //     }
  //   }

  //   if (!timeTo) {
  //     queryString.delete("time_to");
  //   } else {
  //     const findedTime = TIME_SLOTS.find((s) => s.label === timeTo);
  //     if (findedTime) {
  //       form.setValue("time.to", { id: findedTime.label, ...findedTime });
  //     }
  //   }

  //   router.replace(`${pathname}?${queryString.toString()}`);
  // }, [params, category, date, location, search, timeFrom, timeTo]);

  // useEffect(() => {
  //   const searchValue = form.watch("search");
  //   const categoryValue = form.watch("category");
  //   const locationValue = form.watch("location");
  //   const dateValue = form.watch("date");
  //   const timeFrom = form.watch("time.from");
  //   const timeTo = form.watch("time.to");
  //   const queryString = new URLSearchParams(params);

  //   if (searchValue) {
  //     queryString.set("search", searchValue);
  //   } else {
  //     queryString.delete("search");
  //   }

  //   if (categoryValue) {
  //     if (categoryValue.id === "ALL") {
  //       queryString.delete("category");
  //     } else {
  //       queryString.set("category", categoryValue.id);
  //     }
  //   } else {
  //     queryString.delete("category");
  //   }

  //   if (locationValue) {
  //     queryString.set("location", locationValue);
  //   } else {
  //     queryString.delete("location");
  //   }

  //   if (dateValue) {
  //     queryString.set("date", format(dateValue, "dd-MM-yyyy"));
  //   } else {
  //     queryString.delete("date");
  //   }

  //   if (timeFrom) {
  //     queryString.set("time_from", timeFrom.label);
  //   } else {
  //     queryString.delete("time_from");
  //   }

  //   if (timeTo) {
  //     queryString.set("time_to", timeTo.label);
  //   } else {
  //     queryString.delete("time_to");
  //   }

  //   form.formState.submitCount && router.push(`?${queryString.toString()}`);
  // }, [form.formState.submitCount]);

  const [isClickedSearchBtn, setIsClickedSearchBtn] = useState(false);
  const [selectedPresetTitle, setSelectedPresetTitle] = useState<string>();

  const [pagination, setPagination] = useState({
    limit: 8,
    offset: 0,
  });

  const [prevBookedServiceToLocalStorage] = useLocalStorage(
    PREVIOUSLY_BOOKED_SERVICES,
    [] as TService[]
  );

  const getTopTrendingCompaniesQuery = useGetCompaniesQuery({
    queryParams: {
      limit: "8",
      offset: "0",
      order_by: "most_recent_booking",
    },
  });

  const getNewestCompaniesQuery = useGetCompaniesQuery({
    queryParams: {
      limit: "8",
      offset: "0",
      ordering: "-id",
    },
  });

  const isShowFindedStores = useMemo(() => {
    if (isClickedSearchBtn) return true;

    return !!Object.keys(form.formState.dirtyFields).filter((k) => k !== "_formInHeader")
      .length;
  }, [isClickedSearchBtn, form.formState.dirtyFields]);

  const searchServicesAndStoresQuery = useSearchCompaniesQuery({
    query: {
      ...(form.watch("search") && { search: form.watch("search") }),
      ...(form.watch("serviceTypes").length && {
        type: form.watch("serviceTypes").map((st) => st.shortLabel),
      }),
      ...(form.watch("date") && { date: format(form.watch("date")!, "yyyy-MM-yy") }),
      ...(form.watch("time.from") && { start_time: form.watch("time.from.label") }),
      ...(form.watch("time.to") && { end_time: form.watch("time.to.label") }),
      limit: pagination.limit,
      offset: pagination.offset,
    },
    queryOptions: {
      enabled: isShowFindedStores,
    },
  });

  const handleSearchStores = () => {
    setIsClickedSearchBtn(true);
    searchServicesAndStoresQuery.refetch();
  };

  const handleLoadMoreStores = () => {
    setPagination((p) => ({ ...p, limit: p.limit + 8 }));
  };

  const handleSelectPreset = ({ st, title }: { st: TServiceType[]; title: string }) => {
    form.setValue("serviceTypes", st);
    setSelectedPresetTitle(title);
    setIsClickedSearchBtn(true);

    if (findedStoresTopElementRef.current) {
      window?.scrollTo({
        behavior: "smooth",
        top: findedStoresTopElementRef.current.offsetTop,
      });
    }
  };

  const [localCachedStores, setLocalCachedStores] = useState<TCompany[]>([]);

  useEffect(() => {
    if (!searchServicesAndStoresQuery.isPending) {
      setLocalCachedStores(searchServicesAndStoresQuery.data?.results || []);
    }
  }, [searchServicesAndStoresQuery]);

  const loadMoreStoresIsActive = useMemo(() => {
    if (searchServicesAndStoresQuery?.data) {
      return (
        searchServicesAndStoresQuery.data.count >
        searchServicesAndStoresQuery.data.results.length
      );
    }

    return true;
  }, [searchServicesAndStoresQuery.data]);

  return (
    <div className="relative w-full min-h-screenExHeaderAndFooter -mt-[78px] flex flex-col items-center overflow-clip bg-greyBackgroundLight">
      <div className="absolute z-[1] top-0 left-0 w-full h-screen">
        <div className="absolute z-[1] top-0 left-0 w-full h-full bg-gradient-to-t from-greyBackgroundLight to-[transparent]"></div>
        <Image fill src={BGPattern} alt="Bowers" />
      </div>

      <header
        className={cn(
          "fixed z-[100] w-full h-header text-white transition-all sm:h-[60px]",
          {
            "bg-transparent": !form.watch("_formInHeader"),
            "bg-white": form.watch("_formInHeader"),
          }
        )}
      >
        <div
          className={cn(
            "relative z-20 max-w-content h-full mx-auto flex items-center justify-between px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm"
          )}
        >
          <div className="w-[190px] h-10 cursor-pointer md:w-[140px] sm:w-[100px]">
            <Link href="/">
              <LogoFullIcon
                className="w-full transition-all"
                fillColor={form.watch("_formInHeader") ? "fill-darkPrimary" : undefined}
              />
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <ChangeLanguage />

            <Link
              href="/"
              className={cn({
                hidden: form.watch("_formInHeader"),
              })}
            >
              <Button
                variant="dark-outline"
                className="!py-3 !px-6 !border-none !rounded-full hover:text-purplePrimary"
              >
                {t("navigation.landing.header.forBusiness")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative max-w-content w-full mt-[calc(156px)]">
        <h1 className="relative z-[2] text-[80px] leading-[90px] font-extrabold text-center sm:text-[32px] sm:leading-[42px]">
          Book in Seconds <br />{" "}
          <span className="text-purplePrimary">Enjoy for Hours</span>
        </h1>
        <p className="relative z-[2] mt-10 text-[22px] text-center sm:text-base">
          Your glow is just one <span className="text-purplePrimary">booking</span> away
        </p>

        <div
          className={cn(
            "absolute z-[1] rounded-full overflow-hidden",
            "top-[10px] -left-[20px] size-[160px]",
            "md:top-[10px] md:-left-[30px] md:size-[120px]",
            "sm:top-[10px] sm:left-[10px] sm:size-[40px] "
          )}
        >
          <Image
            src={CircleImgLeft1}
            className="w-full h-full object-cover"
            alt="Bowers"
          />
        </div>
        <div
          className={cn(
            "absolute z-[1] rounded-full overflow-hidden",
            "top-[40px] left-[200px] size-[116px]",
            "md:-top-[80px] md:left-[120px] md:size-[80px]",
            "sm:-top-[40px] sm:left-[60px] sm:size-[30px]"
          )}
        >
          <Image fill src={CircleImgLeft2} className="object-cover" alt="Bowers" />
        </div>
        <div
          className={cn(
            "absolute z-[1] rounded-full overflow-hidden",
            "top-[200px] left-[160px] size-[92px]",
            "md:top-[160px] md:left-[60px] md:size-[54px]",
            "sm:top-[70px] sm:left-[30px] sm:size-[24px]"
          )}
        >
          <Image fill src={CircleImgLeft3} className="object-cover" alt="Bowers" />
        </div>

        <div
          className={cn(
            "absolute z-[1] rounded-full overflow-hidden",
            "top-[10px] -right-[20px] size-[160px]",
            "md:top-[10px] md:-right-[30px] md:size-[120px]",
            "sm:top-[10px] sm:right-[10px] sm:size-[40px] "
          )}
        >
          <Image
            src={CircleImgRight1}
            className="w-full h-full object-cover"
            alt="Bowers"
          />
        </div>
        <div
          className={cn(
            "absolute z-[1] rounded-full overflow-hidden",
            "top-[40px] right-[200px] size-[116px]",
            "md:-top-[80px] md:right-[120px] md:size-[80px]",
            "sm:-top-[40px] sm:right-[60px] sm:size-[30px]"
          )}
        >
          <Image fill src={CircleImgRight2} className="object-cover" alt="Bowers" />
        </div>
        <div
          className={cn(
            "absolute z-[1] rounded-full overflow-hidden",
            "top-[200px] right-[160px] size-[92px]",
            "md:top-[160px] md:right-[60px] md:size-[54px]",
            "sm:top-[70px] sm:right-[30px] sm:size-[24px]"
          )}
        >
          <Image fill src={CircleImgRight3} className="object-cover" alt="Bowers" />
        </div>
      </div>

      <Search
        isLoading={searchServicesAndStoresQuery.isPending}
        form={form}
        findedStores={localCachedStores}
        handleSearch={() => handleSearchStores()}
      />

      <div ref={findedStoresTopElementRef} />
      <FindedStores
        title={
          selectedPresetTitle ||
          form
            .watch("serviceTypes")
            ?.map((i) => i.shortLabel)
            .join(" & ")
        }
        isOpen={isShowFindedStores}
        isLoading={searchServicesAndStoresQuery.isPending}
        findedStores={localCachedStores}
        loadMoreIsActive={loadMoreStoresIsActive}
        handleLoadMore={handleLoadMoreStores}
      />

      <div className="hidden sm:flex">
        <FindedStoresMobile
          isOpen={isClickedSearchBtn}
          isLoading={searchServicesAndStoresQuery.isPending}
          findedStores={localCachedStores}
          form={form}
          handleClose={() => setIsClickedSearchBtn(false)}
          handleSearch={handleSearchStores}
          loadMoreIsActive={loadMoreStoresIsActive}
          handleLoadMore={handleLoadMoreStores}
        />
      </div>

      <section className="relative z-[1] w-full py-[100px]">
        <ServiceTypesPreview handleSelectPreset={handleSelectPreset} />

        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="relative w-full py-10">
            <h4 className="mb-8 text-[32px] leading-[42px] font-bold">
              Highly Recommended
            </h4>
            <Slider companies={getNewestCompaniesQuery.data?.results || []} />

            <div className="absolute -z-[1] right-[calc(100%-320px)] -bottom-[270px] size-[700px] flex items-center justify-center bg-pinkCircleGradient">
              <div className="relative size-[300px] rotate-45">
                <Image fill src={Figure1} alt="Bowers" />
              </div>
            </div>
            <div className="absolute -z-[1] left-[calc(100%-250px)] -top-[270px] size-[700px] flex items-center justify-center bg-pinkCircleGradient">
              <div className="relative size-[230px]">
                <Image fill src={Figure2} alt="Bowers" />
              </div>
            </div>
          </div>

          <TopServiceProviders />

          <div className="relative w-full py-10">
            <h4 className="mb-8 text-[32px] leading-[42px] font-bold">Top Trending</h4>
            <Slider companies={getTopTrendingCompaniesQuery.data?.results || []} />

            <div className="absolute -z-[1] left-[calc(100%-250px)] -top-[300px] size-[700px] flex items-center justify-center bg-purpleCircleGradient">
              <div className="relative size-[230px]">
                <Image fill src={Figure3} alt="Bowers" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="w-full h-20 bg-darkPrimary"></div>
    </div>
  );
};

export default SearchPageScene;
