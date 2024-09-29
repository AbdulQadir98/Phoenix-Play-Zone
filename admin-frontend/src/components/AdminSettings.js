import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

const AdminSettings = () => {
  // Court names for 5 courts
  const courtNames = [
    "Futsal Court 1",
    "Futsal Court 2",
    "Badminton Court",
    "Leather Court 1",
    "Leather Court 2",
  ];

  // Store prices for 5 courts
  const [prices, setPrices] = useState([600, 600, 600, 600, 600]); // Default prices for each court
  const [newPrice, setNewPrice] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null); // Court to update
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch the current prices for all courts from local storage
    const storedPrices = localStorage.getItem("pricesPerHour");
    if (storedPrices) {
      setPrices(JSON.parse(storedPrices));
    }
  }, []);

  const handlePriceChange = (event) => {
    setNewPrice(event.target.value);
  };

  const handleCourtSelection = (courtIndex) => {
    setSelectedCourt(courtIndex);
  };

  // Save the new price to local storage for the selected court
  const handleSubmit = () => {
    if (newPrice && selectedCourt !== null) {
      const updatedPrices = [...prices];
      updatedPrices[selectedCourt] = Number(newPrice);
      localStorage.setItem("pricesPerHour", JSON.stringify(updatedPrices));
      setPrices(updatedPrices);
      setNewPrice("");
      setSelectedCourt(null);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmClearData = () => {
    localStorage.clear();
    setPrices([600, 600, 600, 600, 600]); // Reset prices to default
    setNewPrice("");
    setOpenDialog(false);
  };

  return (
    <>
      <Alert
        sx={{
          fontSize: "1.25rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
        icon={false}
        severity="success"
      >
        Admin Access Granted
      </Alert>

      {/* Display current prices for all 5 courts in cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {prices.map((price, index) => (
          <Card
            key={index}
            sx={{
              minWidth: 275,
              backgroundColor: "#f5f5f5",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {courtNames[index]}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ color: "#1976d2", fontSize: "1.75rem" }}
                >
                  {price}
                </Typography>
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontSize: "1.25rem", marginLeft: "5px" }}
                >
                  LKR / hour
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Price update section */}
      <div className="mt-5 flex flex-col">
        <select
          onChange={(e) => handleCourtSelection(Number(e.target.value))}
          value={selectedCourt === null ? "" : selectedCourt}
          className="border p-2"
        >
          <option value="" disabled>
            Select Court
          </option>
          {courtNames.map((name, courtIndex) => (
            <option key={courtIndex} value={courtIndex}>
              {name}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={newPrice}
          onChange={handlePriceChange}
          className="border p-2 mt-2"
          placeholder="Enter new price"
        />
        <button
          onClick={handleSubmit}
          className="bg-gray-600 text-white p-2 mt-2 rounded"
        >
          Update Price
        </button>
      </div>

      {/* Clear data section */}
      <div className="mt-10 flex flex-col">
        <button
          onClick={handleOpenDialog}
          className="bg-gray-400 text-white p-2 rounded border-none"
        >
          Clear All Data
        </button>
      </div>

      {/* confirmation to clear localStorage */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Clear Data</DialogTitle>
        <DialogContent>
          Are you sure you want to clear all data? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmClearData} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminSettings;
