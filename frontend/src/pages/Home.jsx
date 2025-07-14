import React, { useEffect, useState } from "react";
import MapComponent from "../components/MapComponents";
import { api } from "../api";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    const fetchRecentTrips = async () => {
      const res = await api.get("/trips/recent");
      setRecentTrips(res.data);
    };
    fetchRecentTrips();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white text-center px-4 py-10 dark:bg-gray-900 dark:text-white">
      <motion.h1
        className="text-5xl font-bold text-blue-700 dark:text-blue-400 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Welcome to RoadTrip Planner 🗺️
      </motion.h1>
      <motion.p
        className="text-lg text-gray-700 dark:text-gray-300 max-w-xl mx-auto mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Plan your perfect adventure by adding trip stops, routes, and photos.
      </motion.p>

      <motion.div
        className="mb-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <MapComponent />
      </motion.div>

      {/* Recent Trips */}
      <div className="mt-10 px-4">
        <motion.h2
          className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          🌟 Recent Trips
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {recentTrips.map((trip, i) => (
            <motion.div
              key={trip._id}
              className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <img
                src={
                  trip.photos && trip.photos.length > 0
                    ? `http://localhost:5000${trip.photos[0]}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={trip.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{trip.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {trip.stops.length} Stops
                </p>
                <Link
                  to={`/trip/${trip._id}`}
                  className="text-blue-600 text-sm hover:underline"
                >
                  View Details
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Destinations */}
      <div className="mt-16 px-4">
        <motion.h2
          className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          🏔️ Top Destinations
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {["manali.jpg", "goa.jpg", "jaipur.jpg"].map((img, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-800 shadow rounded overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <img
                src={`/src/images/${img}`}
                alt="Destination"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  {img.split(".")[0].toUpperCase()}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Scenic beauty and unforgettable memories.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-16 px-4">
        <motion.h2
          className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          💡 Why RoadTrip Planner?
        </motion.h2>
        <motion.ul
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {["🗺️ Plan multi-day trips with map pins.",
            "📷 Upload multiple trip photos.",
            "🗓️ Calendar view for trips.",
            "💾 Save and edit your itineraries.",
            "🌗 Dark mode support.",
            "📥 Download itinerary as PDF.",
          ].map((feature, i) => (
            <motion.li
              key={i}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow text-gray-700 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* Testimonials */}
      <div className="mt-16 px-4">
        <motion.h2
          className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          💬 What Travelers Say
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700 dark:text-gray-300">
          {["Made our Ladakh trip perfect! Loved the itinerary PDF feature.",
            "Simple, beautiful, and useful for travel planning.",
            "Calendar view and photo uploads are amazing!"
          ].map((quote, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {quote}
              <span className="block mt-2 font-semibold text-blue-600">
                – Traveler {i + 1}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <motion.div
        className="mt-20 bg-blue-600 text-white py-12 rounded-lg text-center shadow-md"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-2">
          Start Planning Your Dream Trip Today!
        </h2>
        <p className="mb-4 text-sm">
          Create personalized itineraries and explore like never before.
        </p>
        <Link
          to="/add"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-2 rounded hover:bg-gray-100"
        >
          ➕ Add Your First Trip
        </Link>
      </motion.div>
    </div>
  );
}
