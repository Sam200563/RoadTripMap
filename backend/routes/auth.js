import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Trip from '../models/Trip.js'
import auth from '../middleware/auth.js'

const router = express.Router()
// Register
router.post("/register", async (req, res) => {
  const { name,email, password ,phone,country,state} = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, country, state, password: hash });
    await user.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: "User already exists or invalid data" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.json({ success: false, error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ success: true, 
    token,
    user:{
    _id:user._id,
    name:user.name,
    email:user.email
  } });
});

// Add this route at the bottom of auth.js
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const trips = await Trip.find({ userId: req.user.id });

    res.json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        state: user.state,
        totalTrips: trips.length,
        favorites: user.favorites,
      },
    });
  } catch (err) {
    console.error("Profile fetch failed:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Update profile
router.put("/profile", auth, async (req, res) => {
  const { name, phone, country, state } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, country, state },
      { new: true }
    ).populate("favorites");

    const totalTrips = await Trip.countDocuments({ userId: req.user.id });
    res.json({
      success: true,
      profile: {
        ...updatedUser.toObject(),
        totalTrips,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Profile update failed" });
  }
});


export default router;