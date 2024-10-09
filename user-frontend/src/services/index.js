import { PROD_API_URL } from "../constants";
import axios from "axios";

export const startMatch = async (cid) => {
    try {
        const response = await axios.post(PROD_API_URL + `/start-match/${cid}`, {}, {
            timeout: 4000 // 4 seconds timeout
        });
        return response.data;
    } catch (error) {
        console.error("Error starting match:", error.message);
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
        console.error("Error reseting match:", error.message);
        throw error;
    }
};

export const updateScore = async (cid, increment, isWicket, isWide = false) => {
    try {
        const response = await axios.post(`${PROD_API_URL}/update-score/${cid}`, {
            increment,
            isWicket,
            isWide
        }, {
            timeout: 4000 // 4 seconds timeout
        });
        return response.data;
    } catch (error) {
        console.error("Error updating score", error.message);
        throw error;
    }
};
