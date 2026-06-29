"use client";

import Image from "next/image";
import Header from "../../Header";
import { useAppSession } from "@/hooks/useAppSession";
import MockAvatar from "@/assets/home_page_section_7_3.png";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import NoteIcon from "@/components/ui/icons/Note";
import Badge from "@/components/ui/badge";
import LogoCircleIcon from "@/components/ui/icons/LogoCircle";
import { cn } from "@/utils/cn";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

export const AccountHeader = () => {
  const { data: session } = useAppSession();
  const avatarSrc = session?.user?.avatar ? session?.user?.avatar : MockAvatar;

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
            {`${session?.user?.first_name} ${session?.user?.last_name}`}
          </span>
          <span className="block text-xs text-greyPrimary text-nowrap">
            UI/UX Designer
          </span>
        </div>
      </div>
    </Header>
  );
};

export const AccountScene = () => {
  const { data: session } = useAppSession();
  const { companyId } = useGetCompanyId();

  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({
    companyId,
  });

  return (
    <div className="h-full flex flex-col overflow-x-hidden overflow-y-auto">
      <p className="text-sm font-bold">About</p>
      <p className="text-sm text-greyPrimary">
        Color is so powerful that it can persuade, motivate, inspire and touch people’s
        soft spot the heart. This is the reason why understanding colors is pretty crucial
        in relating.
      </p>
      <div className="mt-6">
        <p className="text-sm font-bold">Members</p>
        <div className="w-full flex gap-1">
          {getCompanySpecialistsQuery.data?.results.map((s) => (
            <div key={s.id} className="w-9 h-9 rounded-md overflow-hidden">
              {!s.specialist_details.avatar ? (
                <div className="w-full h-full bg-greyBackgroundLight"></div>
              ) : (
                <Image
                  width={36}
                  height={36}
                  src={s.specialist_details.avatar ? MockAvatar : MockAvatar}
                  alt={s.full_name}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <p className="text-sm font-bold">Contact details</p>
        <div className="w-full mt-4 flex flex-col gap-5">
          <div className="w-full flex items-center gap-3">
            <NoteIcon />
            <p>{session?.user?.email}</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-sm font-bold">Categories</p>
        <div className="w-full mt-3 flex flex-wrap gap-1">
          <Badge
            rounded="default"
            variant="secondary"
            color="grey"
            textBold
            className="w-fit px-5 py-2"
          >
            Designer
          </Badge>
          <Badge
            rounded="default"
            variant="secondary"
            color="grey"
            textBold
            className="w-fit px-5 py-2"
          >
            Developer
          </Badge>
        </div>
      </div>
      <div className="mt-8">
        <p className="text-sm font-bold">Overall progress</p>
        <div className="w-full pt-[18px] mt-3 px-5 pb-6 flex flex-col bg-greyBackgroundLight/40">
          <div className="flex items-center justify-between">
            <p className="text-sm">Tasks</p>
            <p className="text-sm text-greyPrimary">
              <span className="font-bold text-darkPrimary">96</span> / 148
            </p>
          </div>
          <div className="relative w-full h-1 mt-3 rounded bg-greyOutline">
            <div
              className="absolute top-0 left-0 h-full rounded bg-purplePrimary"
              style={{ width: "75%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
