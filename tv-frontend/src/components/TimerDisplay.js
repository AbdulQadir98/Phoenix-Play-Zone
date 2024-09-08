import { useState } from "react";
import Score from "./Score";

const TimerDisplay = ({ timeString, remainingTime }) => {
  const [isMatchStarted, setIsMatchStarted] = useState(false);

  const timerContainerStyle = {
    height: isMatchStarted ? "60vh" : "100vh",
    margin: 0,
    backgroundColor: "#2c3e50",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    transition: "background-color 0.3s ease",
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
    color: remainingTime <= 900 ? "#e74c3c" : "#ecf0f1",
    backgroundColor: "#34495e",
  });

  return (
    <>
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
      {isMatchStarted && <Score />}
    </>
  );
};

export default TimerDisplay;
