"use client";

import { signOut } from "next-auth/react";
import { Bell, Search } from "lucide-react";
import type { PropsWithChildren } from "react";
import CalendarIcon from "@/src/components/ui/icons/Calendar";
import GridIcon from "@/src/components/ui/icons/Grid";
import LogoFullIcon from "@/src/components/ui/icons/LogoFull";
import PersonIcon from "@/src/components/ui/icons/Person";
import { useAppSession } from "@/src/hooks/useAppSession";
import { Link, usePathname, useRouter, useTranslations } from "@/src/i18n";
import { cn } from "@/src/utils/cn";

const routes = [
  { href: "/cabinet", key: "dashboard", icon: GridIcon },
  { href: "/cabinet/bookings", key: "bookings", icon: CalendarIcon },
  { href: "/cabinet/profile", key: "profile", icon: PersonIcon },
] as const;

export default function CustomerLayout({ children }: PropsWithChildren) {
  const t = useTranslations("customerCabinet");
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useAppSession();
  const activeMembership = session?.user?.memberships?.find(
    (membership) => membership.status === "ACTIVE"
  );
  const displayName =
    session?.user?.firstName || session?.user?.email || t("navigation.customerPortal");

  const switchToBusiness = () => {
    document.cookie = "portal_mode=business; Path=/; SameSite=Lax";
    router.push(
      activeMembership?.roles.includes("OWNER") ? "/dashboard" : "/booking-management"
    );
  };

  const navigation = (
    <nav
      aria-label={t("navigation.label")}
      className="flex items-center justify-around gap-1 lg:flex-col lg:items-stretch lg:justify-start lg:gap-2"
    >
      {routes.map((route) => {
        const active =
          route.href === "/cabinet"
            ? pathname === route.href
            : pathname.startsWith(route.href);
        const Icon = route.icon;
        return (
          <Link
            key={route.href}
            href={route.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-[54px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 text-[9px] font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-purplePrimary lg:h-12 lg:flex-none lg:flex-row lg:justify-start lg:gap-3 lg:py-3 lg:text-sm ${active ? "bg-greyOutline text-darkPrimary" : "text-greyPrimary hover:bg-greyBackground hover:text-darkPrimary"}`}
          >
            <span
              className={`flex size-5 shrink-0 items-center justify-center ${active ? "text-purplePrimary" : "text-greyPrimary"}`}
            >
              <Icon className={active ? "stroke-purplePrimary" : "stroke-greyPrimary"} />
            </span>
            <span className="truncate">{t(`navigation.${route.key}`)}</span>
          </Link>
        );
      })}
      <Link
        href="/search"
        className="flex h-[54px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-3 text-[9px] font-bold text-greyPrimary outline-none hover:bg-greyBackground hover:text-darkPrimary focus-visible:ring-2 focus-visible:ring-purplePrimary lg:hidden"
      >
        <Search className="size-5" />
        <span>{t("navigation.find")}</span>
      </Link>
    </nav>
  );

  return (
    <div
      className={cn(
        "min-h-screen overflow-auto bg-greyBackgroundLight text-darkPrimary",
        "lg:grid lg:h-dvh lg:grid-cols-[244px_minmax(0,1fr)]",
        "md:flex md:flex-col"
      )}
    >
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-greyOutline bg-white px-5 py-[30px] lg:flex">
        <Link
          href="/cabinet"
          className="mb-[34px] inline-flex w-fit rounded-lg px-2 outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary"
        >
          <LogoFullIcon className="max-w-[136px]" />
        </Link>
        {navigation}
        <Link
          href="/search"
          className="mt-6 flex h-12 items-center justify-center rounded-full bg-purplePrimary px-4 text-sm font-bold text-white outline-none hover:bg-purplePrimary_hover focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-2"
        >
          {t("common.findService")}
        </Link>
        <div className="mt-auto space-y-3">
          {activeMembership && (
            <button
              type="button"
              onClick={switchToBusiness}
              className="w-full rounded-xl bg-greyBackgroundLight p-3 text-left outline-none hover:bg-greyOutline focus-visible:ring-2 focus-visible:ring-purplePrimary"
            >
              <span className="block text-[10px] font-bold uppercase tracking-[0.07em] text-greyPrimary">
                {t("navigation.companyAccess")}
              </span>
              <span className="mt-1 block text-sm font-bold">
                {t("navigation.businessPortal")} →
              </span>
            </button>
          )}
          <div className="flex items-center gap-2 px-1">
            <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-purpleExtraLight font-bold text-purplePrimary">
              {displayName.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{displayName}</span>
              <span className="block text-xs text-greyPrimary">
                {t("navigation.customerPortal")}
              </span>
            </span>
            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/sign-in" })}
              className="rounded-md px-1 text-greyPrimary outline-none hover:text-redPrimary focus-visible:ring-2 focus-visible:ring-purplePrimary"
              aria-label={t("navigation.signOut")}
            >
              ↗
            </button>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-[68px] items-center border-b border-greyOutline bg-white px-[18px] lg:hidden">
        <Link href="/cabinet">
          <LogoFullIcon className="max-w-[108px]" />
        </Link>
        <div className="ml-auto flex gap-2">
          <Link
            href="/search"
            aria-label={t("common.findService")}
            className="flex size-[38px] items-center justify-center rounded-full bg-greyBackgroundLight outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary"
          >
            <Search className="size-[17px]" />
          </Link>
          <button
            type="button"
            aria-label={t("navigation.notifications")}
            className="flex size-[38px] items-center justify-center rounded-full bg-greyBackgroundLight outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary"
          >
            <Bell className="size-[17px]" />
          </button>
        </div>
      </header>
      <main
        className={cn(
          "min-w-0 px-7 py-7 flex min-h-[860px]",
          "lg:overflow-hidden",
          "md:flex-1 md:pt-5 md:px-5 md:pb-[calc(76px+4px)]",
          "sm:px-4 sm:pb-[90px] sm:pt-4"
        )}
      >
        {children}
      </main>
      <div className="fixed inset-x-0 bottom-0 z-30 h-[76px] border-t border-greyOutline bg-white px-3 pb-2.5 pt-2 lg:hidden">
        {navigation}
      </div>
    </div>
  );
}
