import axios from "axios";

// const API_URL = 'http://localhost:8082/api/court';

export function getCourts() {
  return axios.get(API_URL + "/");
}

export function getCourt(cid) {
  return axios.get(API_URL + `/${cid}`);
}

///////////////////////////////////////////
const API_URL = "http://localhost:4000";
// const API_URL = "http://192.168.8.189:4000";

export const fetchCompletedPendingCancelledBookings = async (page, pageSize) => {
  try {
    const response = await axios.get(API_URL + "/booking", {
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
    const response = await axios.get(API_URL + "/booking", {
      params: { status: "NEW,CLOSED", page, pageSize },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Web bookings:", error.message);
    throw error;
  }
};

export const sendBookingDetails = (bookingDetails) => {
  return axios.post(API_URL + "/booking", {
    bookingDetails,
  });
};

export const deleteBooking = (id) => {
  return axios.delete(API_URL + `/booking/${id}`);
};

export const updateBookingStatus = (id, status, endTime) => {
  return axios.patch(API_URL + `/booking/${id}/status`, {
    status,
    endTime 
  });
};
