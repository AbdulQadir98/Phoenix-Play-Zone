const express = require("express");
const axios = require("axios");
const router = express.Router();

const PROD_API_URL = "http://192.168.1.100:5000"
// const API_URL = "http://localhost:5000"

router.post("/time/:cid", async (req, res) => {
  const { cid } = req.params;
  const duration = req.body.duration;

  try {
    // Forward the request to server user-backend (:5000)
    const response = await axios.post(`${PROD_API_URL}/api/time/${cid}`, {
      duration,
    });
    // Get the response from server 5000 back to the admin
    res.json(response.data);
  } catch (error) {
    console.error("Error proxying request to server 5000:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
