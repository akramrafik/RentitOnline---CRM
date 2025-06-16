'use client'
import React, {use, useCallback, useEffect, useState} from "react";
import { useParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { meets, files } from "@/constant/data";
import CalendarView from "@/components/partials/widget/CalendarView";
import { getAdById } from "@/lib/api";
import ImageSlider from "./ImageSlider";

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const [images, setImages] = useState([])
  const [data, setdata] = useState()

  const fetchAd = useCallback(async () => {
  try {
    const response = await getAdById({ ad_id: 188975 });
    setdata (response.data?.data)
    setImages(response?.data?.data?.images);
    console.log("Fetched ad data:", response.data?.data);
  } catch (error) {
    console.error("Error fetching ad details:", error);
  }
}, []);


 useEffect(() => {
    fetchAd();
  }, [fetchAd]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5 w-full">
  {/* Left column - 40% (2 out of 5 columns) */}
  <div className="md:col-span-2 space-y-5">
    <Card title="Images">
    <ImageSlider images={images} />
    </Card>

    <Card title="Property Info">
     <ul className="divide-y divide-slate-100 dark:divide-slate-700">
        {meets.slice(0, 3).map((item, i) => (
          <li key={i} className="block py-[10px]">
            <div className="flex space-x-2 rtl:space-x-reverse">
              <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                <div className="flex-none">
                  <div className="h-8 w-8">
                    <img
                      src={item.img}
                      alt=""
                      className="block w-full h-full object-cover rounded-full border hover:border-white border-transparent"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="block text-slate-600 text-sm dark:text-slate-300 mb-1 font-medium">
                    {item.title}
                  </span>
                  <span className="flex font-normal text-xs dark:text-slate-400 text-slate-500">
                    <span className="text-base inline-block mr-1">
                      <Icon icon="heroicons-outline:video-camera" />
                    </span>
                    {item.meet}
                  </span>
                </div>
              </div>
              <div className="flex-none">
                <span className="block text-xs text-slate-600 dark:text-slate-400">{item.date}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      
    </Card>
  </div>
  <div className="md:col-span-3">
    <Card title="Ad Details">
    {data ? (
        <>
        <div className=" text-xl font-medium text-slate-800 dark:text-slate-100 mb-3">
        {data?.title} 
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">
         {data?.description}
      </p>
      <div className="flex flex-wrap mt-8">
        <div className="xl:mr-8 mr-4 mb-3 space-y-1">
          <div className="font-semibold text-slate-500 dark:text-slate-400">
            Mobile Number
          </div>
          <div className="flex items-center space-x-2 text-lg font-normal text-primary-700 dark:text-slate-300 rtl:space-x-reverse">
            {data?.contact?.phone}
          </div>
        </div>
        <div className="xl:mr-8 mr-4 mb-3 space-y-1">
          <div className="font-semibold text-slate-500 dark:text-slate-400">
           Whatsapp
          </div>
          <div className="flex items-center space-x-2 text-lg font-normal text-primary-700 dark:text-slate-300 rtl:space-x-reverse">
            {data?.contact?.whatsapp}
          </div>
        </div>
      </div>
      <div className="bg-slate-100 dark:bg-slate-700 rounded px-4 pt-4 pb-1 flex flex-wrap justify-between mt-6">
        <div className="mr-3 mb-3 space-y-2">
  <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
    Status
  </div>
  <div>
    {(() => {
      const statusMap = {
        "Under review": "bg-orange-100 text-orange-800",
        "Active": "bg-green-100 text-green-800",
        "In Draft": "bg-gray-600 text-white",
        "Payment Pending": "bg-amber-100 text-amber-800",
        "Rejected": "bg-red-100 text-red-800",
        "DLD Failed": "bg-pink-100 text-pink-800",
        "Expired": "bg-slate-100 text-slate-800",
      };
      const label = data?.status?.current_status || "Unknown";
      const classes = statusMap[label] || "bg-slate-100 text-slate-800";
      return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${classes}`}>
          {label}
        </span>
      );
    })()}
  </div>
</div>

        <div className="mr-3 mb-3 space-y-2">
          <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Category
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300">{data?.category?.main}</div>
        </div>
      </div>
      </>
    ) : (
        <div>Loading....</div>
    )}
     
    </Card>
  </div>
</div>
  );
};

export default ProjectDetailsPage;
