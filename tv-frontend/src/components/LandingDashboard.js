import logo from "../assets/phoenix-logo.png";

const LandingDashboard = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] m-0" style={{ backgroundColor: "#2c3e50" }}>
        <img
          src={logo}
          alt="Phoenix Play Zone Logo"
          className="w-[400px] h-[400px] mx-auto mb-8"
        />
        <h1 className="text-8xl font-bold" style={{ color: "white" }}>
          PHOENIX PLAY ZONE
        </h1>
    </div>
  );
};

export default LandingDashboard;
