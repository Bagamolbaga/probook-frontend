import CalendarEvent from "@/components/ui/widgets/sidebar/CalendarEvent";

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    status: "booked",
    time: {
      start: "10.10",
      end: "11.00",
    },
    title: "Meeting with a client",
    desc: "Tell How To Boost Website Traffic",
  },
  {
    id: "2",
    status: "completed",
    time: {
      start: "12.00",
      end: "14.00",
    },
    title: "Design new pages",
    desc: "Design new pages for the website",
  },
  {
    id: "3",
    status: "pending",
    time: {
      start: "9.00",
      end: "13.00",
    },
    title: "Design new UI and check sales",
    desc: "Find new pages and check analytics",
  },
  {
    id: "4",
    status: "error",
    time: {
      start: "5.40",
    },
    title: "Visit online course",
    desc: "Check updates about design course",
  },
];

export const UpcomingEvents = () => {
  return (
    <div className="h-full flex flex-col overflow-x-hidden overflow-y-auto">
      <h5>Upcoming events</h5>
      <p className="text-sm text-greyPrimary">Don’t miss scheduled events</p>
      <div className="mt-5 flex flex-col gap-3 overflow-x-hidden overflow-y-auto">
        {MOCK_EVENTS.map((e) => (
          <CalendarEvent key={e.id} {...e} />
        ))}
      </div>
    </div>
  );
};
