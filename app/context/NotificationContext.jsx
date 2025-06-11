// context/NotificationContext.jsx
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { getUnreadNotificationCount } from "@/lib/api";

const NotificationContext = createContext({
  unreadCount: 0,
  refreshCount: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadNotificationCount();
      setUnreadCount(res.data?.count || 0);
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, refreshCount: fetchUnreadCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
