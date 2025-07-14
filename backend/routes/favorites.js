import express from 'express'
import User from '../models/User.js'
import auth from '../middleware/auth.js'

const router = express.Router();

// Add to favorites
router.post("/:tripId", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user.favorites.includes(req.params.tripId)) {
    user.favorites.push(req.params.tripId);
    await user.save();
  }
  res.json({ success: true, favorites: user.favorites });
});

// Remove from favorites
router.delete("/:tripId", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  user.favorites = user.favorites.filter(
    (id) => id.toString() !== req.params.tripId
  );
  await user.save();
  res.json({ success: true, favorites: user.favorites });
});

// Get favorite trips
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id).populate("favorites");
  res.json(user.favorites);
});
 export default router