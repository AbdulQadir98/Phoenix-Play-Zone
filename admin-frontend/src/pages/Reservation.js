import { useState } from 'react';
import CourtSelection from '../components/CourtSelection';
import DatePickerComponent from '../components/DatePickerComponent';
import TimeSlots from '../components/TimeSlots';
import BookingConfirmation from '../components/BookingConfirmation';

import { Container } from '@mui/material';

const Reservation = () => {
    const [court, setCourt] = useState(null);
    const [date, setDate] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null); // Store final booking details
  
    const handleCourtSelect = (selectedCourt) => setCourt(selectedCourt);
    const handleDateSelect = (selectedDate) => setDate(selectedDate);
    
    const handleSlotSelect = (details) => {
      setBookingDetails({ ...details, court, date }); // Combine with court and date
    };
  
    const handleBackToCourtSelection = () => {
      setCourt(null);
      setDate(null);
      setBookingDetails(null);
    };
  
    const handleBackToDateSelection = () => {
      setDate(null);
      setBookingDetails(null);
    };
  
    return (
      <Container>
        {!court && <CourtSelection onSelectCourt={handleCourtSelect} />}
        {court && !date && (
          <DatePickerComponent onDateSelect={handleDateSelect} onBack={handleBackToCourtSelection} />
        )}
        {court && date && !bookingDetails && (
          <TimeSlots court={court} date={date} onSlotSelect={handleSlotSelect} onBack={handleBackToDateSelection} />
        )}
        {bookingDetails && (
          <BookingConfirmation bookingDetails={bookingDetails} />
        )}
      </Container>
    );
  };
 
export default Reservation;