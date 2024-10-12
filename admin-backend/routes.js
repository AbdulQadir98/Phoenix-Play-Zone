const express = require("express");
const router = express.Router();

//double check awaits and no else?
const {
  fetchSimplyWebBookings,
  getBookings,
  getBookingsCount,
  getBookingsByStatus,
  getBookingsByStatusCount,
  getBookingsByStatusAndDate,
  getBookingsByStatusAndDateCount,
  getAllBookingsByStatus,
  getBookingById,
  addBookingDetails,
  deleteBookingById,
  updateBookingStatus,
  getCourt,
  setCourt,
  isCourtAvailable,
  getRemainingTimes,
  DiplayCourts,
} = require("./services");

// Get All Bookings from SimplyBookMe (Depreciated)
router.get("/simplybookme-bookings", async (req, res) => {
  const { page = 1, pageSize = 5, date_from, date_to } = req.query;

  try {
    const bookings = await fetchSimplyWebBookings(parseInt(page), parseInt(pageSize), date_from, date_to);
    if (!bookings) {
      return res.status(404).json({ error: 'No bookings found' });
    }
    const totalCount = bookings.length;
    res.status(200).json({ bookings, totalCount });
  } catch (error) {
    console.error("Error in simplybookme route:", error.message);
    res.status(500).json({ error: "Failed to fetch web bookings" });
  }
});

