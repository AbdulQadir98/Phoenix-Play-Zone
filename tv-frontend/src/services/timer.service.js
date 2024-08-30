import axios from 'axios';

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

const baseURL = 'http://localhost:5000';

export const fetchTime = async () => {
  try {
    const response = await axios.get(`${baseURL}/time`);
    return response.data.fetchedTime;
  } catch (error) {
    console.error('Error fetching the number:', error);
    throw error;
  }
};