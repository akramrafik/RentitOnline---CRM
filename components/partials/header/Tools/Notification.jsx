import React, { useState, useEffect } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { getNotifications } from "@/lib/api"; 
import { useNotification } from "@/app/context/NotificationContext";

const notifyLabel = () => {
  const {unreadCount} = useNotification();
  return (
    <span className="relative lg:h-[32px] lg:w-[32px] lg:bg-slate-100 text-slate-900 lg:dark:bg-slate-900 dark:text-white cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center">
      <Icon icon="heroicons-outline:bell" className="animate-tada" />
      <span className="absolute lg:left-0 lg:top-0 -top-2 -right-2 h-4 py-2 px-2  bg-red-500 text-[12px] font-semibold flex flex-col items-center justify-center rounded-xl text-white z-[99]">
        {unreadCount}
      </span>
    </span>
  );
};

const Notification = () => {
  const [notifications,setNotifications] = useState([])
  const [loading, setLoading] = useState(false);
  const colors = [
  "bg-[#4285F4]", // Blue
  "bg-[#DB4437]", // Red
  "bg-[#F4B400]", // Yellow
  "bg-[#0F9D58]", // Green
  "bg-[#AB47BC]", // Purple
  "bg-[#00ACC1]", // Teal/Cyan
  "bg-[#FF7043]", // Orange
];

  const fetchNotifications = async (page = 0) => {
      setLoading(true);
      try{
        const response = await getNotifications({page : page + 1});
        setNotifications(response.data || [])
        setTotalPages(response.meta?.last_page || 1);
        console.log("Current page:", response.meta?.current_page);
        console.log("Last page:", response.meta?.last_page);
  
      } catch(error){
        console.error("failed to fecth notification", error)
      }finally{
        setLoading(false);
      }
    };

    useEffect(() => {
        fetchNotifications();
      }, []);


  return (
    <Dropdown classMenuItems="md:w-[300px] top-[58px]" label={notifyLabel()}>
      <div className="flex justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-600">
        <div className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-6">
          Notifications
        </div>
        <div className="text-slate-800 dark:text-slate-200 text-xs md:text-right">
          <Link href="/dashboard/notifications" className="underline">
            View all
          </Link>
        </div>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-auto max-h-80">
        {notifications?.map((item, i) => (
          <Menu.Item key={i}>
            {({ active }) => (
              <div
                className={`${
                  active
                    ? "bg-slate-100 dark:bg-slate-700 dark:bg-opacity-70 text-slate-800"
                    : "text-slate-600 dark:text-slate-300"
                } block w-full px-4 py-2 text-sm  cursor-pointer`}
              >
                <div className="flex ltr:text-left rtl:text-right">
                  <div className="flex-none ltr:mr-3 rtl:ml-3">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold select-none ${
                colors[i % colors.length]
              }`}
            >
              {item.title.charAt(0).toUpperCase()}
            </div>
          </div>
                  <div className="flex-1">
                    <div
                      className={`${
                        active
                          ? "text-slate-600 dark:text-slate-300"
                          : " text-slate-600 dark:text-slate-300"
                      } text-sm`}
                    >
                      {item.title}
                    </div>
                    <div
                      className={`${
                        active
                          ? "text-slate-500 dark:text-slate-200"
                          : " text-slate-600 dark:text-slate-300"
                      } text-xs leading-4`}
                    >
                      {item.description}
                    </div>
                    <div className="text-slate-400 dark:text-slate-400 text-xs mt-1">
                      {item.type}
                    </div>
                  </div>
                  {item.unread && (
                    <div className="flex-0">
                      <span className="h-[10px] w-[10px] bg-danger-500 border border-white dark:border-slate-400 rounded-full inline-block"></span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Menu.Item>
        ))}
      </div>
    </Dropdown>
  );
};

export default Notification;
