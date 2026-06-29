"use client";

import { PropsWithChildren } from "react";

const SceneTitle = ({ children }: PropsWithChildren) => {
  return <h5 className="text-xl font-bold text-nowrap">{children}</h5>;
};

export default SceneTitle;
