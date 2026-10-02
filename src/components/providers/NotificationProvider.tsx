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
} from "@/src/api/entities/notification";
import {
  BOOKING_UPDATED_EVENT,
  COMPANY_DATA_UPDATED_EVENT,
  BookingUpdatedEvent,
  CompanyDataUpdatedEvent,
} from "@/src/api/entities/realtime";
import { invalidateCompanyBookingQueries } from "@/src/api/queries/booking/cache";
import { invalidateCompanyDataQueries } from "@/src/api/queries/company/cache";
import { TIME_SLOTS } from "@/src/constants/timeSlots";
import { toaster } from "@/src/components/ui/toaster";
import { BookingCreatedToast } from "../ui/toaster/components/BookingCreatedToast";

const getBookingMessage = ({ data }: BookingCreatedNotification) => {
  const time = TIME_SLOTS.find((slot) => slot.slot === data.slots[0])?.label;
  const dateAndTime = time ? `${data.date} at ${time}` : data.date;

  return `New booking from ${data.customerName} on ${dateAndTime}`;
};

const showSocketEventToast = (eventName: string, eventId: string) => {
  console.log({ eventName, eventId });
  toaster.success(`Socket event: ${eventName}`, {
    toastId: `socket:${eventId}`,
    autoClose: 4000,
    disableIcon: true,
  });
};

const SOCKET_READY_EVENT = "socket.ready";

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

    socket.on("connect", () => {
      console.info("[socket] connected", socket.id);
      toaster.success("Socket connected", {
        toastId: `socket:connected:${socket.id}`,
        autoClose: 4000,
        disableIcon: true,
      });
    });
    socket.on("connect_error", (error) => {
      console.error("[socket] connection error", error.message);
    });
    socket.on("disconnect", (reason) => {
      console.warn("[socket] disconnected", reason);
    });
    socket.on("notification.error", (error) => {
      console.error("[socket] authorization error", error);
    });
    const logReceivedEvent = (eventName: string, ...args: unknown[]) => {
      console.log("[socket] received", eventName, args);
    };
    socket.onAny(logReceivedEvent);

    const handleSocketReady = (event: { companyIds: string[]; userId: string }) => {
      console.info("[socket] ready", event);
      toaster.success(`Socket ready: ${event.companyIds.join(", ")}`, {
        toastId: `socket:ready:${event.userId}`,
        autoClose: 4000,
        disableIcon: true,
      });
    };

    const handleNotification = (notification: AppNotification) => {
      showSocketEventToast(NOTIFICATION_EVENT, notification.id);
      if (notification.type !== NotificationType.BOOKING_CREATED) return;

      const { companyId } = notification.data;

      void invalidateCompanyBookingQueries(queryClient, companyId);

      toaster.success(<BookingCreatedToast notification={notification} />, {
        toastId: notification.id,
        autoClose: 8000,
        disableIcon: true,
      });
    };

    const handleBookingUpdated = (event: BookingUpdatedEvent) => {
      showSocketEventToast(BOOKING_UPDATED_EVENT, event.id);
      void invalidateCompanyBookingQueries(queryClient, event.companyId, event.bookingId);
    };

    const handleCompanyDataUpdated = (event: CompanyDataUpdatedEvent) => {
      showSocketEventToast(COMPANY_DATA_UPDATED_EVENT, event.id);
      void invalidateCompanyDataQueries(queryClient, event.companyId, event.entity);
    };

    socket.on(NOTIFICATION_EVENT, handleNotification);
    socket.on(BOOKING_UPDATED_EVENT, handleBookingUpdated);
    socket.on(SOCKET_READY_EVENT, handleSocketReady);
    socket.on(COMPANY_DATA_UPDATED_EVENT, handleCompanyDataUpdated);
    socket.connect();

    return () => {
      socket.off(NOTIFICATION_EVENT, handleNotification);
      socket.off(BOOKING_UPDATED_EVENT, handleBookingUpdated);
      socket.off(COMPANY_DATA_UPDATED_EVENT, handleCompanyDataUpdated);
      socket.off(SOCKET_READY_EVENT, handleSocketReady);
      socket.offAny(logReceivedEvent);
      socket.disconnect();
    };
  }, [accessToken, queryClient]);

  return children;
};

export default NotificationProvider;
