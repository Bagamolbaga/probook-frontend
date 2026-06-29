import Image from "next/image";

import Button from "@/components/ui/button";
import LogoCircleIcon from "@/components/ui/icons/LogoCircle";
import { Link } from "@/i18n";
import { cn } from "@/utils/cn";
import { toSlug } from "@/utils/toSlug";
import { useState } from "react";
import { useGetCompaniesQuery } from "@/api/queries/company";
import { format } from "date-fns";
import MainLoader from "@/components/ui/loaders/MainLoader";

type Preset = {
  title: string;
  prevDays: number;
};

const PRESETS: Preset[] = [
  {
    title: "1 Day",
    prevDays: 1,
  },
  {
    title: "7 Days",
    prevDays: 7,
  },
  {
    title: "30 Days",
    prevDays: 30,
  },
];

const TopServiceProviders = () => {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);

  const getTopCompaniesQuery = useGetCompaniesQuery({
    queryParams: {
      limit: "8",
      offset: "0",
      order_by: "bookings_count",
      date_from: format(
        new Date(Date.now() - selectedPreset.prevDays * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      ),
      date_to: format(new Date(), "yyyy-MM-dd"),
    },
  });

  return (
    <div className="w-full py-10 overflow-hidden">
      <div className="flex items-center justify-between sm:flex-col sm:items-start">
        <h4 className="text-[32px] leading-[42px] font-bold">Top Service Providers</h4>
        <div className="flex items-center gap-[6px] sm:w-full sm:mt-4 sm:justify-end">
          {PRESETS.map((preset) => (
            <Button
              key={preset.prevDays}
              variant={
                preset.prevDays === selectedPreset.prevDays
                  ? "primary-resting"
                  : "resting-active"
              }
              className={cn("!py-[10px] !px-7 !rounded-full", {
                "": !true,
              })}
              onClick={() => setSelectedPreset(preset)}
            >
              {preset.title}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-3 justify-between gap-y-5 gap-x-[10%] md:grid-cols-2 sm:grid-cols-1 sm:gap-y-1">
        {getTopCompaniesQuery.isLoading && (
          <div className="col-span-3 text-center">
            <MainLoader />
          </div>
        )}
        {getTopCompaniesQuery.data?.results.map((c, idx) => (
          <Link
            href={`/company/${toSlug(c.name)}?storeId=${c._id}`}
            key={c._id}
            className="max-w-[320px] py-2 px-3 flex items-center gap-[14px] rounded-lg transition-all border border-transparent hover:border-purplePrimary sm:max-w-full"
          >
            <p className="font-medium">{idx + 1}</p>
            <div className="relative min-w-20 size-20 flex items-center justify-center rounded-xl overflow-hidden border border-[#ECECF2]">
              {c.logo ? (
                <Image className="object-cover" fill src={c.logo} alt={`${c.name} - Bowers`} />
              ) : (
                <LogoCircleIcon fillColor="fill-darkPrimary" className="!size-14" />
              )}
            </div>
            <div>
              <h6 className="text-base font-bold text-neutral-900">{c.name}</h6>
              <p className="mt-1 text-sm text-greyPrimary">{c.city}, Russia</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopServiceProviders;
