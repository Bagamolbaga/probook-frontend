"use client";

import { FC, PropsWithChildren } from "react";
import { Link, usePathname } from "@/i18n";
import MoneyIcon from "@/components/ui/icons/Money";
import PersonIcon from "@/components/ui/icons/Person";
import { cn } from "@/utils/cn";
import DeleteIcon from "@/components/ui/icons/Delete";
import { signOut } from "next-auth/react";
import MainPagesTitle from "@/components/mainPagesTitle";
import SuperAdminChecker from "@/components/superAdminChecker";
import { useStore } from "zustand";
import { useSuperAdminStore } from "@/stores/superAdmin";

const NAVIGATION: NavigationItemProps[] = [
  {
    title: "General information",
    desc: "Profile foto, name & language",
    href: "/account",
    icon: PersonIcon,
  },
  // {
  //   title: "Security",
  //   desc: "Password & security questions",
  //   href: "/account/security",
  //   icon: PersonIcon,
  // },
  {
    title: "Billing",
    desc: "Setup payment methods",
    href: "/account/billing",
    icon: MoneyIcon,
  },
  // {
  //   title: "Language",
  //   desc: "Setup site language",
  //   href: "/account/language",
  //   icon: MoneyIcon,
  // },
  {
    title: "Notifications",
    desc: "Set your notifications",
    href: "/account/notifications",
    icon: MoneyIcon,
  },
];

type NavigationItemProps = {
  title: string;
  desc: string;
  href: string;
  icon: any;
};

const NavigationItem: FC<NavigationItemProps> = ({ title, desc, href, icon: Icon }) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "w-full px-8 py-4 flex items-center gap-5 border-b border-greyOutlineSecondary last:border-none"
      )}
    >
      <Icon
        className={cn("w-6 h-7 stroke-greyPrimary", {
          "stroke-purplePrimary": isActive,
        })}
      />
      <div>
        <p
          className={cn("text-sm font-bold", {
            "text-purplePrimary": isActive,
          })}
        >
          {title}
        </p>
        <p className="text-xs text-greyPrimary">{desc}</p>
      </div>
    </Link>
  );
};

const AccountLayout = ({ children }: PropsWithChildren) => {
  const setSelectCompany = useStore(useSuperAdminStore, st => st.setSelectCompany)
  const logoutHandler = () => {
    setSelectCompany(undefined)
    void signOut();
  };

  return (
    <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline">
      <div className="pb-6 flex justify-between items-center">
        <MainPagesTitle text="Account" />
      </div>
      <div className="w-full min-h-[calc(100vh-62px-52px)] py-7 px-[30px] flex items-stretch gap-[30px] rounded-xl bg-white md:flex-col-reverse sm:flex-col-reverse">
        <SuperAdminChecker>
          <>
            {children}
            <div className="min-w-[280px] flex flex-col justify-between">
              <div className="w-full flex flex-col rounded-xl border border-greyOutlineSecondary">
                {NAVIGATION.map((i) => (
                  <NavigationItem key={i.href} {...i} />
                ))}
              </div>
              <div
                className="w-full py-6 px-8 flex items-center gap-5 rounded-xl transition-all cursor-pointer border border-greyOutlineSecondary hover:border-greyPrimary md:mt-3 sm:mt-3"
                onClick={logoutHandler}
              >
                <DeleteIcon className="stroke-redPrimary" />
                <div className="flex flex-col">
                  <p className="text-sm font-bold">Log out</p>
                  <p className="text-xs text-greyPrimary">Log out current account</p>
                </div>
              </div>
            </div>
          </>
        </SuperAdminChecker>
      </div>
    </div>
  );
};

export default AccountLayout;
