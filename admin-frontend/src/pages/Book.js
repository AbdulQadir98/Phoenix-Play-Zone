import BookingTable from "../components/BookingTable";
import CalanderView from "../components/CalanderView";

const Book = () => {

  return (
    <div className="p-1">
      <div className="flex justify-center items-center mb-4 text-primary text-xl md:text-2xl">
        Recent Web Bookings
      </div>
      <BookingTable />
      <CalanderView/>
    </div>
  );
};

export default Book;
