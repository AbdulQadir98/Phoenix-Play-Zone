import { useState } from "react";

import { Button, Drawer } from "@mui/material";

const CalanderView = () => {
  const [showMore, setShowMore] = useState(false);

  const handleToggle = () => {
    setShowMore((prevState) => !prevState);
  };

  return (
    <div>
      <div className="flex justify-center items-center py-8 text-primary text-xl md:text-2xl">
        <Button variant="contained" color="primary" onClick={handleToggle}>
          {showMore ? "Hide All Bookings" : "Show All Bookings"}
        </Button>
      </div>

      {/* Drawer component */}
      <Drawer
        anchor="right"
        open={showMore}
        onClose={handleToggle}
        PaperProps={{
          sx: {
            top: "64px",
            height: "calc(100% - 64px)",
            width: "400px",
          },
        }}
      >
        <div className="p-4 bg-gray-200 text-xl md:text-2xl">
          <div>ALL BOOKINGS</div>
        </div>
      </Drawer>
    </div>
  );
};

export default CalanderView;
