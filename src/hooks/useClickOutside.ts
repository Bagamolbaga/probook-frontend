/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { RefObject, useCallback, useEffect } from "react";

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T> | RefObject<T>[],
  callback: () => void,
  options?: { ignoreClasses: string[] }
) => {
  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as Node;

    let isOutside: boolean | null = null;

    if (Array.isArray(ref)) {
      isOutside = ref
        .filter((r) => Boolean(r.current))
        .every((r) => r.current && !r.current.contains(target));

      if (options?.ignoreClasses) {
        //@ts-ignore
        isOutside = !options.ignoreClasses.some((cn) => target.classList.contains(cn));
      }
    } else {
      isOutside = ref.current && !ref.current.contains(target);
    }

    if (isOutside) {
      callback();
    }
  }, [callback, options?.ignoreClasses, ref])

  useEffect(() => {
    typeof window !== "undefined" &&
      typeof window.document !== "undefined" &&
      window.document.addEventListener("click", handleClick, true);
    return () => {
      typeof window !== "undefined" &&
        typeof window.document !== "undefined" &&
        window.document.removeEventListener("click", handleClick);
    };
  }, [handleClick]);
};
