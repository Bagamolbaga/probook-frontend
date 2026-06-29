import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";

const TimeCell = ({ value }: { value: number }) => {
  return <div className="h-full flex items-center text-base">{value} mins</div>;
};

export default TimeCell;
