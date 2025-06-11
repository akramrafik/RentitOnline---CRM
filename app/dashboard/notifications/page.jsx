"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Menu } from "@headlessui/react";
import Card from "@/components/ui/Card";
import { getNotifications } from "@/lib/api";
import TablePagination from "@/components/partials/TablePagination";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const NotificationPage = () => {
  const [notifications,setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false)
  const colors = [
  "bg-[#4285F4]", // Blue
  "bg-[#DB4437]", // Red
  "bg-[#F4B400]", // Yellow
  "bg-[#0F9D58]", // Green
  "bg-[#AB47BC]", // Purple
  "bg-[#00ACC1]", // Teal/Cyan
  "bg-[#FF7043]", // Orange
];
const searchParams = useSearchParams();
const router = useRouter();
const initialPage = parseInt(searchParams.get("page") || "1", 10) - 1;
const [currentPage, setCurrentPage] = useState(initialPage);

const SkeletonItem = () => (
  <div className="block w-full px-4 py-2 cursor-pointer animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-700"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
        <div className="h-3 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

  const fetchNotifications = async (page = 0) => {
    setLoading(true);
    try{
      const response = await getNotifications({page : page + 1});
      setNotifications(response.data || []);
    //  setCurrentPage(response.meta?.current_page - 1 || 0);
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
    fetchNotifications(currentPage);
  }, [currentPage]);

  useEffect(() => {
  const newPage = parseInt(searchParams.get("page") || "1", 10) - 1;
  if (newPage !== currentPage) setCurrentPage(newPage);
}, [searchParams]);

// useEffect(() => {
//     // Ensure ?page=1 is in the URL if missing
//     if (!searchParams.get("page")) {
//       const newSearchParams = new URLSearchParams(searchParams.toString());
//       newSearchParams.set("page", "1");
//       router.replace(`?${newSearchParams.toString()}`);
//     }
//   }, []);

  return (
    <div>
      <Card bodyClass="p-0">
        <div className="flex justify-between px-4 py-4 border-b border-slate-100 dark:border-slate-600">
          <div className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-6">
            All Notifications
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <Menu as={Fragment}>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonItem key={i} />)
              :notifications?.map((item, i) => (
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
                      <div className="flex flex-1 justify-between">
                      <div>
                        <div
                          className={`${
                            active
                              ? "text-slate-600 dark:text-slate-300"
                              : " text-slate-600 dark:text-slate-300"
                          } text-sm font-medium`}
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
                        </div>
                        <div>
                        <div className="text-slate-400 dark:text-slate-400 text-xs mt-1">
                          {item.type}
                        </div>
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
          </Menu>
        </div>
        {/* Pagination */}
        <div className="px-4 py-3 flex justify-center border-t border-slate-100 dark:border-slate-600">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              const newSearchParams = new URLSearchParams(searchParams.toString());
              newSearchParams.set("page", page + 1);
              router.push(`?${newSearchParams.toString()}`);
              setCurrentPage(page);
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default NotificationPage;
