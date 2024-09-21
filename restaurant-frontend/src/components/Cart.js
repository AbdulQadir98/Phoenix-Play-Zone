import { Button, Typography } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
const Cart = ({ cart, totalPrice, placeOrder, removeFromCart }) => {
    return (
      <>
        {cart.length > 0 && ( // Only show cart if there are items
          <div className="lg:sticky max-h-[600px] top-4 bg-white shadow-lg rounded-lg p-4 w-full lg:w-80 lg:ml-6 mb-4">
            <div className="text-lg md:text-xl mb-4 flex items-center">
              <ShoppingCartIcon className="mr-2" /> Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)
            </div>
  
            <ul className="mb-4">
              {cart.map((cartItem, index) => (
                <li key={index} className="flex justify-between items-center border-b py-2 text-sm md:text-base">
                  <span>{cartItem.item.name}</span>
                  <span>
                    ${cartItem.item.price.toFixed(2)} x {cartItem.quantity}
                  </span>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: '#14b8a6', color: 'white' }}
                    onClick={() => removeFromCart(cartItem.item)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
            <Typography variant="h6" component="div" className="text-lg md:text-xl">
              Total: ${totalPrice.toFixed(2)}
            </Typography>
  
            <Button variant="contained" color="primary" onClick={placeOrder} className="w-full" sx={{ mt: 2 }}>
              Place Order
            </Button>
          </div>
        )}
      </>
    );
  };  

export default Cart;
