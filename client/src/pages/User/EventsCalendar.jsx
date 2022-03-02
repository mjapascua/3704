import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const EventsCalendar = () => {
  return (
    <div className=" p-3 flex">
      <div className="w-full h-scrn-8 block">
        <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
      </div>
    </div>
  );
};

export default EventsCalendar;
