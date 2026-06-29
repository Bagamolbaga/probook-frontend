import { formatCurrency } from "@/utils/formatCurrency";
import React from "react";

const PriceCell = ({ value }: { value: number | string }) => {
  return (
    <div className="h-full flex items-center text-base">{formatCurrency(value)}</div>
  );
};

export default PriceCell;
