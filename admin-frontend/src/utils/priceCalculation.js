export const calculateTotalPrice = (startTime, duration, cid) => {
    // Fetch the current hour from the start time
    const bookingStartHour = new Date(startTime).getHours();
  
    // Define peak hour as 5 PM (17:00)
    const peakHourStart = 17;
  
    // Fetch prices from localStorage
    const defaultPrices = [
      { normal: 600, peak: 600 },
      { normal: 600, peak: 600 },
      { normal: 600, peak: 600 },
      { normal: 600, peak: 600 },
      { normal: 600, peak: 600 }
    ];
  
    let storedPrices;
  
    try {
      const pricesFromStorage = localStorage.getItem("pricesPerHour");
      storedPrices = pricesFromStorage ? JSON.parse(pricesFromStorage) : defaultPrices;
      
      // Check if the parsed data is valid
      if (!Array.isArray(storedPrices) || storedPrices.length !== defaultPrices.length) {
        throw new Error("Invalid prices structure, falling back to default prices.");
      }
    } catch (error) {
      console.error("Error fetching prices from localStorage:", error.message);
      storedPrices = defaultPrices; // Fallback to default prices
    }
  
    // Get the pricing structure for the selected court
    const courtPrices = storedPrices[cid - 1];
    const { normal, peak } = courtPrices;
    console.log("normal: ", duration)
    console.log("peak: ", peak)
    console.log("Start Time Hour: ", bookingStartHour)

    // Determine if the booking is during peak hours
    const pricePerHour = bookingStartHour >= peakHourStart ? peak : normal;
  
    // Calculate the total price based on duration
    const totalPrice = (pricePerHour / 60) * (duration / 60);
  
    return totalPrice;
  };