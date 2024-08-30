const express = require("express");
// const cors = require("cors");
// const cron = require('node-cron');
// const redis = require('redis');

const routes = require("./routes");
// const { initCourts, getRemainingTimes } = require("./services");

const app = express();

const port = 4000;

// parse requests of content-type - application/json
app.use(express.json());

// // for DEBUG as storage management
// initCourts();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins, or specify a specific origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
});

// "proxy": "http://example.com/api"

// // Use the routes
app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Express server is running at http://localhost:${port}`);
});
