import { PROD_API_URL } from "../constants";
import axios from "axios";

export const startMatch = async (cid) => {
    try {
        const response = await axios.post(PROD_API_URL + `/start-match/${cid}`, {}, {
            timeout: 4000 // 4 seconds timeout
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resetMatch = async (cid) => {
    try {
        const response = await axios.post(PROD_API_URL + `/reset-match/${cid}`, {}, {
            timeout: 4000 // 4 seconds timeout
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateScore = async (cid, increment, isWicket, isWide = false, isDot = false) => {
    try {
        const response = await axios.post(`${PROD_API_URL}/update-score/${cid}`, {
            increment,
            isWicket,
            isWide,
            isDot
        }, {
            timeout: 4000 // 4 seconds timeout
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const undoScore = async (cid) => {
    try {
      const response = await axios.post(`${PROD_API_URL}/undo-score/${cid}`, {}, {
        timeout: 4000,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  