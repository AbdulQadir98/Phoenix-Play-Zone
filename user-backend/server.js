const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for specific origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:4000",
];
app.use(cors());

let clients = []; // Store connected clients for SSE

// SSE Endpoint
app.get("/events", (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Add client to the list
  clients.push(res);

  // Remove client when the connection closes
  req.on("close", () => {
    clients = clients.filter((client) => client !== res);
  });
});

// Send SSE notifications
const sendSSE = (data) => {
  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

// Endpoint to post the duration
app.post("/api/time/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { duration } = req.body;

    if (typeof duration === "number" && duration >= 0) {
      const responseMessage = {
        message:
          duration > 0
            ? "Duration received successfully"
            : "Duration reset successfully",
        duration,
        cid,
      };

      sendSSE(responseMessage); // Notify TV Frontend via SSE

      // Send the response back to frontend1
      res.status(200).send(responseMessage);
    } else {
      res
        .status(400)
        .send({ message: "Invalid duration: must be a number greater than 0" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`User server running at port: ${PORT}`);
});
