import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";

import { formatStartTime, formatRemainingTime } from "../utils";
import {
  sendBookingDetails,
  deleteBooking,
  updateBookingStatus,
} from "../services/booking";
import { sendDuration } from "../services/timer";
import { useSelector, useDispatch } from "react-redux";
import {
  startTimer,
  updateRemainingTime,
  resetTimer,
  endTimer,
  enableReset,
  disableReset,
  enableEnd,
  disableEnd,
} from "../redux/features/timer/timerSlice";
import {
  MIN_INCREMENT,
  MIN_TIME_IN_MINUTES,
  MAX_TIME_IN_MINUTES,
} from "../constants";

const CardBox = ({ cid, title, name }) => {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);
  const [isResetClicked, setIsResetClicked] = useState(false); // flag click
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility

  // Get timer state from Redux store
  const {
    startTime: startTimeString = null,
    remainingTime = null,
    duration = null,
    bookingId = null,
    isResetDisabled = true,
    isEndDisabled = true,
  } = useSelector((state) => state.timers.timers[cid] || {});

  // Convert startTimeString back to a Date object
  const startTime = startTimeString ? new Date(startTimeString) : null;
  const dispatch = useDispatch();

  useEffect(() => {
    let timer;
    if (startTime && remainingTime > 0) {
      const calculateRemainingTime = () => {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        return Math.max(duration - elapsedTime, 0);
      };
      // console.log(calculateRemainingTime())
      // console.log(remainingTime)
      timer = setTimeout(() => {
        const newRemainingTime = calculateRemainingTime();
        if (newRemainingTime !== remainingTime) {
          dispatch(
            updateRemainingTime({ cid, remainingTime: newRemainingTime })
          );
        }
      }, 1000);
    } else if (remainingTime === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [dispatch, startTime, remainingTime, duration, cid, isResetClicked]);

  const handleTimeUp = () => {
    dispatch(resetTimer({ cid }));
    changeStatustoCompleted("COMPLETED"); // Update status to COMPLETED
  };

  const changeStatustoCompleted = (status) => {
    const endTime = new Date();
    updateBookingStatus(bookingId, status, endTime)
      .then((response) => {
        if (response.status === 200) {
          console.log(`Booking status updated to ${status}.`);
        } else {
          console.error(`Failed to update booking status to ${status}.`);
          setErrorMessage(`Failed to update booking status to ${status}.`);
          setOpenSnackbar(true);
        }
      })
      .catch((error) => {
        console.error(`Error updating booking status to ${status}:`, error);
        setErrorMessage(`Error updating booking status: ${error.message}`);
        setOpenSnackbar(true);
      });
  };

  const handleStartClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStartTimer = () => {
    const duration = hours * 3600 + minutes * 60;
    const startTime = new Date().toISOString(); // serialize Date

    dispatch(
      startTimer({
        cid,
        startTime: startTime,
        remainingTime: duration,
        duration: duration,
        bookingId: null, // Will be updated after API response
      })
    );
    setIsResetClicked(false); // reset the flag variable to default

    const newBooking = {
      cid,
      title,
      startTime,
      status: "PENDING",
      duration,
    };
    console.log(newBooking);

    sendBookingDetails(newBooking)
      .then((response) => {
        dispatch(
          startTimer({
            cid,
            startTime: startTime,
            remainingTime: duration,
            duration: duration,
            bookingId: response.data.bookingId, // Update bookingId
          })
        );
        console.log(response.data.message + ": " + response.data.bookingId);
      })
      .catch((error) => {
        console.error("Error sending Booking details", error.message);
        setErrorMessage("Failed to start booking. Please try again.");
        setOpenSnackbar(true); // Show Snackbar with error message
      })
      .finally(() => {
        setOpen(false);
        dispatch(enableReset({ cid })); // Enable "Reset" button
        dispatch(disableEnd({ cid })); // Disable "End Time" button
        setTimeout(() => {
          dispatch(disableReset({ cid })); // Disable "Reset" button
          // previous state, ensuring to get most up-to-date setIsResetClicked()
          setIsResetClicked((prevIsResetClicked) => {
            if (!prevIsResetClicked) {
              dispatch(enableEnd({ cid })); // Enable "End Time" button
            }
            return prevIsResetClicked;
          });
        }, 10000); // 10 seconds
      });

    //send time duration to the TV
    sendDuration(duration, cid)
      .then((data) => {
        console.log("Duration sent successfully:", data);
      })
      .catch((error) => {
        console.error("Error sending duration:", error.message);
        setErrorMessage("Failed to send Time.");
        setOpenSnackbar(true); // Show Snackbar with error message
      });
  };

  const handleResetClick = () => {
    setConfirmOpen(true);
  };

  const handleEndClick = () => {
    setEndConfirmOpen(true);
  };

  const handleConfirmEnd = async () => {
    const endTime = new Date();
    const duration = startTime ? Math.floor((endTime - startTime) / 1000) : 0;

    // Log end time and duration
    console.log("End Time:", endTime);
    console.log("Duration:", duration);

    try {
      const status = "CANCELLED";
      const response = await updateBookingStatus(bookingId, status, endTime);

      if (response.status === 200) {
        console.log("Booking status updated successfully.");
        // Optionally, you can update the UI to reflect this change
      } else {
        console.error("Failed to update booking status.", response.data);
        setErrorMessage("Failed to end booking. Please try again.");
        setOpenSnackbar(true); // Show Snackbar with error message
      }
    } catch (error) {
      console.error("Error confirming booking end:", error.message);
      setErrorMessage("Error confirming booking End Time");
      setOpenSnackbar(true);
    } finally {
      dispatch(endTimer({ cid })); // Disable "End Time" button
      setEndConfirmOpen(false);

      //reset time on TV
      sendDuration(0, cid)
        .then((data) => {
          console.log("Duration sent successfully:", data);
        })
        .catch((error) => {
          console.error("Error sending duration:", error.message);
          setErrorMessage("Failed to send Time.");
          setOpenSnackbar(true); // Show Snackbar with error message
        });
    }
  };

  const handleConfirmClose = () => {
    setConfirmOpen(false);
  };

  const handleConfirmReset = () => {
    if (bookingId) {
      deleteBooking(bookingId)
        .then(() => {
          console.log(`Booking for ${bookingId} deleted successfully.`);
        })
        .catch((error) => {
          console.error(`Error deleting booking ${bookingId}`, error);
          setErrorMessage("An error occurred while deleting the booking.");
          setOpenSnackbar(true);
        });
    }
    setIsResetClicked(true);
    setConfirmOpen(false);
    dispatch(resetTimer({ cid })); // Disable "Reset" button

    //reset time on TV
    sendDuration(0, cid)
    .then((data) => {
      console.log("Duration sent successfully:", data);
    })
    .catch((error) => {
      console.error("Error sending duration:", error.message);
      setErrorMessage("Failed to send Time.");
      setOpenSnackbar(true); // Show Snackbar with error message
    });
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <Card
        sx={{ minWidth: 275 }}
        className="shadow-lg rounded-lg overflow-hidden"
      >
        <CardContent className="bg-gray-100 text-white p-6">
          <Typography
            variant="h5"
            component="div"
            textAlign="center"
            color="text.secondary"
            gutterBottom
          >
            {title}
          </Typography>
          {remainingTime !== null ? (
            <>
              <Typography
                className="text-center bg-white py-3"
                variant="h4"
                sx={{ fontWeight: "bold" }}
                color="text.secondary"
              >
                {formatRemainingTime(remainingTime)}
              </Typography>
              {startTime && (
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  Start Time: {formatStartTime(startTime)}
                </Typography>
              )}
            </>
          ) : (
            <Typography
              className="text-center bg-white py-3"
              variant="h4"
              sx={{ fontWeight: "bold"}}
              color="text.secondary"
            >
              OPEN
            </Typography>
          )}
          {startTime == null && (
            <Typography sx={{ mt: 2 }} color="text.secondary">
              {name}
            </Typography>
          )}
        </CardContent>
        <CardActions className="justify-between">
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleStartClick}
            >
              Start Time
            </Button>
            <Button
              variant="outlined"
              sx={{ marginLeft: "10px" }}
              onClick={handleResetClick}
              disabled={isResetDisabled}
            >
              Reset
            </Button>
          </div>
          <div>
            <Button
              variant="outlined"
              color="error"
              onClick={handleEndClick}
              disabled={isEndDisabled}
            >
              End Time
            </Button>
          </div>
        </CardActions>
      </Card>

      {/* Dialog Box to set timer */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Start Countdown</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "1.25rem" }}>
            Please enter the time countdown
          </DialogContentText>
          <Grid container spacing={2} direction="column">
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="dense"
                id="hours"
                label="Hours"
                type="number"
                fullWidth
                variant="standard"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                InputProps={{
                  inputProps: { min: 0, step: 1 },
                  sx: {
                    height: "3.2rem",
                    fontSize: "2rem",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: "1.3rem",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="minutes"
                label="Minutes"
                type="number"
                fullWidth
                variant="standard"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                InputProps={{
                  inputProps: {
                    min: MIN_TIME_IN_MINUTES,
                    max: MAX_TIME_IN_MINUTES,
                    step: MIN_INCREMENT,
                  },
                  sx: {
                    height: "3.2rem",
                    fontSize: "2rem",
                  },
                }}
                InputLabelProps={{
                  sx: {
                    fontSize: "1.3rem",
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleStartTimer}
            // TODO : uncomment this
            // disabled={hours * 60 + minutes < 60}
          >
            Start
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Box for Reset Time Confirmation */}
      <Dialog open={confirmOpen} onClose={handleConfirmClose}>
        <DialogTitle>Reset Timer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the timer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancel</Button>
          <Button onClick={handleConfirmReset}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Box for End Time Confirmation */}
      <Dialog open={endConfirmOpen} onClose={() => setEndConfirmOpen(false)}>
        <DialogTitle>End Timer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end the timer? This will log the end time
            and duration.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEndConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmEnd}>Confirm</Button>
        </DialogActions>
      </Dialog>

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

CardBox.propTypes = {
  cid: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default CardBox;
