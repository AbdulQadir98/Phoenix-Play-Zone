// import axios from 'axios';
// import { PROD_API_URL } from "../constants";

// const apiClient = axios.create({
//   baseURL: 'http://localhost:5000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const fetchTime = () => {
//   return apiClient.get('/time')
//     .then(response => response.data)
//     .catch(error => {
//       console.error('Error fetching time:', error);
//       throw error;
//     });
// };

// const API_URL = 'http://localhost:5000';

// export const fetchTime = async () => {
//   try {
//     const response = await axios.get(`${PROD_API_URL}/api/time`);
//     return response.data.fetchedTime;
//   } catch (error) {
//     console.error('Error fetching time:', error);
//     throw error;
//   }
// };