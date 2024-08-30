const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Enable CORS for specific origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];
app.use(cors({
    origin: allowedOrigins
}));

app.get('/time', async (req, res) => {
  try {
    // const response = await axios.get('http://localhost:4000/getNumber');
    // const number = response.data.number;
    res.json({ fetchedTime: 10 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the number' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
