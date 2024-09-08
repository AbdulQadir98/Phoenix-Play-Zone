import { useEffect, useState, useRef } from "react";
import { formatTime } from "../utils/timer.utils";
import { PROD_API_URL } from "../constants";
import TimerDisplay from "../components/TimerDisplay";
import LandingDashboard from "../components/LandingDashboard";

const Landing = () => {
  const [remainingTime, setRemainingTime] = useState(0); // in seconds
  const [isReset, setIsReset] = useState(true); // state to track reset
  const hasWarned = useRef(false); // Ref to avoid multiple warnings

  useEffect(() => {
    const eventSource = new EventSource(`${PROD_API_URL}/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (parseInt(data.cid) === 1) {
        setIsReset(data.duration === 0);
        setRemainingTime(data.duration);
        hasWarned.current = false; // Reset warning state when new time is set
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
    };

    return () => {
      eventSource.close(); // Clean up the SSE connection on component unmount
    };
  }, []);

  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) return;

    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1; // Decrement the time
        if (newTime <= 0) {
          clearInterval(intervalId); // Stop interval when time is 0
          setIsReset(true);
          return 0; // Ensure the time is exactly 0
        }
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, [remainingTime]);

  const timeString = formatTime(remainingTime).split(""); // Split into individual digits

  return (
    <>
      {isReset ? (
        <LandingDashboard />
      ) : (
        <TimerDisplay timeString={timeString} remainingTime={remainingTime} />
      )}
    </>
  );
};

export default Landing;