// Get All Bookings or Filter by Statuses
router.get("/booking", async (req, res) => {
  
  const { status, page = 1, pageSize = 5 } = req.query; // Default to page 1 and 5 users per page

  try {
    let bookings;
    let totalCount;

    if (status) {
      const statusArray = status.split(",");
      bookings = await getBookingsByStatus(statusArray, parseInt(page), parseInt(pageSize));
      totalCount = await getBookingsByStatusCount(statusArray);
    } else {
      bookings = await getBookings(parseInt(page), parseInt(pageSize));
      totalCount = await getBookingsCount();
    }
    // console.log(bookings + " " + totalCount);
    return res.status(200).json({ bookings, totalCount });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
});

// Get All Bookings or Filter by Statuses without pagination
router.get("/bookings", async (req, res) => {
  
  const { status } = req.query; 

  try {
    let bookings;

    if (status) {
      const statusArray = status.split(",");
      bookings = await getAllBookingsByStatus(statusArray);
    } else {
      return res.status(500).json({error: "No status specified", message: err.message});
    }
    return res.status(200).json({ bookings});
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
});

// Get Bookings for a specific date range
router.get("/range-booking", async (req, res) => {
  
  const { status, page = 1, pageSize = 5, date_from, date_to  } = req.query; // Default to page 1 and 5 users per page

  try {
    let bookings;
    let totalCount;

    const statusArray = status ? status.split(",") : ["PENDING", "COMPLETED", "CANCELLED", "DELETED", "PAID"];

    if (date_from && date_to) {
      bookings = await getBookingsByStatusAndDate(statusArray, date_from, date_to, parseInt(page), parseInt(pageSize));
      totalCount = await getBookingsByStatusAndDateCount(statusArray, date_from, date_to);
      // totalCount = 100
    } else {
      return res.status(500).json({error: "No date range specified", message: err.message});
    }
    // console.log(bookings + " " + totalCount);
    return res.status(200).json({ bookings, totalCount });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
});

router.get("/booking/:id", async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await getBookingById(bookingId);

    if (booking) {
      return res.status(200).json(booking);
    } else {
      return res
        .status(404)
        .json({ error: "Booking not found for id : " + bookingId });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
});

// Add Booking
router.post("/booking", async (req, res) => {
  try {
    const { bookingDetails } = req.body;
    // console.log("Req Booking payload: ", bookingDetails);

    const result = await addBookingDetails(bookingDetails);
    // console.log("Resp Booking Id: ", result.id);
    if (result.success) {
      return res.status(201).json({
        message: "Booking created successfully.",
        bookingId: result.id,
      });
    } else {
      return res.status(500).json({ error: result.message });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

// Delete Booking
router.delete("/booking/:id", async (req, res) => {
  const bookingId = req.params.id;

  try {
    const result = await deleteBookingById(bookingId);

    if (result.success) {
      return res.status(200).json({ message: "Booking deleted successfully." });
    } else {
      return res.status(404).json({
        error: "Booking not found",
        bookingId: bookingId,
      });
    }
  } catch (error) {
    console.error("Error deleting booking:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

// Update Booking Status
router.patch("/booking/:id/status", async (req, res) => {
  const bookingId = req.params.id;
  const { status, endTime } = req.body;

  // Define allowed statuses
  const allowedStatuses = ["PENDING", "CANCELLED", "COMPLETED", "DELETED", "PAID"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  try {
    // console.log(status)
    const result = await updateBookingStatus(bookingId, { status, endTime });

    if (result.success) {
      return res
        .status(200)
        .json({ message: "Booking status updated successfully." });
    } else {
      return res.status(404).json({
        error: "Booking not found",
        bookingId: bookingId,
      });
    }
  } catch (error) {
    console.error("Error updating booking status:", error.message);
    return res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////

// FOR DEBUGGING
router.get("/test", async (req, res) => {
  try {
    const result = getRemainingTimes();
    const lowTimeMessages = [];
    // const timesUpMessages = [];

    result.forEach((court) => {
      if (court.remainingTime !== undefined) {
        if (court.remainingTime <= 0) {
          const message = `Court ${court.courtNumber} time's up.`;
          // timesUpMessages.push(message);
          lowTimeMessages.push(message);
        } else if (court.remainingTime < 2) {
          const message = `Court ${court.courtNumber} has less than 2 minutes remaining.`;
          lowTimeMessages.push(message);
        } else if (court.remainingTime < 5) {
          const message = `Court ${court.courtNumber} has less than 5 minutes remaining.`;
          lowTimeMessages.push(message);
        }
      }
    });

    res.json({ result, lowTimeMessages });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
});

// Allocate a court
router.post("/allocate/:courtNumber", async (req, res) => {
  const courtNumber = Number(req.params.courtNumber); // BUG FIXED
  const { duration } = req.body;
  if (!courtNumber || !duration) {
    return res
      .status(400)
      .json({ error: "Court number and duration are required" });
  }

  try {
    // check court availability
    if (!isCourtAvailable(courtNumber)) {
      return res.status(400).json({ error: "Court is not available" });
    }
    const court = {
      courtNumber,
      isAllocated: true,
      startTime: new Date(),
      duration,
    };
    setCourt(courtNumber, court);
    res.json(court);
  } catch (error) {
    console.error("Error allocating court: ", error);
    res.status(500).send("Internal Server Error");
  }
  console.log("Allocated Successfully", DiplayCourts());
});

// Release a court
router.patch("/release/:courtNumber", async (req, res) => {
  const courtNumber = Number(req.params.courtNumber);

  if (!courtNumber) {
    return res.status(400).json({ error: "Court number is required" });
  }

  try {
    const court = await getCourt(courtNumber);
    console.log(court);
    if (!court || !court.isAllocated) {
      return res.status(400).json({ error: "Court is not allocated" });
    }

    court.isAllocated = false;
    court.duration = null;
    court.startTime = null;
    setCourt(courtNumber, court);
    res.json(court);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log("Released Successfully", DiplayCourts());
});

// Update time
// TODO: not replace have to add the duration to the current time
router.patch("/court/:courtNumber", async (req, res) => {
  const courtNumber = Number(req.params.courtNumber);
  const { duration } = req.body;

  if (!courtNumber) {
    return res.status(400).json({ error: "Court number is required" });
  }

  try {
    const court = await getCourt(courtNumber);
    if (!court) {
      return res.status(404).json({ error: "Court not found" });
    }

    // Update court duration
    if (duration !== undefined) court.duration = duration;

    await setCourt(courtNumber, court);
    res.json(court);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log("Updated Successfully", DiplayCourts());
});

// Get remaining time for a court
router.get("/time/:courtNumber", async (req, res) => {
  const courtNumber = Number(req.params.courtNumber);
  if (!courtNumber) {
    return res.status(400).json({ error: "Court number is required" });
  }

  try {
    const court = await getCourt(courtNumber);
    if (!court || !court.isAllocated) {
      return res.status(404).json({ message: "Court not allocated" });
    }
    const elapsedTime = new Date() - new Date(court.startTime);
    // console.log(`Remaining time: ${Math.floor(remainingTime / 1000 / 60)} minutes and ${Math.floor((remainingTime / 1000) % 60)} seconds`);
    // const remainingTime = (court.duration*60*1000 - elapsedTime) / 1000 / 60;
    const remainingTime = Math.max(
      0,
      (court.duration * 60 * 1000 - elapsedTime) / 1000 / 60
    );
    res.json({ remainingTime });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
  console.log("Check Remaining Time Completed", DiplayCourts());
});

module.exports = router;

// // GET all court details? Lets Have it in Frontend :P
// router.get('/court', async (req, res) => {
//     try {
//         res.json(courts);
//     } catch (err) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // Get court status
// app.get('/court/:courtNumber', async (req, res) => {
//     const { courtNumber } = req.params;
//     if (!courtNumber) {
//         return res.status(400).json({ error: 'Court number is required' });
//     }
//     try {
//         const court = await getCourt(courtNumber);
//         if (!court) {
//             return res.status(404).json({ error: 'Court not found' });
//         }
//         res.json(court);
//     } catch (err) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // store court details in firebase
// router.post('/:cid', async (req, res) => {
//     const { cid } = req.params;
//     const courtDetails = req.body;

//     console.log(`Received details for CID: ${cid}`);
//     console.log(`Court Details:`, courtDetails);

//     const result = await addCourtDetails(courtDetails);
//     if (result.success) {
//         res.status(200).send(result.message);
//     } else {
//         res.status(500).send(result.message);
//     }

// });
