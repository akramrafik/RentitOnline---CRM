import React from "react"; 
import Card from "@/components/ui/Card"; 
import ReactSelect from "@/components/partials/froms/ReactSelect"; 
import Icon from "@/components/ui/Icon";
import { useEffect, useState } from "react";

const getRandomColor = () => {
  const bgColors = [
      "bg-[#4e8bb7]", "bg-[#6096be]","bg-[#72a2c6]","bg-[#84adcd]"
  ];
  const textColors = [
    "text-white"
  ];

  // Get random background and text colors
  const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
  const randomText = textColors[Math.floor(Math.random() * textColors.length)];

  return { randomBg, randomText };
};
const CategoryInsightFilter = () => { 
    const [colors, setColors] = useState({ randomBg: "bg-gray-500", randomText: "text-white" });
  
    useEffect(() => {
      const { randomBg, randomText } = getRandomColor();
      setColors({ randomBg, randomText });
    }, []);
  return(
    <div className="space-y-5">
        <Card>
            <div className="grid grid-cols-3 gap-5">
                <div>
                    <ReactSelect 
                    placeholder="Choose Category" />
                </div>
                <div>
                    <ReactSelect 
                    placeholder="Choose Emirate" />
                </div>
                <div>
                    <ReactSelect
                    placeholder="Choose Location" />
                </div>
            </div>
            <div className="grid xl:grid-cols-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
         
      </div>
        </Card>
        <div className="grid xl:grid-cols-6 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        <Card bodyClass="pt-4 pb-3 px-4">
            <div className="flex space-x-3 rtl:space-x-reverse">
              <div className="flex-none">
              <div className={`h-12 w-12 rounded-full flex flex-col items-center justify-center text-2xl ${colors.randomBg} ${colors.randomText}`}>
              <Icon icon="heroicons:circle-stack" />
              </div>
              </div>
              <div className="flex-1">
                <div className="text-slate-600 dark:text-slate-300 text-sm mb-1 font-medium">
                Economy cars
                </div>
                <div className="text-slate-900 dark:text-white text-lg font-medium">
                4
                </div>
              </div>
            </div>
          </Card>
      </div>
    </div>
    ); }; export default CategoryInsightFilter;


