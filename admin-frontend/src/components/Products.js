import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CardMedia,
  TextField,
  Switch,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import burger from "../assets/burger.webp";
import pizza from "../assets/pizza.webp";
import salad from "../assets/salad.webp";
import fries from "../assets/fries.webp";
import lime from "../assets/lime.jpg";
import tacos from "../assets/tacos.webp";
import pasta from "../assets/pasta.webp";
import wings from "../assets/wings.webp";
import icecream from "../assets/icecream.webp";
import mojito from "../assets/mojito.png";

const foodItems = [
  { id: 1, name: "Burger", price: 1200, image: burger, availability: true },
  { id: 2, name: "Pizza", price: 1100, image: pizza, availability: false },
  { id: 3, name: "Salad", price: 300, image: salad, availability: true },
  { id: 4, name: "Fries", price: 200, image: fries, availability: true },
  { id: 5, name: "Lime Juice", price: 100, image: lime, availability: false },
  { id: 6, name: "Tacos", price: 500, image: tacos, availability: true },
  { id: 7, name: "Pasta", price: 800, image: pasta, availability: true },
  { id: 8, name: "Wings", price: 400, image: wings, availability: true },
  { id: 9, name: "Ice Cream", price: 300, image: icecream, availability: true },
  { id: 10, name: "Mojito", price: 200, image: mojito, availability: true },
];

const Products = () => {
  const [foodItemsState, setFoodItemsState] = useState(foodItems);
  const [editedItems, setEditedItems] = useState(
    foodItems.map((item) => ({ ...item }))
  );
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (id, field, value) => {
    const updatedItems = editedItems.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setEditedItems(updatedItems);
  };

  const handleSave = () => {
    setOpen(true);
    setError(""); // Clear any previous error message
    setPassword(""); // Reset password input
  };

  const handleConfirmSave = () => {
    if (password === "p@ssw0rd") {
      setFoodItemsState(editedItems);
      setOpen(false);
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {editedItems.map((item) => (
          <Card key={item.id} className="shadow-lg">
            <CardMedia component="img" image={item.image} alt={item.name} />
            <CardContent>
              <TextField
                variant="outlined"
                value={item.name}
                onChange={(e) =>
                  handleInputChange(item.id, "name", e.target.value)
                }
                className="text-base md:text-lg lg:text-xl"
                fullWidth
                sx={{ mt: 1, '& .MuiInputBase-input': { padding: "10px 14px" } }}
              />
              <TextField
                variant="outlined"
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleInputChange(item.id, "price", e.target.value)
                }
                className="text-sm md:text-base"
                fullWidth
                sx={{ mt: 2, '& .MuiInputBase-input': { padding: "10px 14px" } }} 
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={item.availability}
                    onChange={(e) =>
                      handleInputChange(
                        item.id,
                        "availability",
                        e.target.checked
                      )
                    }
                  />
                }
                label={item.availability ? "Available" : "Not Available"}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Save Changes
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Save</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter password to confirm changes.
          </DialogContentText>
          <TextField
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2, '& .MuiInputBase-input': { padding: "10px 14px" } }} 
          />
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSave} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Products;
