import BasicTable from "../components/BasicTable";

const History = () => {
  return (
    <div className="p-1">
      <div className="flex justify-center items-center mb-4 text-primary text-xl md:text-2xl">
        Bookings History Records
      </div>
      <BasicTable />
    </div>
  );
};

export default History;
