const db = require("./firebase");
const axios = require("axios");

const companyLogin = "phoenixzone";
const userLogin = "abdul.qadirv98@gmail.com";
const userPassword = "Abdul@123";
const LOGIN_API_URL = "https://user-api.simplybook.me/login";
const ADMIN_API_URL = "https://user-api.simplybook.me/admin/";

// Get the user token from the API
const getUserToken = async () => {
  try {
    const response = await axios.post(LOGIN_API_URL, {
      jsonrpc: "2.0",
      method: "getUserToken",
      params: {
        companyLogin,
        userLogin,
        userPassword,
      },
      id: 1,
    });
    return response.data.result;
  } catch (error) {
    // console.error(
    //   "Error getting user token:",
    //   error.response ? error.response.data : error.message
    // );
    throw new Error('Unable to get user token');
  }
};

// Fetch bookings from SimplyBookme
const fetchSimplyWebBookings = async (page, pageSize, date_from, date_to) => {
  const offset = (page - 1) * pageSize;

  try {
    const token = await getUserToken();
    if (!token) {
      // console.error("Unable to fetch token, aborting fetch bookings.");
      return;
    }

    const response = await axios.post(
      ADMIN_API_URL,
      {
        jsonrpc: "2.0",
        method: "getBookings",
        params: [
          {
            date_from: date_from, // Start date
            date_to: date_to, // End date
            booking_type: "all", // Get all bookings
            order: "start_date", // Order by start date
          },
        ],
        id: 1,
      },
      {
        headers: {
          "X-Company-Login": companyLogin,
          "X-User-Token": token,
        },
      }
    );

    // bookingID: id or code?
    if (response.data && response.data.result) {
      const bookings = response.data.result.map((booking) => {
        return {
          booking_id: booking.code,
          name: booking.client,
          start_date: booking.start_date,
          court: booking.unit,
          status: booking.payment_status,
          duration: booking.event_duration,
          contact: booking.client_phone,
          price: booking.event_price,
        };
      });

      return bookings;
    } else {
      throw new Error("No bookings found in the response.");
    }
  } catch (error) {
    // console.error(
    //   "Error fetching bookings:",
    //   error.response ? error.response.data : error.message
    // );
    throw new Error('Failed to fetch bookings');
  }
};

const getBookings = async (page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;
    const snapshot = await db
      .collection("bookingDetails")
      .orderBy("startTime", "desc")
      .offset(offset)
      .limit(pageSize)
      .get();
      return snapshot.docs.map((doc) => ({
        bookingId: doc.id, // Include the document ID
        ...doc.data(), // Spread the document data
      }));
  } catch (error) {
    // console.error("Error fetching users:", error.message);
    throw error;
  }
};

const getBookingsCount = async () => {
  try {
    const snapshot = await db.collection("bookingDetails").get();
    return snapshot.size;
  } catch (error) {
    console.error("Error fetching bookings count:", error.message);
    throw error;
  }
};

const getBookingsByStatus = async (status, page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;
    const snapshot = await db
      .collection("bookingDetails")
      .where("status", "in", status)
      .orderBy("startTime", "desc")
      .offset(offset)
      .limit(pageSize)
      .get();

      return snapshot.docs.map((doc) => ({
        bookingId: doc.id,
        ...doc.data(),
      }));
  } catch (error) {
    console.error("Error fetching bookings by status:", error.message);
    throw error;
  }
};

const getBookingsByStatusCount = async (status) => {
  try {
    const snapshot = await db
      .collection("bookingDetails")
      .where("status", "in", status)
      .get();

    return snapshot.size;
  } catch (error) {
    console.error("Error fetching bookings by status count:", error.message);
    throw error;
  }
};

const getBookingsByStatusAndDate = async (status, date_from, date_to, page, pageSize) => {
  try {
    const offset = (page - 1) * pageSize;
    const snapshot = await db
      .collection("bookingDetails")
      .where("status", "in", status)
      .where("startTime", ">=", date_from)
      .where("startTime", "<=", date_to)
      .orderBy("startTime", "asc")
      .offset(offset)
      .limit(pageSize)
      .get();

      return snapshot.docs.map((doc) => ({
        bookingId: doc.id,
        ...doc.data(),
      }));
  } catch (error) {
    console.error("Error fetching bookings by range:", error.message);
    throw error;
  }
};

const getBookingsByStatusAndDateCount = async (status, date_from, date_to) => {
  try {
    const snapshot = await db
      .collection("bookingDetails")
      .where("status", "in", status)
      .where("startTime", ">=", date_from)
      .where("startTime", "<=", date_to)
      .get();
    return snapshot.size;
  } catch (error) {
    console.error("Error fetching bookings by range count:", error.message);
    throw error;
  }
};

// no pagination
const getAllBookingsByStatus = async (status) => {
  try {
    const snapshot = await db
      .collection("bookingDetails")
      .where("status", "in", status)
      .orderBy("startTime", "desc")
      .get();

      return snapshot.docs.map((doc) => ({
        bookingId: doc.id,
        ...doc.data(),
      }));
  } catch (error) {
    console.error("Error fetching bookings by status without pagination:", error.message);
    throw error;
  }
};

