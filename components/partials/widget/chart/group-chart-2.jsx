"use client"
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useEffect, useState } from "react";

const getRandomColor = () => {
  const bgColors = [
    "bg-[#EEF1F9]", "bg-[#FFC155]", "bg-[#FFEDE5]", "bg-[#FFEDE6]"
  ];
  const textColors = [
    "text-black"
  ];

  // Get random background and text colors
  const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
  const randomText = textColors[Math.floor(Math.random() * textColors.length)];

  return { randomBg, randomText };
};
const GroupChart2 = () => {
  const [colors, setColors] = useState({ randomBg: "bg-gray-500", randomText: "text-white" });

  useEffect(() => {
    const { randomBg, randomText } = getRandomColor();
    setColors({ randomBg, randomText });
  }, []);
  return (
          <Card bodyClass="pt-4 pb-3 px-4">
            <div className="flex space-x-3 rtl:space-x-reverse">
              <div className="flex-none">
              <div className={`h-12 w-12 rounded-full flex flex-col items-center justify-center text-2xl ${colors.randomBg} ${colors.randomText}`}>
      <Icon icon="heroicons:cube" />
    </div>
              </div>
              <div className="flex-1">
                <div className="text-slate-600 dark:text-slate-300 text-sm mb-1 font-medium">
                  abc
                </div>
                <div className="text-slate-900 dark:text-white text-lg font-medium">
                  def
                </div>
              </div>
            </div>
          </Card>
  );
};

export default GroupChart2;
