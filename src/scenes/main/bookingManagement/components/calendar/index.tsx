import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  endOfWeek,
  format,
  getDaysInMonth,
  getMonth,
  getYear,
  parse,
  startOfWeek,
} from "date-fns";

import { useGetBookingsQuery } from "@/api/queries/booking";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import Button from "@/components/ui/button";
import DatePicker from "@/components/ui/DatePicker";
import PersonIcon from "@/components/ui/icons/Person";
import CalendarIcon from "@/components/ui/icons/Calendar";
import MainLoader from "@/components/ui/loaders/MainLoader";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { UpdateBookingForm } from "../components/types";
import UpdateBookingModal from "../components/UpdateBookingModal";
import ByMonth from "./ByMonth";
import ByWeek from "./ByWeek";
import { cn } from "@/utils/cn";

type TDateRangeType = "month" | "week" | "day";

const getMonthRange = (date: Date) => {
  const lastDate = getDaysInMonth(date);
  const year = getYear(date);
  const month = getMonth(date);

  return {
    from: new Date(year, month, 1),
    to: new Date(year, month, lastDate),
  };
};

const getWeekRange = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // 1 = понедельник
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return {
    from: start,
    to: end,
  };
};

const Calendar = () => {
  const { companyId } = useGetCompanyId();

  const updateBookingForm = useForm<UpdateBookingForm>({
    mode: "onChange",
    defaultValues: {
      location: "",
      companyId,
    },
  });

  const datePickerContainer = useRef<HTMLDivElement>(null);

  const [dateRangeType, setDateRangeType] = useState<TDateRangeType>("week");
  const [dateRange, setDateRange] = useState(getWeekRange(new Date()));
  const [isOpenDatepicker, setIsOpenDatepicker] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState<TSpecialist["id"][]>([]);
  const [isOpenBookingDetailModal, setIsOpenBookingDetailModal] = useState(false);

  const getBookingsQuery = useGetBookingsQuery({
    companyId,
    queryParams: {
      start_date: dateRange.from,
      end_date: dateRange.to,
    },
  });

  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({
    companyId,
  });

  const revalidateQueriesHandler = async () => {
    void getBookingsQuery.refetch();
    void getCompanySpecialistsQuery.refetch();
  };

  const closeBookingDetailModalHandler = () => {
    updateBookingForm.reset();
    setIsOpenBookingDetailModal(false);
    void revalidateQueriesHandler();
  };

  const openBookingDetailModalHandler = (booking: TApiBooking) => {
    updateBookingForm.setValue("bookingId", booking.id);
    updateBookingForm.setValue("status", booking.status);
    updateBookingForm.setValue("totalPrice", booking.totalPrice);
    updateBookingForm.setValue("createdAt", booking.createdAt);
    updateBookingForm.setValue("assignee", booking.specialist);
    updateBookingForm.setValue("customer", booking.customer);
    updateBookingForm.setValue("time", {
      start: TIME_SLOTS.find((s) => s.slot === booking.slots[0])?.label || "",
      end:
        TIME_SLOTS.find((s) => s.slot === (booking.slots.at(-1) ?? -1) + 1)?.label || "",
      slots: booking.slots,
    });
    updateBookingForm.setValue("date", parse(booking.date, "yyyy-MM-dd", new Date()));
    updateBookingForm.setValue("updatedAt", booking.updatedAt);

    updateBookingForm.setValue("services", booking.services);
    updateBookingForm.setValue(
      "servicesId",
      booking.services.map((service) => service.id)
    );

    setIsOpenBookingDetailModal(true);
  };

  const filterHandleSelectSpecialist = (id: TSpecialist["id"]) => {
    if (selectedStaffIds.includes(id)) {
      setSelectedStaffIds((prev) => prev.filter((s) => s !== id));
    } else {
      setSelectedStaffIds((prev) => [...prev, id]);
    }
  };

  const changeDateRangeType = (type: TDateRangeType) => {
    if (type === "month") {
      setDateRangeType("month");
      setDateRange(getMonthRange(new Date()));
    }

    if (type === "week") {
      setDateRangeType("week");
      setDateRange(getWeekRange(new Date()));
    }
  };

  const selectDatepickerDate = (date: Date) => {
    if (dateRangeType === "month") {
      setDateRange(getMonthRange(date));
    }

    if (dateRangeType === "week") {
      setDateRange(getWeekRange(date));
    }

    closeDatepickerHandler();
  };

  const toggleDatepickerHandler = () => setIsOpenDatepicker((p) => !p);

  const closeDatepickerHandler = () => {
    setIsOpenDatepicker(false);
  };

  const bookings = useMemo(() => {
    let arr = getBookingsQuery.data?.results || [];

    arr = arr.filter((b) => b.specialist && b.slots.length);

    if (selectedStaffIds.length) {
      arr = arr.filter((b) => selectedStaffIds.includes(b.specialist.id));
    }

    return arr;
  }, [selectedStaffIds, getBookingsQuery.data?.results]);

  const getTitleByDateRangeType = () => {
    if (dateRangeType === "month") {
      return format(dateRange.from, "MMMM yyyy");
    }

    if (dateRangeType === "week") {
      const from = format(dateRange.from, "MMMM d");
      const to = format(dateRange.to, "d");
      const year = format(dateRange.from, "yyyy");

      return `${from} - ${to}, ${year}`;
    }
  };

  const getContent = () => {
    if (dateRangeType === "month") {
      return (
        <ByMonth
          dateRange={dateRange}
          bookings={bookings}
          handleBookingClick={openBookingDetailModalHandler}
        />
      );
    }

    if (dateRangeType === "week") {
      return (
        <ByWeek
          dateRange={dateRange}
          bookings={bookings}
          staffs={
            selectedStaffIds.length
              ? getCompanySpecialistsQuery.data?.results.filter((s) =>
                  selectedStaffIds.includes(s.id)
                ) || []
              : getCompanySpecialistsQuery.data?.results || []
          }
          handleBookingClick={openBookingDetailModalHandler}
        />
      );
    }
  };

  useClickOutside(datePickerContainer, closeDatepickerHandler);

  return (
    <>
      {isOpenBookingDetailModal && (
        <UpdateBookingModal
          isOpen={isOpenBookingDetailModal}
          updateBookingForm={updateBookingForm}
          handleClose={closeBookingDetailModalHandler}
        />
      )}
      <div className="w-full h-full px-7 py-7 rounded-xl bg-white sm:px-5 sm:py-6">
        <div className="mb-5">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-[6px] sm:w-full sm:mt-2 sm:justify-end">
              <Button
                className=""
                variant={dateRangeType === "month" ? "outline" : "resting-active"}
                onClick={() => changeDateRangeType("month")}
              >
                Month
              </Button>
              <Button
                className=""
                variant={dateRangeType === "week" ? "outline" : "resting-active"}
                onClick={() => changeDateRangeType("week")}
              >
                Week
              </Button>
              <Button
                className=""
                variant={dateRangeType === "day" ? "outline" : "resting-active"}
              >
                Day
              </Button>
            </div>
            <div ref={datePickerContainer} className="relative">
              <Button
                className="w-12 !p-2"
                variant="resting-active"
                onClick={toggleDatepickerHandler}
              >
                <CalendarIcon className="" />
              </Button>

              {isOpenDatepicker && (
                <div className="absolute z-[55] top-0 right-[calc(100%+8px)] sm:right-auto sm:top-[calc(100%+8px)] sm:left-[0px]">
                  <DatePicker
                    className="border border-greyOutlineSecondary bg-white"
                    mode="single"
                    onSelect={(d) => d && selectDatepickerDate(d)}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="mt-8 flex items-center">
              <h5 className="text-xl font-bold">{getTitleByDateRangeType()}</h5>
            </div>

            <div className="flex items-center gap-2 sm:w-full sm:mt-2 sm:justify-end">
              {getCompanySpecialistsQuery.data?.results
                // .sort((a, b) => a.id - b.id)
                .map((staff) => (
                  <Button
                    key={staff.id}
                    className={cn("w-10 !p-0 !border-none !bg-transparent", {
                      "after:absolute after:top-[calc(100%+4px)] after:left-1 after:w-[calc(100%-8px)] after:h-[2px] after:bg-purplePrimary":
                        selectedStaffIds.includes(staff.id),
                    })}
                    variant={"resting-active"}
                    onClick={() => filterHandleSelectSpecialist(staff.id)}
                  >
                    <div className="w-10 h-10 rounded-md overflow-hidden">
                      {staff.avatar && (
                        <Image
                          width={40}
                          height={40}
                          src={staff.avatar}
                          alt={staff.fullName}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {!staff.avatar && (
                        <div className="w-full h-full flex justify-center items-center bg-greyOutline">
                          <PersonIcon className="w-7 h-7 stroke-greyPrimary" />
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
            </div>
          </div>
        </div>

        {getBookingsQuery.isPending ? (
          <div className="w-full h-[calc(100%-110px-56px)] flex items-center justify-center">
            <MainLoader className="w-full" />
          </div>
        ) : (
          getContent()
        )}
      </div>
    </>
  );
};

export default Calendar;