const getBookingsByDate = async (status, date) => {
  try {
    // Convert the input date to a UTC start and end timestamp for the entire day
    const startOfDay = new Date(date);
    // startOfDay.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
    startOfDay.setHours(0, 0, 0, 0); // Set to midnight
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

    const snapshot = await db
    // TODO: bookingtest
      .collection("bookingDetails")
      .where("status", "in", status)
      .where("startTime", ">=", startOfDay.toISOString())
      .where("startTime", "<=", endOfDay.toISOString())
      .orderBy("startTime", "asc")
      .get();

    return snapshot.docs.map((doc) => ({
      bookingId: doc.id,
      ...doc.data(),
    }));

  } catch (error) {
    console.error("Error fetching bookings by date:", error.message);
    throw error;
  }
};

const getBookingById = async (id) => {
  try {
    const bookingDoc = await db.collection("bookingDetails").doc(id).get();

    if (bookingDoc.exists) {
      return bookingDoc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching booking:", error.message);
    throw error;
  }
};

const addBookingDetails = async (bookingDetails) => {
  try {
    // TODO: bookingtest
    const docRef = await db.collection("bookingDetails").add(bookingDetails);
    return {
      success: true,
      message: "Booking details stored successfully.",
      id: docRef.id,
    };
  } catch (error) {
    console.error("Error writing booking details: ", error.message);
    throw error;
  }
};

const deleteBookingById = async (id) => {
  try {
    const bookingRef = db.collection("bookingDetails").doc(id);
    const doc = await bookingRef.get();

    if (doc.exists) {
      await bookingRef.delete(); // Delete the document
      return { success: true };
    } else {
      return { success: false }; // Document not found
    }
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    throw error;
  }
};

const updateBookingStatus = async (id, { status, endTime }) => {
  try {
    const bookingRef = db.collection("bookingDetails").doc(id);
    const doc = await bookingRef.get();

    if (doc.exists) {
      const updateData = { status };
      if (endTime) {
        updateData.endTime = endTime;
      }
      await bookingRef.update(updateData);
      return { success: true };
    } else {
      return { success: false }; // Document not found
    }
  } catch (error) {
    console.error("Error updating booking status:", error.message);
    throw error;
  }
};

///////////////////////////////////////////////////////////////////////////////

let courts = [];
const initCourts = () => {
  courts = Array(3)
    .fill(null)
    .map((_, i) => ({
      courtNumber: i + 1,
      isAllocated: false,
      startTime: null,
      duration: null,
    }));
};

const getCourt = async (courtNumber) => {
  try {
    const number = Number(courtNumber);
    if (isNaN(number)) {
      throw new Error("Invalid court number");
    }
    const court = courts.find((court) => court.courtNumber === number);
    if (!court) {
      throw new Error(`Court number ${courtNumber} not found`);
    }
    return court;
  } catch (error) {
    console.error("Error in getCourt Method", error.message);
    return null;
  }
};

function setCourt(courtNumber, court) {
  const index = courts.findIndex((c) => c.courtNumber === courtNumber);
  if (index !== -1) {
    courts[index] = court;
  }
}

function isCourtAvailable(courtNumber) {
  const court = courts.find((c) => c.courtNumber === courtNumber);
  if (!court) return false;

  if (!court.isAllocated) return true;

  // TF is this?
  const now = new Date();
  const endTime = new Date(court.startTime);
  endTime.setMinutes(endTime.getMinutes() + court.duration);

  return now >= endTime;
}

// Function to get remaining time for all courts
const getRemainingTimes = async () => {
  if (!courts) {
    console.error("courts are unable to fetch");
  }
  try {
    const results = courts.map((court) => {
      if (!court.isAllocated) {
        return {
          courtNumber: court.courtNumber,
          message: "Court not allocated",
        };
      }

      const elapsedTime = new Date() - new Date(court.startTime); // Ensure startTime is a Date object
      const remainingTime = Math.max(
        0,
        (court.duration * 60 * 1000 - elapsedTime) / 1000 / 60
      ); // Convert remaining time to minutes

      return { courtNumber: court.courtNumber, remainingTime };
    });
    // console.log('Remaining Times', results)
    return results;
  } catch (error) {
    console.error("Error in getRemainingTimes Method", error.message);
  }
};

module.exports = {
  fetchSimplyWebBookings,
  getBookings,
  getBookingsCount,
  getBookingsByStatus,
  getBookingsByStatusCount,
  getBookingsByStatusAndDate,
  getBookingsByStatusAndDateCount,
  getAllBookingsByStatus,
  getBookingsByDate,
  getBookingById,
  addBookingDetails,
  deleteBookingById,
  updateBookingStatus,
  initCourts,
  getCourt,
  setCourt,
  isCourtAvailable,
  getRemainingTimes,
};
