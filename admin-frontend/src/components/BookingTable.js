import { useEffect, useState } from "react";
import { fetchRecentWebBookings } from "../services/booking";
import { getAlertSeverity } from "../utils";
import { ROWS_PER_PAGE } from "../constants";

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

// Function to get today's date in 'YYYY-MM-DD' format
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDateToDDMMYYYY = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTimeTo12Hour = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 hour to 12 for 12-hour format
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};

const convertMinutesToHours = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = mins.toString().padStart(2, "0");

  return `${formattedHours} H ${formattedMinutes} mins`;
};

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for Snackbar visibility
  const [loading, setLoading] = useState(false); // State for loading

  const getRecentBookings = async (page, pageSize) => {
    setLoading(true);
    try {
      // Get today's date and 3 days later
      const today = new Date();
      const tommorrow = new Date(today);
      tommorrow.setDate(today.getDate() + 2);

      const date_from = formatDateToYYYYMMDD(today);
      const date_to = formatDateToYYYYMMDD(tommorrow);
      // const date_from = '2024-10-01';
      // const date_to = '2024-10-31'
      
      const data = await fetchRecentWebBookings(page, pageSize, date_from, date_to);
      setBookings(data.bookings);
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
    getRecentBookings(page + 1, rowsPerPage);
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
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
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
          placeholder="Filter by Court or Name"
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
              <TableCell>Court Name</TableCell>
              <TableCell align="left">Date</TableCell>
              <TableCell align="right">Time</TableCell>
              <TableCell align="right">Duration</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Contact</TableCell>
              <TableCell align="right">Amount&nbsp;(Rs.)</TableCell>
              <TableCell align="right">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                {/* 8 should be dynamic */}
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="left">
                    {formatDateToDDMMYYYY(row.startTime)}
                  </TableCell>
                  <TableCell align="right">
                    {formatTimeTo12Hour(row.startTime)}
                  </TableCell>
                  <TableCell align="right">
                    {convertMinutesToHours(row.duration)}
                  </TableCell>
                  <TableCell align="right">{row.name}</TableCell>
                  <TableCell align="right">{row.contact}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell align="right">
                    <Alert severity={getAlertSeverity(row.status)}>
                      {row.status}
                    </Alert>
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

export default BookingTable;
