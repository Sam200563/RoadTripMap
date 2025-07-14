import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [trips, setTrips] = useState([]);

  // fetch favorites
  const fetchFavorites = async () => {
    try {
      const res = await api.get("/favorites");
      setTrips(res.data);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // Remove favorite handler
  const handleRemove = async (tripId) => {
    try {
      await api.delete(`/favorites/${tripId}`);
      // Remove it from local state
      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (err) {
      alert("Failed to remove from favorites");
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-blue-600">❤️ Your Saved Trips</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip._id} className="bg-white rounded shadow p-4 relative">
            <img
              src={trip.photos[0] || "https://via.placeholder.com/300"}
              alt="Trip"
              className="h-40 w-full object-cover rounded"
            />
            <h3 className="mt-2 font-semibold">{trip.name}</h3>
            <Link
              to={`/trip/${trip._id}`}
              className="text-blue-600 text-sm hover:underline"
            >
              View Details
            </Link>

            {/* 🗑️ Delete icon */}
            <button
              onClick={() => handleRemove(trip._id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg"
              title="Remove from favorites"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {trips.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No saved trips yet.</p>
      )}
    </div>
  );
};

export default Favorites;
