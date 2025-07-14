import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

const TripsList = () => {
  const [trips, setTrips] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchTrips = async () => {
      try {
        const endpoint = storedUser ? "/trips/user" : "/trips/all";
        const res = await api.get(endpoint);
        setTrips(res.data);
      } catch (err) {
        console.error("Failed to load trips:", err);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        {user ? "Your Trips" : "All Trips"}
      </h2>

      {trips.length === 0 ? (
        <p className="text-gray-500">No trips available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
            >
              <img
                src={
                  trip.photos && trip.photos.length > 0
                    ? `http://localhost:5000${trip.photos[0]}`
                    : "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={trip.name}
                className="w-full h-40 object-cover rounded"
              />

              <h3 className="text-lg font-semibold mt-2">{trip.name}</h3>
              <p className="text-sm text-gray-600">{trip.stops.length} stops</p>
              <Link
                to={`/trip/${trip._id}`}
                className="text-blue-500 text-sm hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripsList;
