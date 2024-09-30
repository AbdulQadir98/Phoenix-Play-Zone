import { useState, useEffect } from "react";
import {
  Alert,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const AdminSettings = () => {
  // Court names for 5 courts
  const courtNames = [
    "Futsal Court 1",
    "Futsal Court 2",
    "Badminton Court",
    "Leather Court 1",
    "Leather Court 2",
  ];

  // Store prices for 5 courts (normal and peak prices)
  const [prices, setPrices] = useState(Array(5).fill({ normal: 0, peak: 0 })); // Default prices
  const [newNormalPrice, setNewNormalPrice] = useState("");
  const [newPeakPrice, setNewPeakPrice] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null); // Court to update
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch the current prices for all courts from local storage
    const storedPrices = localStorage.getItem("pricesPerHour");
    if (storedPrices) {
      setPrices(JSON.parse(storedPrices));
    }
  }, []);

  const handleNormalPriceChange = (event) => {
    setNewNormalPrice(event.target.value);
  };

  const handlePeakPriceChange = (event) => {
    setNewPeakPrice(event.target.value);
  };

  const handleCourtSelection = (courtIndex) => {
    setSelectedCourt(courtIndex);
  };

  // Save the new prices to local storage for the selected court
  const handleSubmit = () => {
    if ((newNormalPrice || newPeakPrice) && selectedCourt !== null) {
      const updatedPrices = [...prices];
      if (newNormalPrice) {
        updatedPrices[selectedCourt].normal = Number(newNormalPrice);
      }
      if (newPeakPrice) {
        updatedPrices[selectedCourt].peak = Number(newPeakPrice);
      }
      localStorage.setItem("pricesPerHour", JSON.stringify(updatedPrices));
      setPrices(updatedPrices);
      setNewNormalPrice("");
      setNewPeakPrice("");
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
    setPrices(Array(5).fill({ normal: 0, peak: 0 })); // Reset prices to default
    setNewNormalPrice("");
    setNewPeakPrice("");
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
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ color: "#1976d2", fontSize: "1.75rem" }}
                >
                  {price.normal}
                </Typography>
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontSize: "1.25rem", marginLeft: "5px" }}
                >
                  LKR / hour (Normal)
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "5px",
                }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  sx={{ color: "#d32f2f", fontSize: "1.75rem" }}
                >
                  {price.peak}
                </Typography>
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontSize: "1.25rem", marginLeft: "5px" }}
                >
                  LKR / hour (Peak)
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
          value={newNormalPrice}
          onChange={handleNormalPriceChange}
          className="border p-2 mt-2"
          placeholder="Enter new normal price"
        />
        <input
          type="number"
          value={newPeakPrice}
          onChange={handlePeakPriceChange}
          className="border p-2 mt-2"
          placeholder="Enter new peak price"
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
