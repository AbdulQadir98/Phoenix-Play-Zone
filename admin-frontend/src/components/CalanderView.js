import { useState, useEffect } from "react";
import { fetchWebBookings } from "../services/booking";
import { formatTimeTo12Hour, convertMinutesToHours } from "../utils/index";
import {
  Button,
  Drawer,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const CalanderView = () => {
  const [showMore, setShowMore] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [bookings, setBookings] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const [loading, setLoading] = useState(false); // State for loading

  const getBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchWebBookings();
      setBookings(data.bookings);
      setLoading(false); // Set loading to false after fetch only
    } catch (error) {
      console.error("Error fetching web bookings:", error.message);
      setErrorMessage(
        `Failed to fetch web bookings for calander: ${error.message}`
      );
      setOpenSnackbar(true); // Show Snackbar with error message
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const handleToggle = () => {
    setShowMore((prevState) => !prevState);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // Filter bookings based on selected date
  const filteredBookings = bookings.filter((booking) => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div>
      <div className="flex justify-center items-center py-8 text-primary text-xl md:text-2xl">
        <Button variant="contained" color="primary" onClick={handleToggle}>
          {showMore ? "Hide All Bookings" : "Show All Bookings"}
        </Button>
      </div>

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
        {/* Calendar component */}
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center py-3">
              <CircularProgress />
              <div className="py-3">Check Internet Connection</div>
            </div>
          ) : (
            <div>
              <div className="flex justify-center py-4">
                <Calendar onChange={setSelectedDate} value={selectedDate} />
              </div>

              <div className="p-2">
                <strong>Date: {selectedDate.toDateString()}</strong>
              </div>
              <div className="p-2">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking, index) => (
                    <div key={index} className="py-2">
                      <div>Time: {formatTimeTo12Hour(booking.startTime)}</div>
                      <div>Duration: {convertMinutesToHours(booking.duration)}</div>
                    </div>
                  ))
                ) : (
                  <div>No bookings for this date.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </Drawer>

      {/* Snackbar for displaying error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {errorMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CalanderView;
