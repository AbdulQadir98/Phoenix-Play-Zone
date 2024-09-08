import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";

const AdminSettings = () => {
  const [price, setPrice] = useState(600); // Default price
  const [newPrice, setNewPrice] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Fetch the current price from local storage
    const storedPrice = localStorage.getItem("pricePerHour");
    if (storedPrice) {
      setPrice(Number(storedPrice));
    }
  }, []);

  const handlePriceChange = (event) => {
    setNewPrice(event.target.value);
  };

  // Save the new price to local storage
  const handleSubmit = () => {
    if (newPrice) {
      localStorage.setItem("pricePerHour", newPrice);
      setPrice(Number(newPrice));
      setNewPrice("");
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
    setPrice(600);
    setNewPrice("");
    setOpenDialog(false);
  };

  return (
    <>
      <Alert
        sx={{
          fontSize: "1.5rem",
        }}
        icon={false}
        severity="success"
      >
        Admin Access Granted
      </Alert>
      <div className="mt-8 text-xl">Current Price Per Hour: {price}</div>
      <div className="mt-5 flex flex-col">
        <input
          type="number"
          value={newPrice}
          onChange={handlePriceChange}
          className="border p-2"
          placeholder="Enter new price"
        />
        <button
          onClick={handleSubmit}
          className="bg-gray-600 text-white p-2 mt-2 rounded"
        >
          Update Price
        </button>
      </div>
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
