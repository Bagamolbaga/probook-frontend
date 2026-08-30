export const NOTIFICATION_EVENT = "notification";

export enum NotificationType {
  BOOKING_CREATED = "booking.created",
}

export type NotificationEnvelope<TType extends NotificationType, TData> = {
  id: string;
  type: TType;
  occurredAt: string;
  data: TData;
};

export type BookingCreatedNotification = NotificationEnvelope<
  NotificationType.BOOKING_CREATED,
  {
    bookingId: string;
    companyId: string;
    companyName: string;
    customerName: string;
    specialistName: string;
    serviceNames: string[];
    date: string;
    slots: number[];
    totalPrice: number;
    status: string;
  }
>;

export type AppNotification = BookingCreatedNotification;
