import { useState } from "react";
import { Typography, Paper, Button, TextField } from "@mui/material";
import { sendBookingDetails } from "../services/booking";

import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const BookingConfirmation = ({ bookingDetails }) => {
  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleConfirm = () => {
    const cid = bookingDetails.court.id;
    const price = bookingDetails.totalPrice;

    // Create a Date object for the start time
    const startTime = new Date(bookingDetails.date);
    const [start, end] = bookingDetails.timeRange.split(" - ");

    // Helper function to parse time like "4:00 PM" into hours and minutes
    const parseTime = (timeString) => {
      const timeParts = timeString.match(/(\d+):(\d+)\s([AP]M)/);
      let hours = parseInt(timeParts[1], 10);
      const minutes = parseInt(timeParts[2], 10);
      const period = timeParts[3];

      if (period === "PM" && hours !== 12) {
        hours += 12;
      } else if (period === "AM" && hours === 12) {
        hours = 0;
      }

      return { hours, minutes };
    };

    // Parse start time
    const startTimeParts = parseTime(start);
    startTime.setHours(startTimeParts.hours);
    startTime.setMinutes(startTimeParts.minutes);
    startTime.setSeconds(0);

    // Create a Date object for the end time
    const endTime = new Date(bookingDetails.date);
    const endTimeParts = parseTime(end);
    endTime.setHours(endTimeParts.hours);
    endTime.setMinutes(endTimeParts.minutes);
    endTime.setSeconds(0);

    // If endTime is before startTime, the end time is on the next day (last slot)
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }

    // Calculate the duration in seconds
    const duration = (endTime - startTime) / 1000; // difference in seconds

    // Create the final transformed object
    const transformedBookingDetails = {
      cid: cid,
      duration: duration, // Calculated duration in seconds
      price: price,
      startTime: startTime.toISOString(), // Start time in ISO format
      status: "RESERVED", // Static value
      title: bookingDetails.court.name,
      name: name,
      contact: Number(contactNumber),
    };

    console.log(transformedBookingDetails);

    sendBookingDetails(transformedBookingDetails)
      .then((response) => {
        setDialogMessage("Reservation was placed successfully");
        setIsError(false);
        setOpenDialog(true);
      })
      .catch((error) => {
        setDialogMessage("Failed to Reserve Court. Please try again.");
        setIsError(true);
        setOpenDialog(true);
      })
  };

  // Check if both name and contact number are provided
  const isConfirmEnabled = name.trim() !== "" && contactNumber.trim() !== "";

  return (
    <div className="flex flex-col items-center mt-8">
      <Paper className="p-6 max-w-sm w-full bg-gray-200" sx={{ backgroundColor: '#F9FAFB' }}>
        <Typography variant="h5" gutterBottom>
          Reservation Confirmation
        </Typography>
        <Typography variant="body1">
          Court: {bookingDetails.court.name}
        </Typography>
        <Typography variant="body1">
          Date: {bookingDetails.date.toLocaleDateString()}
        </Typography>
        <Typography variant="body1">
          Time: {bookingDetails.timeRange}
        </Typography>
        <Typography variant="body1">
          Total Price: Rs. {bookingDetails.totalPrice}
        </Typography>

        {/* Name and Contact Number Fields */}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Contact Number"
          variant="outlined"
          fullWidth
          type="number"
          margin="normal"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
        />

        <div className="mt-4">
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleConfirm}
            disabled={!isConfirmEnabled} // Disable button if fields are empty
          >
            Confirm and Proceed
          </Button>
        </div>
      </Paper>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => window.location.reload()}
        sx={{marginTop: '20px'}}
      >
        Back to Home
      </Button>

      {/* Dialog for displaying messages */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reservation Status</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: isError ? 'red' : 'inherit' }}>
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.reload()} color="primary">
            Back to Home
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookingConfirmation;
