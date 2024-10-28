// TimeSlots.js
import { useState, useEffect } from "react";
import { Button } from "@mui/material";

import { fetchBookingDetails } from "../services/booking";
import { formatDateToYYYYMMDD } from "../utils";

const availableSlots = [
  { time: "9:00 AM - 10:00 AM" },
  { time: "10:00 AM - 11:00 AM" },
  { time: "11:00 AM - 12:00 PM" },
  { time: "12:00 PM - 1:00 PM" },
  { time: "1:00 PM - 2:00 PM" },
  { time: "2:00 PM - 3:00 PM" },
  { time: "3:00 PM - 4:00 PM" },
  { time: "4:00 PM - 5:00 PM" },
  { time: "5:00 PM - 6:00 PM" },
  { time: "6:00 PM - 7:00 PM" },
  { time: "7:00 PM - 8:00 PM" },
  { time: "8:00 PM - 9:00 PM" },
  { time: "9:00 PM - 10:00 PM" },
  { time: "10:00 PM - 11:00 PM" },
  { time: "11:00 PM - 12:00 AM" },
];

const TimeSlots = ({ onSlotSelect, court, date, onBack }) => {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const bookings = await fetchBookingDetails(date.toISOString());
        setBookedSlots(bookings);
      } catch (error) {
        console.error("Failed to load bookings:", error);
      }
    };

    if (date) {
      loadBookings();
    }
  }, [date]);

  const formattedDate = formatDateToYYYYMMDD(date);

  // Determine if each slot is booked
  const isSlotBooked = (slot) => {
    const [slotStartTime, slotEndTime] = slot.time.split(" - ");
    const slotStart = new Date(`${formattedDate} ${slotStartTime}`);
    const slotEnd = new Date(`${formattedDate} ${slotEndTime}`);

    return bookedSlots.some((booking) => {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(bookingStart.getTime() + booking.duration * 1000);

      return (
        booking.cid === court.id &&
        bookingStart < slotEnd &&
        bookingEnd > slotStart
      );
    });
  };

  const handleSlotClick = (index) => {
    if (selectedSlots.length === 0) {
      setSelectedSlots([index]);
    } else {
      const lastSelectedIndex = selectedSlots[selectedSlots.length - 1];
      if (index === lastSelectedIndex + 1) {
        setSelectedSlots([...selectedSlots, index]);
      } else {
        alert("Please select consecutive next time slot only.");
      }
    }
  };

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    selectedSlots.forEach((slotIndex) => {
      const time = availableSlots[slotIndex].time;
      const [startTime] = time.split(" - ");
      const [hourPart, period] = startTime.split(" ");
      const [startHour] = hourPart.split(":").map(Number);
      const isPeak = period === "PM" && startHour >= 5 && startHour !== 12;
      const pricePerSlot = isPeak ? court.peakPrice : court.normalPrice;
      totalPrice += pricePerSlot;
    });
    return totalPrice;
  };

  const handleConfirmBooking = () => {
    const totalPrice = calculateTotalPrice();
    const bookingDetails = {
      timeRange: `${availableSlots[selectedSlots[0]].time.split(" - ")[0]} - ${
        availableSlots[selectedSlots[selectedSlots.length - 1]].time.split(" - ")[1]
      }`,
      totalPrice,
    };
    onSlotSelect(bookingDetails);
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-xl font-bold mb-4">Select Time Slots</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {availableSlots.map((slot, index) => (
          <Button
            key={index}
            variant={selectedSlots.includes(index) ? "contained" : "outlined"}
            color={selectedSlots.includes(index) ? "secondary" : "primary"}
            onClick={() => handleSlotClick(index)}
            disabled={isSlotBooked(slot)} // Disable button if slot is booked
          >
            {slot.time}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {selectedSlots.length > 0 && (
          <>
            <h3 className="text-lg font-semibold">Total Price: Rs. {calculateTotalPrice()}</h3>
            <Button
              variant="contained"
              color="success"
              sx={{marginTop: "15px"}}
              onClick={handleConfirmBooking}
            >
              Confirm Reservation
            </Button>
          </>
        )}
      </div>

      <Button variant="outlined" color="secondary" onClick={onBack} sx={{marginTop: "20px"}}>
        Back
      </Button>
    </div>
  );
};

export default TimeSlots;
