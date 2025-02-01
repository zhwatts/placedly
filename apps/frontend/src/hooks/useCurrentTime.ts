/** @format */

import { useState, useEffect } from "react";
import { format } from "date-fns";

export const useCurrentTime = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update immediately to avoid initial delay
    setNow(new Date());

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  return {
    date: format(now, "EEEE, MMMM d"),
    time: format(now, "h:mm:ssa").toLowerCase(), // Added seconds for visible updates
  };
};
