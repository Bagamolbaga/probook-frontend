"use client";

import { useTranslations } from "next-intl";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { cn } from "@/utils/cn";

type Props = {
  className?: string;
};

const CompanySelector = ({ className }: Props) => {
  const t = useTranslations();
  const { companyId, companies, setActiveCompanyId } = useGetCompanyId();

  if (companies.length <= 1) return null;

  return (
    <label className={cn("min-w-[180px]", className)}>
      <span className="sr-only">{t("navigation.sidebar.activeCompany")}</span>
      <select
        className="w-full rounded-lg border border-greyOutlineSecondary bg-white px-3 py-2 text-sm text-darkPrimary"
        value={companyId}
        onChange={(event) => setActiveCompanyId(event.target.value)}
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name || company.id}
          </option>
        ))}
      </select>
    </label>
  );
};

export default CompanySelector;
