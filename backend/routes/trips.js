import express from 'express'
import Trip from '../models/Trip.js'
import auth from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// Create Trip
router.post("/add", auth, upload.array("photos"), async (req, res) => {
  const { name, stops } = req.body;

  const stopData = JSON.parse(stops);
  const photoPaths = req.files.map((file) => "/uploads/" + file.filename);

  const trip = new Trip({
    userId: req.user.id,
    name,
    stops: stopData,
    photos: photoPaths,
  });

  await trip.save();
  res.json({ success: true, trip });
});

// Get All User Trips
router.get("/user", auth, async (req, res) => {
  const trips = await Trip.find({ userId: req.user.id });
  res.json(trips);
});

// Get recent 8 trips
router.get('/recent', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 }).limit(8);
    res.json(trips);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Get all trips (for guests or public listing)
router.get('/all', async (req, res) => {
  try {
    const trips = await Trip.find().sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});



// Get Single Trip
router.get("/:id", async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, error: "Trip not found" });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});


// Edit Trip
router.put("/:id", auth, upload.array("photos"), async (req, res) => {
  const { name, stops, existingPhotos } = req.body;

  let allPhotos = [];
  if (existingPhotos) {
    allPhotos = Array.isArray(existingPhotos) ? existingPhotos : [existingPhotos];
  }

  if (req.files) {
    const uploadedPaths = req.files.map((file) => "/uploads/" + file.filename);
    allPhotos = [...allPhotos, ...uploadedPaths];
  }

  const updatedTrip = await Trip.findByIdAndUpdate(
    req.params.id,
    {
      name,
      stops: JSON.parse(stops),
      photos: allPhotos,
    },
    { new: true }
  );

  res.json(updatedTrip);
});


// Delete Trip
router.delete("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    // Optional: Only allow owner to delete
    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: "Unauthorized" });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

export default router;