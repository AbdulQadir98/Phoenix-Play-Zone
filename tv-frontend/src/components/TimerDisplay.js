const TimerDisplay = ({ timeString, remainingTime, isMatchStarted }) => {
  const timerContainerStyle = {
    height: isMatchStarted? "60vh" : "100vh",
    margin: 0,
    backgroundColor: "#2c3e50",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    transition: "background-color 0.3s ease",
  };

  const timerStyle = {
    width: "13rem",
    height: "22rem",
    backgroundColor: "#34495e",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20rem",
    fontWeight: "bold",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    transition: "background-color 0.3s ease, color 0.3s ease",
  };

  const getTimerStyle = (remainingTime) => ({
    ...timerStyle,
    color: remainingTime <= 900 ? "#e74c3c" : "#ecf0f1",
  });

  return (
    <div style={timerContainerStyle}>
      {timeString.map((char, index) =>
        char === ":" ? (
          <span key={index} style={{ fontSize: "10rem", color: "#ecf0f1" }}>
            {char}
          </span>
        ) : (
          <div key={index} style={getTimerStyle(remainingTime)}>
            {char}
          </div>
        )
      )}
    </div>
  );
};

export default TimerDisplay;
