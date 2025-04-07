import React from "react";
import dynamic from "next/dynamic";
import { colors } from "@/constant/data";

const OrderChart = ({
  className = "bg-slate-50 dark:bg-slate-900 rounded pt-3 px-4",
  barColor = colors.warning,
}) => {

  return (
    <div className="grid xl:grid-cols-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
    <div className={className}>
      <div className="text-sm text-slate-600 dark:text-slate-300 mb-[6px]">
        Orders
      </div>
      <div className="text-lg text-slate-900 dark:text-white font-medium mb-[6px]">
        123k
      </div>
    </div>
     </div>
  );
};

export default OrderChart;
