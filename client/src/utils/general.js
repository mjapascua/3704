import { useEffect, useRef } from "react";

export const swalCustomClass = {
  text: "text-lg !font-bold",
  popup: "mb-56",
  confirmButton: "font-semibold font-display p-4 text-sm rounded-sm",
  cancelButton: "font-semibold font-display p-4 text-sm rounded-sm",
};

export const useIsMounted = () => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);
  return mounted;
};

export const postCategories = {
  event: {
    text: "Event",
    color: "bg-indigo-500",
  },
  news: {
    text: "News",
    color: "bg-emerald-600",
  },
  report: {
    text: "Report",
    color: "bg-rose-600",
  },
  inquiry: {
    text: "Inquiry",
    color: "bg-cyan-600",
  },
  announcement: {
    text: "Announcement",
    color: "bg-fuchsia-600",
  },
};
