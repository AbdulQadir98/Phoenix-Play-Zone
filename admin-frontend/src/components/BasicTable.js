import { useEffect, useState } from "react";
import { fetchCompletedPendingCancelledBookings } from "../services/booking";

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
import { CircularProgress, Snackbar } from "@mui/material";
import {
  formatTime,
  formatDate,
  formatDuration,
  getAlertSeverity,
} from "../utils";
import { ROWS_PER_PAGE, PRICE_PER_HOUR } from '../constants';

const BasicTable = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const [loading, setLoading] = useState(false); // State for loading

  const getBookings = async (page, pageSize) => {
    setLoading(true);
    try {
      const data = await fetchCompletedPendingCancelledBookings(page, pageSize);
      const processedBooking = data.bookings.map((booking) => ({
        ...booking,
        amount: (booking.duration / 3600) * PRICE_PER_HOUR,
        // endTime?
      }));
      setBookings(processedBooking);
      setTotalBookings(data.totalCount)
    } catch (error) {
      console.error("Error fetching completed bookings:", error.message);
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

  const filteredData = bookings.filter(
    (row) =>
      row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          placeholder="Filter by Court or Status"
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
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">Duration&nbsp;(mins)</TableCell>
              <TableCell align="right">Amount&nbsp;(Rs.)</TableCell>
              <TableCell align="right">End Time</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
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
                  <TableCell align="right">
                    {formatTime(row.startTime)}
                  </TableCell>
                  <TableCell align="right">
                    {formatDuration(row.duration)}
                  </TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right">{formatTime(row.endTime)}</TableCell>
                  <TableCell align="right">
                    <Alert severity={getAlertSeverity(row.status)}>
                      {row.status}
                    </Alert>
                  </TableCell>
                  <TableCell align="right">
                    {formatDate(row.startTime)}
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

export default BasicTable;
