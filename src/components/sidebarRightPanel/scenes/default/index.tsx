"use client";

import { useMemo } from "react";
import Image from "next/image";

import { cn } from "@/src/utils/cn";
import { useGetCompanyDetailsQuery } from "@/src/api/queries/company";
import Header from "../../Header";
import MockAvatar from "@/src/assets/home_page_section_7_3.png";
import LogoIcon from "@/src/components/ui/icons/LogoIcon";
import { useAppSession } from "@/src/hooks/useAppSession";
import { useGetCompanyId } from "@/src/hooks/useGetCompanyId";

export const DefaultHeader = () => {
  const { data: session } = useAppSession();
  const {companyId} = useGetCompanyId()
  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({companyId});

  const avatarSrc = session?.user?.avatar ? session?.user?.avatar : MockAvatar;
  const address = useMemo(() => {
    if (getCompanyDetailsQuery?.data?.address) {
      const arr = getCompanyDetailsQuery?.data?.address.split(",");

      return [arr[0], arr.at(-1)].join(", ");
    }
  }, [getCompanyDetailsQuery?.data?.address]);

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
              <LogoIcon className="w-full h-full" />
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
