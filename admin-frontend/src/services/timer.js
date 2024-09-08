import axios from "axios";
import { PROD_API_URL } from '../constants';

// const API_URL = "http://localhost:4000";

export const sendDuration = async (time, cid) => {
  try {
    const response = await axios.post(`${PROD_API_URL}/proxy/time/${cid}`, {
      duration: time,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending duration:", error.message);
    throw error;
  }
};
