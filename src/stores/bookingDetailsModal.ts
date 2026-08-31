import { create } from "zustand";

type BookingDetailsModalStore = {
  selectedBookingId: string | null;
  openBookingDetails: (bookingId: string) => void;
  closeBookingDetails: () => void;
};

export const useBookingDetailsModalStore = create<BookingDetailsModalStore>()((set) => ({
  selectedBookingId: null,
  openBookingDetails: (selectedBookingId) => set({ selectedBookingId }),
  closeBookingDetails: () => set({ selectedBookingId: null }),
}));
