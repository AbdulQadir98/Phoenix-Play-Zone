import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const foodItems = [
  {
    id: 1,
    name: "Burger",
    price: 5,
    image: "https://via.placeholder.com/150?text=Burger",
  },
  {
    id: 2,
    name: "Pizza",
    price: 8,
    image: "https://via.placeholder.com/150?text=Pizza",
  },
  {
    id: 3,
    name: "Salad",
    price: 4,
    image: "https://via.placeholder.com/150?text=Salad",
  },
  {
    id: 4,
    name: "Fries",
    price: 3,
    image: "https://via.placeholder.com/150?text=Fries",
  },
  {
    id: 5,
    name: "Soda",
    price: 2,
    image: "https://via.placeholder.com/150?text=Soda",
  },
];

const App = () => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      // Check if the item is already in the cart
      const existingItem = prevCart.find(
        (cartItem) => cartItem.item.id === item.id
      );

      if (existingItem) {
        // Increase quantity of the existing item
        return prevCart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // Add new item with quantity 1
        return [...prevCart, { item, quantity: 1 }];
      }
    });
  };

  const placeOrder = () => {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
  
    alert(`You ordered ${totalItems} items.\nTotal price: $${totalPrice.toFixed(2)}`);
    setCart([]); // Clear cart after placing order
  };
  

  const totalPrice = cart.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <header className="p-4 bg-gray-700 text-white text-center text-xl md:text-2xl">
        Phoenix Food Cafe
      </header>

      <div className="container mx-auto mt-6 flex flex-col-reverse lg:flex-row">
        {/* Food items grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foodItems.map((item) => (
              <Card key={item.id} className="shadow-lg">
                <CardMedia
                  component="img"
                  height="150"
                  image={item.image}
                  alt={item.name}
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    className="text-base md:text-lg lg:text-xl"
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className="text-sm md:text-base"
                  >
                    ${item.price.toFixed(2)}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sticky cart */}
        <div className="sticky top-4 bg-white shadow-lg rounded-lg p-4 w-full lg:w-80 lg:ml-6 mb-4">
          <h2 className="text-lg md:text-xl mb-4 flex items-center">
            <ShoppingCartIcon className="mr-2" /> Cart (
            {cart.reduce((acc, item) => acc + item.quantity, 0)} items)
          </h2>

          {cart.length === 0 ? (
            <Typography variant="body2" className="text-sm md:text-base">
              Your cart is empty.
            </Typography>
          ) : (
            <>
              <ul className="mb-4">
                {cart.map((cartItem, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b py-2 text-sm md:text-base"
                  >
                    <span>{cartItem.item.name}</span>
                    <span>
                      ${cartItem.item.price.toFixed(2)} x {cartItem.quantity}
                    </span>
                  </li>
                ))}
              </ul>
              <Typography
                variant="h6"
                component="div"
                className="text-lg md:text-xl"
              >
                Total: ${totalPrice.toFixed(2)}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={placeOrder}
                className="w-full"
                sx={{ mt: 2 }}
              >
                Place Order
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
