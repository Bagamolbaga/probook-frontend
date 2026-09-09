import { MAIN_NAVIGATION } from "@/constants/navigations";
import React, { useMemo } from "react";
import NavItem from "./NavItem";
import { useTranslations } from "next-intl";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import Image from "next/image";
import Spinner from "../ui/loaders/Spinner";
import { usePathname } from "@/i18n";
import { isOwnerMembership } from "@/utils/permissions";

const MobileSidebar = () => {
  const t = useTranslations();
  const { companyId, activeCompany } = useGetCompanyId();
  const isOwner = isOwnerMembership(activeCompany);
  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });

  const MAIN_NAVIGATION_i18n = useMemo(
    () =>
      MAIN_NAVIGATION.filter((item) =>
        isOwner
          ? true
          : item.path === "/booking-creation" || item.path === "/booking-management"
      ).map((i) => ({
        ...i,
        label: t(`navigation.sidebar.${i.i18_id}` as any),
      })),
    [isOwner, t]
  );

  const renderLogoIcon = () => {
    if (getCompanyDetailsQuery.isPending) {
      return <Spinner color="white" className="w-[30px] h-[30px]" />;
    }

    if (getCompanyDetailsQuery.data?.logo) {
      return (
        <Image
          className="w-full h-full object-cover"
          src={getCompanyDetailsQuery.data.logo}
          width={30}
          height={30}
          alt={getCompanyDetailsQuery.data.name}
        />
      );
    }

    return (
      <span className="text-base font-bold text-white">
        {getCompanyDetailsQuery.data?.name[0]}
      </span>
    );
  };

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 w-full h-[64px] flex justify-evenly bg-darkPrimary">
      {MAIN_NAVIGATION_i18n.map((i) => (
        <NavItem key={i.path} mobile {...i} />
      ))}
      <NavItem
        mobile
        label={getCompanyDetailsQuery.data?.name || ""}
        path="/account"
        icon={() => renderLogoIcon()}
        isActive={usePathname().includes("/account")}
      />
    </div>
  );
};

export default MobileSidebar;
