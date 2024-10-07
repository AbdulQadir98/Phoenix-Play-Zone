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

let isMatchStarted = false; 
let scores = {
  1: { runs: 0, wickets: 0, balls: 0 },
  2: { runs: 0, wickets: 0, balls: 0 },
}; 

// SSE Endpoint
app.get("/events", (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send the current state when the client connects
  res.write(`data: ${JSON.stringify({ isMatchStarted, scores })}\n\n`);

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

// ************** user score app backend **************

// Endpoint to start the match
app.post("/start-match/:cid", (req, res) => {
  const { cid } = req.params;

  isMatchStarted = true;
  scores[cid] = { runs: 0, wickets: 0, balls: 0 };
  sendSSE({ isMatchStarted, scores, cid }); // Notify all clients
  res.status(200).json({ message: "Match started", isMatchStarted });
});

// Endpoint to reset the match
app.post("/reset-match/:cid", (req, res) => {
  const { cid } = req.params;

  isMatchStarted = false;
  scores[cid] = { runs: 0, wickets: 0, balls: 0 };
  sendSSE({ isMatchStarted, scores, cid }); // Notify all clients
  res.status(200).json({message: "Match reset", isMatchStarted, scores: scores[cid]});
});

// Endpoint to update the score
app.post("/update-score/:cid", (req, res) => {
  const { increment, isWicket } = req.body;
  const { cid } = req.params;

  if (isMatchStarted) {
    if (isWicket) {
      scores[cid].wickets += 1; // Increment wickets
    } else {
      scores[cid].runs += increment; // Update the score
    }

    // Increment ball count after every update
    scores[cid].balls += 1;

    sendSSE({ isMatchStarted, scores, cid }); // Notify clients of score, wickets, and overs update
    return res.status(200).json({ message: "Score updated", scores: scores[cid] });
  }

  res.status(400).json({ message: "Invalid request or match not started" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`User server running at port: ${PORT}`);
});
