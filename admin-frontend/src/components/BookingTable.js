import { useEffect, useState } from "react";
import { fetchWebBookings, updateBookingStatus } from "../services/booking";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import {
  CircularProgress,
  Snackbar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

import {
  formatTime,
  formatDate,
  formatDuration,
  getAlertSeverity,
} from "../utils";

import { ROWS_PER_PAGE, PRICE_PER_HOUR } from "../constants";

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const [loading, setLoading] = useState(false); // State for loading
  const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const getBookings = async (page, pageSize) => {
    setLoading(true);
    try {
      const data = await fetchWebBookings(page, pageSize);
      const processedBooking = data.bookings.map((booking) => ({
        ...booking,
        // TODO : remove this
        amount: (booking.duration / 3600) * PRICE_PER_HOUR,
      }));
      setBookings(processedBooking);
      setTotalBookings(data.totalCount);
    } catch (error) {
      console.error("Error fetching web bookings:", error.message);
      setErrorMessage(`Failed to fetch bookings: ${error.message}`);
      setOpenSnackbar(true); // Show Snackbar with error message
    } finally {
      setLoading(false); // Set loading to false after fetch
    }
  };

  useEffect(() => {
    getBookings(page + 1, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCancelClick = async (bookingId) => {
    setSelectedBookingId(bookingId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogConfirm = async () => {
    const endTime = new Date();
    try {
      const status = "CLOSED";
      const response = await updateBookingStatus(
        selectedBookingId,
        status,
        endTime
      );
      //refreshes the page/table
      setBookings((prevBookings) =>
        prevBookings.filter(
          (booking) => booking.bookingId !== selectedBookingId
        )
      );
      if (response.status === 200) {
        console.log("Booking status updated successfully.");
        // TODO : Optionally, can update the UI to reflect this change
      } else {
        console.error("Failed to update booking status.", response.data);
        setErrorMessage("Failed to cancel booking. Please try again.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error confirming booking cancel:", error.message);
      setErrorMessage(`Error confirming booking cancel: ${error.message}`);
      setOpenSnackbar(true);
    } finally {
      setDialogOpen(false);
    }
  };

  const filteredData = bookings.filter(
    (row) =>
      row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <TableContainer
        component={Paper}
        style={{ minWidth: "600px", maxWidth: "80%", margin: "auto" }}
      >
        <TextField
          placeholder="Filter by Court, Name or Status"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
            style: {
              boxShadow: "0px 3px 6px rgba(0,0,0,0.1)",
              marginBottom: "5px",
            },
          }}
        />
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className="bg-gray-200">
            <TableRow>
              <TableCell>Court (Court ID)</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="right">Contact No</TableCell>
              <TableCell align="right">Booked Time</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Amount&nbsp;(Rs.)</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                {/* 9 should be dynamic */}
                <TableCell colSpan={9} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => (
                <TableRow
                  key={row.bookingId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="right">{row.contact}</TableCell>
                  <TableCell align="right">
                    {formatTime(row.startTime)}
                  </TableCell>
                  <TableCell align="right">
                    {formatDuration(row.duration)}
                  </TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right">
                    <Alert severity={getAlertSeverity(row.status)}>
                      {row.status}
                    </Alert>
                  </TableCell>
                  <TableCell align="right">
                    {formatDate(row.startTime)}
                  </TableCell>
                  <TableCell align="right">
                    {/* <IconButton
                      color="primary"
                      onClick={() => handleStartClick(row.bookingId)}
                      aria-label="start"
                    >
                      <PlayArrowIcon />
                    </IconButton> */}
                    <IconButton
                      color="primary"
                      onClick={() => handleCancelClick(row.bookingId)}
                      aria-label="cancel"
                    >
                      <CancelIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[ROWS_PER_PAGE, 10, 25]}
          component="div"
          count={totalBookings}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Dialog for confirming actions */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Cancel</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to Close the booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            No
          </Button>
          <Button onClick={handleDialogConfirm} color="primary" autoFocus>
            Yes
          </Button>
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

export default BookingTable;
