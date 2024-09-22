import { useState } from "react";
import ItemCard from "../components/ItemCard";
import Cart from "../components/Cart";

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

const Home = () => {
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

  const removeFromCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.item.id === item.id
      );

      if (existingItem.quantity === 1) {
        // Remove item completely if quantity is 1
        return prevCart.filter((cartItem) => cartItem.item.id !== item.id);
      } else {
        // Decrease quantity if more than 1
        return prevCart.map((cartItem) =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      }
    });
  };

  const placeOrder = async (customerName) => {
    if (!customerName.trim()) {
      alert("Please enter your name before placing the order.");
      return;
    }

    const orderTime = new Date().toISOString();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
    
    // cart.map((cartItem) => (
    //   console.log(cartItem.item.name)
    // ))
    // console.log(cart[0].item.name)

    const order = {
      customerName,
      orderTime,
      items: cart.map(i => ({
        qty: i.quantity,
        name: i.item.name
      })),
      totalPrice,
      status: "PENDING",
    };

    console.log(order);

    alert(
      `Thank you, ${customerName}!\nYou ordered ${totalItems} item(s).\nTotal price: $${totalPrice.toFixed(2)}.`
    );
    setCart([]); // Clear cart after placing order
  };

  const totalPrice = cart.reduce(
    (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-800 p-5">
      <header className="font-mono p-4 text-white text-center text-xl md:text-2xl">
        Phoenix Food Cafe
      </header>

      <div className="container mx-auto mt-6 flex flex-col-reverse lg:flex-row">
        {/* Food items */}
        <div className="flex-1">
          <ItemCard foodItems={foodItems} addToCart={addToCart} />
        </div>

        {/* Sticky cart */}
        <Cart
          cart={cart}
          totalPrice={totalPrice}
          placeOrder={placeOrder}
          removeFromCart={removeFromCart}
        />
      </div>
    </div>
  );
};

export default Home;
