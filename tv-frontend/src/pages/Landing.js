import { useEffect, useState, useRef } from "react";
import { formatTime } from "../utils/timer.utils";
import { PROD_API_URL } from "../constants";
import TimerDisplay from "../components/TimerDisplay";
import LandingDashboard from "../components/LandingDashboard";
import warningSound from "../assets/warn.mp3";

const Landing = () => {
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // in seconds
  const [isReset, setIsReset] = useState(true); // state to track reset
  const hasWarned = useRef(false); // Ref to avoid multiple warnings
  
  // Load the warning sound
  const audio = new Audio(warningSound);

  const playAudio = () => {
    audio.play().catch((error) => {
      console.error("Audio playback failed :", error);
    });
  };

  let port;
  try {
    port = window.location.port;
  } catch (error) {
    console.error("An error occurred while retrieving the port:", error);
  }

  // To listen to duration and reset
  useEffect(() => {
    const eventSource = new EventSource(`${PROD_API_URL}/events/timer`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if ((parseInt(data.cid) === 1 && port === "3001") || (parseInt(data.cid) === 2 && port === "3002")) {
          setIsReset(data.duration === 0);
          setRemainingTime(data.duration);
          hasWarned.current = false; // Reset warning state when new time is set
        }
      } catch (error) {
        console.error("Error parsing SSE data when listening to duration: ", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      // Implement reconnection logic if necessary
    };

    return () => {
      eventSource.close(); // Clean up the SSE connection on component unmount
    };
  }, []); // Run only once on component mount

  // To decrement remaining time
  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) return;

    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1; // Decrement the time
        // TODO: have to reset the match and scores
        if (newTime <= 0) {
          clearInterval(intervalId); // Stop interval when time is 0
          setIsMatchStarted(false) 
          setIsReset(true);
          return 0; // Ensure the time is exactly 0
        }
        return newTime;
      });
    }, 1000);

    // Check if the remaining time is less than 15 minutes and warn
    if (remainingTime <= 900 && !hasWarned.current) {
      playAudio();
      hasWarned.current = true; // Prevent further warnings
    }

    return () => {
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, [remainingTime]);

  // To flag match start, will trigger when score updates also!!
  useEffect(() => {
    const matchEventSource = new EventSource(`${PROD_API_URL}/events/score`);
    matchEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if ((parseInt(data.cid) === 1 && port === "3001") || (parseInt(data.cid) === 2 && port === "3002")) {
          setIsMatchStarted(data.isMatchStarted);
        }
      } catch (error) {
        console.error("Error parsing SSE data when listening to score: ", error);
      }
    };

    matchEventSource.onerror = (error) => {
      console.error("SSE error:", error);
      // Implement reconnection logic if necessary
    };

    return () => {
      matchEventSource.close(); // Clean up the SSE connection on component unmount
    };
  }, []); // Run only once on component mount

  const timeString = formatTime(remainingTime).split(""); // Split into individual digits

  return (
    <>
      {isReset ? (
        <LandingDashboard />
      ) : (
        <TimerDisplay
          timeString={timeString}
          remainingTime={remainingTime}
          isMatchStarted={isMatchStarted}
        />
      )}
    </>
  );
};

export default Landing;
