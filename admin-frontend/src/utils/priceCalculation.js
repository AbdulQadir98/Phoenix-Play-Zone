export const calculateTotalPrice = (startTime, durationInSeconds, cid) => {
  
  const peakHourStart = 17; // Peak time starts at 5 PM (17:00)
  const oneHourInSeconds = 3600;

  // Fetch prices from localStorage or fallback to default
  const defaultPrices = [
    { normal: 3000, peak: 4000 },
    { normal: 3000, peak: 4000 },
    { normal: 800, peak: 1000 },
    { normal: 2250, peak: 2250 },
    { normal: 1250, peak: 1250 },
  ];

  let storedPrices;
  try {
    const pricesFromStorage = localStorage.getItem("pricesPerHour");
    console.log("Price from storage: ", pricesFromStorage);
    storedPrices = pricesFromStorage ? JSON.parse(pricesFromStorage) : defaultPrices;

    if ( !Array.isArray(storedPrices) || storedPrices.length !== defaultPrices.length) {
      throw new Error( "Invalid prices structure, falling back to default prices.");
    }
  } catch (error) {
    console.error("Error fetching prices from localStorage:", error.message);
    storedPrices = defaultPrices;
  }

  // Get court prices
  const courtPrices = storedPrices[cid - 1];
  console.log(courtPrices.normal);
  console.log(courtPrices.peak);

  // Convert start time to Date object and extract the hour
  const startDate = new Date(startTime);
  const bookingStartHour = startDate.getHours();

  // Calculate the end time of the booking in seconds from the start time
  const endDate = new Date(startDate.getTime() + durationInSeconds * 1000);
  const bookingEndHour = endDate.getHours();

  // Initialize total cost
  let totalCost = 0;

  // Calculate the total time in normal hours and peak hours
  if (bookingEndHour <= peakHourStart && bookingStartHour < peakHourStart) {
    // Case 1: Entire booking is within normal hours
    totalCost = (courtPrices.normal / oneHourInSeconds) * durationInSeconds;
  } else if (bookingStartHour >= peakHourStart) {
    // Case 2: Entire booking is within peak hours
    totalCost = (courtPrices.peak / oneHourInSeconds) * durationInSeconds;
  } else {
    // Case 3: Booking spans both normal and peak hours

    // Calculate peak start time in seconds from start date
    const peakStartTime = new Date(startDate);
    peakStartTime.setHours(peakHourStart, 0, 0, 0); // Set peak time to exactly 17:00:00

    // Time until peak hour starts (if booking starts before peak hour)
    const timeInNormalHours = Math.max(
      0,
      (peakStartTime.getTime() - startDate.getTime()) / 1000
    );

    // Time after peak hour starts
    const timeInPeakHours = Math.max(0, durationInSeconds - timeInNormalHours);

    // Calculate cost for both periods
    const normalCost =
      (courtPrices.normal / oneHourInSeconds) * timeInNormalHours;
    const peakCost = (courtPrices.peak / oneHourInSeconds) * timeInPeakHours;

    // Total cost is the sum of both
    totalCost = normalCost + peakCost;
  }

  return totalCost;
};