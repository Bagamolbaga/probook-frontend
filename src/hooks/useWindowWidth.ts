"use client";

import { useState, useEffect } from "react";

const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window?.innerWidth : 1024
  );
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desctop">(() => {
    const width = typeof window !== "undefined" ? window?.innerWidth : 1024;

    if (width >= 1024) {
      return "desctop";
    }

    if (width >= 769 && width < 1024) {
      return "tablet";
    }

    if (width < 769) {
      return "mobile";
    }

    return "desctop";
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      setWidth(width);
      if (width >= 1024) {
        setDeviceType("desctop");
      }

      if (width >= 769 && width < 1024) {
        setDeviceType("tablet");
      }

      if (width < 769) {
        setDeviceType("mobile");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    width,
    deviceType,
    smallerThanDesctop: deviceType === "tablet" || deviceType === "mobile",
    tabletOrMobile: deviceType === "tablet" || deviceType === "mobile",
  };
};

export default useWindowWidth;
