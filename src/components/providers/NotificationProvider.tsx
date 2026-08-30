"use client";

import { PropsWithChildren, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import {
  AppNotification,
  BookingCreatedNotification,
  NOTIFICATION_EVENT,
  NotificationType,
} from "@/api/entities/notification";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { toaster } from "@/components/ui/toaster";
import { BookingCreatedToast } from "../ui/toaster/components/BookingCreatedToast";

const getBookingMessage = ({ data }: BookingCreatedNotification) => {
  const time = TIME_SLOTS.find((slot) => slot.slot === data.slots[0])?.label;
  const dateAndTime = time ? `${data.date} at ${time}` : data.date;

  return `New booking from ${data.customerName} on ${dateAndTime}`;
};

const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const accessToken = session?.error ? undefined : session?.accessToken;

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl || !accessToken) return;

    const socket = io(`${apiUrl.replace(/\/+$/, "")}/notifications`, {
      auth: { token: accessToken },
      autoConnect: false,
      reconnection: true,
      transports: ["websocket"],
    });

    const handleNotification = (notification: AppNotification) => {
      if (notification.type !== NotificationType.BOOKING_CREATED) return;

      const { companyId } = notification.data;

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["all_bookings", companyId] }),
        queryClient.invalidateQueries({ queryKey: ["bookings", companyId] }),
        queryClient.invalidateQueries({ queryKey: ["bookings_min", companyId] }),
        queryClient.invalidateQueries({ queryKey: ["customers", companyId] }),
        queryClient.invalidateQueries({
          queryKey: ["sales_and_customer_stat", companyId],
        }),
      ]);

      toaster.success(<BookingCreatedToast notification={notification} />, {
        toastId: notification.id,
        autoClose: 8000,
        disableIcon: true,
      });
    };

    socket.on(NOTIFICATION_EVENT, handleNotification);
    socket.connect();

    return () => {
      socket.off(NOTIFICATION_EVENT, handleNotification);
      socket.disconnect();
    };
  }, [accessToken, queryClient]);

  return children;
};

export default NotificationProvider;
