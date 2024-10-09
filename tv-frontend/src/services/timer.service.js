// import { PROD_API_URL } from "../constants";
// import axios from "axios";

// export const resetMatch = async (cid) => {
//     try {
//         const response = await axios.post(PROD_API_URL + `/reset-match/${cid}`, {}, {
//             timeout: 4000 // 4 seconds timeout
//         });
//         return response.data;
//     } catch (error) {
//         console.error("Error reseting match:", error.message);
//         throw error;
//     }
// };