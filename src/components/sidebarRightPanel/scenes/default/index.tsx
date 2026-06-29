"use client";

import { useMemo } from "react";
import Image from "next/image";

import { cn } from "@/utils/cn";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import Header from "../../Header";
import MockAvatar from "@/assets/home_page_section_7_3.png";
import LogoCircleIcon from "@/components/ui/icons/LogoCircle";
import { useAppSession } from "@/hooks/useAppSession";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

export const DefaultHeader = () => {
  const { data: session } = useAppSession();
  const {companyId} = useGetCompanyId()
  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({companyId});

  const avatarSrc = session?.user?.avatar ? session?.user?.avatar : MockAvatar;
  const address = useMemo(() => {
    if (getCompanyDetailsQuery?.data?.address1) {
      const arr = getCompanyDetailsQuery?.data?.address1.split(",");

      return [arr[0], arr.at(-1)].join(", ");
    }
  }, [getCompanyDetailsQuery?.data?.address1]);

  return (
    <Header>
      <div className="flex items-center gap-3">
        <div
          className={cn("w-9 h-9 rounded-md overflow-hidden bg-greyBackgroundLight", {
            "bg-darkPrimary": !session?.user?.avatar,
          })}
        >
          {!session?.user?.avatar ? (
            <div className="w-full h-full p-1 overflow-hidden">
              <LogoCircleIcon className="w-full h-full" />
            </div>
          ) : (
            <Image width={36} height={36} src={avatarSrc} alt={"Bowers"} />
          )}
        </div>
        <div>
          <span className="block text-sm font-bold text-nowrap">
            {getCompanyDetailsQuery.data?.name}
          </span>
          <span className="block text-xs text-greyPrimary">{address}</span>
        </div>
      </div>
    </Header>
  );
};
