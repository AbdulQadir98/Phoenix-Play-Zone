import {
  Button,
  Card,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";

const ItemCard = ({ foodItems, addToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {foodItems.map((item) => (
        <Card key={item.id} className="shadow-lg">
          <CardMedia
            component="img"
            image={item.image}
            alt={item.name}
          />
          <CardContent>
            <Typography
              variant="h6"
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
              disabled={!item.availability}
            >
              {item.availability ? "Add to Cart" : "Not Available"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ItemCard;
