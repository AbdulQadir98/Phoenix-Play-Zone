import Products from '../components/Products';
import Orders from "../components/Orders";

const Restaurant = () => {
  return (
    <div className="p-1">
      <div className="relative flex justify-center items-center mb-4">
        <div className="font-mono text-primary text-xl md:text-2xl">
          Phoenix Food Cafe
        </div>
        <div className="absolute right-0">
          <Orders/>
        </div>
      </div>
      <Products />
    </div>
  );
};

export default Restaurant;
