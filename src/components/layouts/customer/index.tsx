"use client";

import { signOut } from "next-auth/react";
import type { PropsWithChildren } from "react";
import CalendarIcon from "@/components/ui/icons/Calendar";
import GridIcon from "@/components/ui/icons/Grid";
import PersonIcon from "@/components/ui/icons/Person";
import LogoFullIcon from "@/components/ui/icons/LogoFull";
import { Link, usePathname, useRouter, useTranslations } from "@/i18n";
import { useAppSession } from "@/hooks/useAppSession";

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
  const displayName = session?.user?.firstName || session?.user?.email;

  const switchToBusiness = () => {
    document.cookie = "portal_mode=business; Path=/; SameSite=Lax";
    router.push(
      activeMembership?.roles.includes("OWNER") ? "/dashboard" : "/booking-management"
    );
  };

  const navigation = (
    <nav
      aria-label={t("navigation.label")}
      className="flex items-center gap-1 lg:flex-col lg:items-stretch"
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
            className={`group relative flex min-w-0 flex-1 items-center justify-center gap-3 rounded-[18px] px-3 py-2.5 text-sm font-bold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-2 lg:flex-none lg:justify-start lg:px-4 lg:py-3.5 sm:flex-col sm:gap-1 sm:px-1 sm:py-1.5 sm:text-[11px] ${
              active
                ? "bg-darkPrimary text-white"
                : "text-greyPrimary hover:bg-greyBackground hover:text-darkPrimary"
            }`}
          >
            <span
              className={`flex size-8 shrink-0 items-center justify-center rounded-full transition-colors lg:size-9 ${
                active
                  ? "bg-purplePrimary text-white"
                  : "bg-greyBackground text-greyPrimary group-hover:bg-white group-hover:text-purplePrimary"
              }`}
            >
              <Icon className={active ? "stroke-white" : "stroke-current"} />
            </span>
            <span className="max-w-full truncate">{t(`navigation.${route.key}`)}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F6F6FB] pb-[calc(82px+env(safe-area-inset-bottom))] text-darkPrimary lg:pb-0">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[276px] flex-col border-r border-greyOutlineSecondary bg-white px-5 py-7 lg:flex">
        <Link
          href="/cabinet"
          className="mb-10 inline-flex w-fit rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-4"
        >
          <LogoFullIcon className="max-w-[154px]" />
        </Link>

        {navigation}

        <div className="mt-auto border-t border-greyOutlineSecondary pt-5">
          <p className="truncate px-3 text-sm font-bold">{displayName}</p>
          <p className="mt-1 px-3 text-xs text-greyPrimary">
            {t("navigation.customerPortal")}
          </p>
          {activeMembership ? (
            <button
              type="button"
              className="mt-4 w-full rounded-xl border border-greyOutlineSecondary px-3 py-2.5 text-left text-sm font-bold outline-none transition-colors hover:border-purplePrimary hover:text-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary"
              onClick={switchToBusiness}
            >
              {t("navigation.businessPortal")}
            </button>
          ) : null}
          <button
            type="button"
            className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm text-greyPrimary outline-none transition-colors hover:bg-greyBackground hover:text-darkPrimary focus-visible:ring-2 focus-visible:ring-purplePrimary"
            onClick={() => void signOut({ callbackUrl: "/sign-in" })}
          >
            {t("navigation.signOut")}
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-[70px] items-center border-b border-greyOutlineSecondary bg-white/95 px-5 backdrop-blur lg:hidden">
        <Link
          href="/cabinet"
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary lg:hidden"
        >
          <LogoFullIcon className="max-w-[124px]" />
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <div className="text-right lg:hidden">
            <p className="max-w-[150px] truncate text-sm font-bold">{displayName}</p>
            <p className="text-xs text-greyPrimary">{t("navigation.customerPortal")}</p>
          </div>
          {activeMembership ? (
            <button
              type="button"
              className="hidden rounded-xl border border-greyOutlineSecondary bg-white px-3 py-2 text-sm font-bold outline-none transition-colors hover:border-purplePrimary hover:text-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary md:block lg:hidden"
              onClick={switchToBusiness}
            >
              {t("navigation.businessPortal")}
            </button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-8 py-10 lg:ml-[276px] lg:px-12 lg:py-12 sm:px-4 sm:py-7">
        {children}
      </main>

      <div className="fixed inset-x-3 bottom-3 z-30 rounded-[22px] border border-greyOutlineSecondary bg-white/95 p-1.5 shadow-[0_14px_40px_rgba(28,29,33,0.14)] backdrop-blur lg:hidden sm:bottom-[calc(10px+env(safe-area-inset-bottom))]">
        {navigation}
      </div>
    </div>
  );
}
