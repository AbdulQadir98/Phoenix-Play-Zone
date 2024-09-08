import { useEffect, useState, useRef } from "react";
import { formatTime } from "../utils/timer.utils";
import { PROD_API_URL, EMPTY_TIME } from "../constants";

// Define styles
const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  margin: 0,
  backgroundColor: "#2c3e50",
};

const emptyTimeStyle = {
  fontSize: "8rem",
  fontWeight: "bold",
  color: "#95a5a6",
};

const timerContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
};

const digitStyle = {
  width: "13rem",
  height: "22rem",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "20rem",
  fontWeight: "bold",
  color: "#ecf0f1",
  backgroundColor: "#34495e",
  borderRadius: "0.5rem",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  transition: "background-color 0.3s ease, color 0.3s ease",
};

const getDigitStyle = (digit, remainingTime) => ({
  ...digitStyle,
  color: remainingTime <= 900 ? "#e74c3c" : "#ecf0f1", // Change color based on time
  backgroundColor: "#34495e", // Background color of the digit
});

const TimerDisplay = ({ hasScore }) => {
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
    <div style={pageStyle}>
      {isReset ? (
        <div style={emptyTimeStyle}>{EMPTY_TIME}</div>
      ) : (
        <div style={timerContainerStyle}>
          {timeString.map((char, index) =>
            char === ":" ? (
              <span key={index} style={{ fontSize: "10rem", color: "#ecf0f1" }}>
                {char}
              </span>
            ) : (
              <div key={index} style={getDigitStyle(char, remainingTime)}>
                {char}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
