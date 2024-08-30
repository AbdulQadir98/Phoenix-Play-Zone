import { useEffect, useState } from "react";
import { fetchTime } from "../services/timer.service";
import { formatTime } from "../utils/timer.utils";

const zerotime = "00:00:00";

const timerStyle = {
  fontSize: "100px", // Large font size
  fontWeight: "bold",
  textAlign: "center",
  color: "#ff4500", // Bright color
  margin: "20px",
};

const TimerDisplay = () => {
  const [remainingTime, setRemainingTime] = useState(0); // Initialize with 0 seconds
  const [duration, setDuration] = useState(0); // To store the fetched time

  useEffect(() => {
    const getRemainingTime = async () => {
      try {
        const fetchedTime = await fetchTime();
        setDuration(fetchedTime); // Store the fetched time
        setRemainingTime(fetchedTime); // Set the remaining time
      } catch (error) {
        console.error("Failed to fetch number:", error);
      }
    };

    getRemainingTime();
  }, []); // Run only once on component mount

  useEffect(() => {
    if (remainingTime === null || remainingTime <= 0) return;

    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        const newTime = prevTime - 1; // Decrement the time
        if (newTime <= 0) {
          clearInterval(intervalId); // Stop the interval when the time reaches 0
          return 0; // Ensure the time is exactly 0
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [remainingTime]);

  return (
    <div>
      {remainingTime !== null ? (
        <div>
          You Booked Time Duration {duration}
          <br />
          <div style={timerStyle}>{formatTime(remainingTime)}</div>
        </div>
      ) : (
        <div className="bg-gray-400">{zerotime}</div>
      )}
    </div>
  );
};

export default TimerDisplay;
