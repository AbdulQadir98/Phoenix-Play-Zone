// DatePickerComponent.js
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Box  } from "@mui/material";

const DatePickerComponent = ({ onDateSelect, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MMMM d, yyyy"
        minDate={new Date()}
        placeholderText="Select a date"
        className="border border-gray-300 rounded-lg p-2 shadow-sm focus:outline-none"
        inline
      />
      <Button variant="outlined" color="secondary" onClick={onBack} sx={{marginTop: "20px"}}>
        Back
      </Button>
    </div>
  );
};

export default DatePickerComponent;
