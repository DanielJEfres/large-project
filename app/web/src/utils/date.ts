// Handles the Today/Tomorrow/Weekday logic
const getRelativeDay = (eventDate: Date): string | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const eventDatePure = new Date(eventDate);
  eventDatePure.setHours(0, 0, 0, 0);

  if (eventDatePure.getTime() === today.getTime()) return "Today";
  if (eventDatePure.getTime() === tomorrow.getTime()) return "Tomorrow";

  const sixDaysFromNow = new Date(today);
  sixDaysFromNow.setDate(today.getDate() + 6);

  if (eventDatePure > today && eventDatePure <= sixDaysFromNow) {
    return eventDate.toLocaleDateString("en-US", { weekday: "long" });
  }

  return null;
};

//FULL DATE FORMAT
//Output: "Today", "Tomorrow", or "Tuesday, April 21, 2026"

export const formatDate = (isoString: string | undefined | null): string => {
  if (!isoString) return "Date TBD";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const relative = getRelativeDay(date);
  if (relative) return relative;

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

//SHORT DATE FORMAT
//Output: "Today", "Tomorrow", or "Apr 21"

export const formatShortDate = (
  isoString: string | undefined | null,
): string => {
  if (!isoString) return "TBD";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid";

  const relative = getRelativeDay(date);
  if (relative) return relative;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

//STACK DATE FORMAT
// Output: { date: "Jun 3", day: "Wednesday" }
export const formatStackedDate = (isoString: string | undefined | null) => {
  if (!isoString) return { date: "TBD", day: "" };

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return { date: "Invalid", day: "" };

  // Get the Relative part (Today, Tomorrow, or Wednesday)
  // If it's more than 6 days away, we just return the full Weekday
  const relative =
    getRelativeDay(date) ||
    date.toLocaleDateString("en-US", { weekday: "long" });

  // Get the Date part (Jun 3)
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return {
    date: datePart,
    day: relative,
  };
};

// Time format
export const formatTime = (isoString: string | undefined | null): string => {
  if (!isoString) return "Time TBD";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid Time";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
