const express = require("express");
// const cors = require("cors");

const routes = require("./routes");
const userProxy = require("./proxy")

// const { initCourts, getRemainingTimes } = require("./services");
// initCourts();

const app = express();
const PORT = 4000;

// parse requests of content-type - application/json
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow all origins, or specify a specific origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  next();
});

// Use the admin routes
app.use("/", routes);

// Middleware Proxy to forward requests to user backend
app.use('/proxy', userProxy);

// Start the server
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
});
