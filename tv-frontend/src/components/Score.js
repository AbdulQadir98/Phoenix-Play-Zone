const scoreContainerStyle = {
  height: "40vh",
  margin: 0,
  backgroundColor: "#2c3e50",
  color: "#ecf0f1",
  fontSize: "4rem",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const Score = () => {
  return (
    <div style={scoreContainerStyle}>
      Score: 135/4
    </div>
  );
};

export default Score;
