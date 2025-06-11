import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { useNotification } from "@/app/context/NotificationContext";

const MobileFooter = () => {
  const router = useRouter();
   const {unreadCount} = useNotification();
  return (
    <div className="bg-white bg-no-repeat custom-dropshadow footer-bg dark:bg-slate-700 flex justify-around items-center backdrop-filter backdrop-blur-[40px] fixed left-0 w-full z-[9999] bottom-0 py-[12px] px-4">
      <Link href="chat">
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
         ${
           router.pathname === "chat"
             ? "text-primary-500"
             : "dark:text-white text-slate-900"
         }
          `}
          >
            <Icon icon="heroicons-outline:home" />
          </span>
          <span
            className={` block text-[11px]
          ${
            router.pathname === "chat"
              ? "text-primary-500"
              : "text-slate-600 dark:text-slate-300"
          }
          `}
          >
            Dashboard
          </span>
        </div>
      </Link>
      <Link href="chat">
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
         ${
           router.pathname === "chat"
             ? "text-primary-500"
             : "dark:text-white text-slate-900"
         }
          `}
          >
            <Icon icon="heroicons-outline:tag" />
          </span>
          <span
            className={` block text-[11px]
          ${
            router.pathname === "chat"
              ? "text-primary-500"
              : "text-slate-600 dark:text-slate-300"
          }
          `}
          >
            Ads
          </span>
        </div>
      </Link>

      <Link href="chat">
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
         ${
           router.pathname === "chat"
             ? "text-primary-500"
             : "dark:text-white text-slate-900"
         }
          `}
          >
            <Icon icon="heroicons-outline:rectangle-stack" />
          </span>
          <span
            className={` block text-[11px]
          ${
            router.pathname === "chat"
              ? "text-primary-500"
              : "text-slate-600 dark:text-slate-300"
          }
          `}
          >
            Categories
          </span>
        </div>
      </Link>
      
      <Link href="notifications">
        <div>
          <span
            className={` relative cursor-pointer rounded-full text-[20px] flex flex-col items-center justify-center mb-1
      ${
        router.pathname === "notifications"
          ? "text-primary-500"
          : "dark:text-white text-slate-900"
      }
          `}
          >
            <Icon icon="heroicons-outline:bell" />
            <span className="absolute right-[17px] lg:top-0 -top-2 h-4 w-4 bg-red-500 text-[8px] font-semibold flex flex-col items-center justify-center rounded-full text-white z-[99]">
              {unreadCount}
            </span>
          </span>
          <span
            className={` block text-[11px]
         ${
           router.pathname === "notifications"
             ? "text-primary-500"
             : "text-slate-600 dark:text-slate-300"
         }
        `}
          >
            Notifications
          </span>
        </div>
      </Link>
    </div>
  );
};

export default MobileFooter;
