"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/button";
import PersonIcon from "@/components/ui/icons/Person";
import TextField from "@/components/ui/inputs/TextField";
import { CATEGORIES, QUESTIONS } from "@/constants/supportPageData";

const SupportScene = () => {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  const category = useMemo(() => params.get("category"), [params]);
  const search = useMemo(() => params.get("search"), [params]);

  const { register, watch, setValue, formState } = useForm<{
    search: string;
  }>({
    mode: "onChange",
  });

  useEffect(() => {
    if (!category) {
      const queryString = new URLSearchParams(params);
      queryString.set("category", CATEGORIES[0].id);

      router.replace(`${pathname}?${queryString.toString()}`);
    }
  }, []);

  useEffect(() => {
    if (search) {
      setValue("search", search);
    }
  }, []);

  useEffect(() => {
    const searchValue = watch("search");
    if (searchValue) {
      const queryString = new URLSearchParams(params);
      queryString.set("search", searchValue);

      router.push(`?${queryString.toString()}`);
    } else {
      const queryString = new URLSearchParams(params);
      queryString.delete("search");

      router.push(`?${queryString.toString()}`);
    }
  }, [watch("search")]);

  const selectCategoryHandler = (categoryId: string) => {
    const queryString = new URLSearchParams(params);
    queryString.set("category", categoryId);

    router.push(`?${queryString.toString()}`);
  };

  return (
    <div className="relative w-full min-h-screenExHeaderAndFooter">
      <section className="w-full pt-10 pb-20 bg-white">
        <div className="max-w-content mx-auto px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm">
          <div className="pt-16 pb-10 flex flex-col items-center rounded-xl bg-greyBackgroundLight">
            <h4 className="text-[32px]">Hello, how can we help?</h4>
            <p className="mt-1 text-sm text-greyPrimary">
              Type your question or search keyword
            </p>
            <div className="w-1/2 mt-3">
              <TextField
                id="search"
                type="text"
                placeholder="Start typing..."
                register={register}
                error={formState.errors.search}
                iconLeft={<PersonIcon />}
              />
            </div>
            <div className="mt-12 flex items-center gap-2">
              {CATEGORIES.map((c) => (
                <Button
                  key={c.id}
                  className="!px-8 py-[9px]"
                  variant={c.id === category ? "resting-active" : "resting"}
                  onClick={() => selectCategoryHandler(c.id)}
                >
                  {c.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="mt-12 flex justify-evenly">
            {QUESTIONS.map((q) => (
              <div key={q.title} className="flex flex-col">
                <Image src={q.image} alt="Bowers" />
                <h5 className="mt-10 mb-2">{q.title}</h5>
                {q.questions.map((sq) => (
                  <Link
                    key={sq.title}
                    className="mt-4 text-greyPrimary transition-all hover:text-purplePrimary"
                    href=""
                  >
                    {sq.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportScene;
