import axios from "axios";
import { PROD_API_URL } from "../constants";

// const API_URL = 'http://localhost:8082/api/bookings';

export const fetchCompletedPendingCancelledBookings = async (page, pageSize) => {
  try {
    const response = await axios.get(PROD_API_URL + "/booking", {
      params: { status: "PENDING,COMPLETED,CANCELLED", page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    throw error;
  }
};

export const fetchWebBookings = async (page, pageSize) => {
  try {
    const response = await axios.get(PROD_API_URL + "/booking", {
      params: { status: "PAID", page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Web bookings:", error.message);
    throw error;
  }
};

export const fetchRecentWebBookings = async (page, pageSize, date_from, date_to) => {
  try {
    const response = await axios.get(PROD_API_URL + "/range-booking", {
      params: { status: "PAID", page, pageSize, date_from, date_to },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Recent Web bookings:", error.message);
    throw error;
  }
};

// // from SimplyBookMe Developer API  /booking's'
// export const fetchWebBookings = async (page, pageSize, date_from, date_to) => {
//   try {
//     const response = await axios.get(PROD_API_URL + "/bookings", {
//       params: { page, pageSize, date_from, date_to },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching Web bookings:", error.message);
//     throw error;
//   }
// };

export const sendBookingDetails = (bookingDetails) => {
  return axios.post(PROD_API_URL + "/booking", {
    bookingDetails,
  }, {
    timeout: 6000 // 6 seconds
  });
};

export const updateBookingStatus = (id, status, endTime) => {
  return axios.patch(PROD_API_URL + `/booking/${id}/status`, {
    status,
    endTime,
  }, {
    timeout: 6000 // 6 seconds timeout
  });
};
