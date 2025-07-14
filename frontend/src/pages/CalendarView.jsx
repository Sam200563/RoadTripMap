import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { api } from "../api";
import { Link } from "react-router-dom";

const CalendarView = () => {
  const [trips, setTrips] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    api.get("/trips/all").then((res) => {
      console.log("✅ All Trips:", res.data);
      setTrips(res.data);
    }).catch((err) => {
      console.error("❌ Failed to fetch trips:", err);
    });
  }, []);

  // Convert to "Thu Jul 11 2025" format
  const formatDateString = (date) => new Date(date).toDateString();

  // Filter trips by selected date
  const tripsOnDate = (date) => {
    const target = formatDateString(date);
    const matches = trips.filter(trip => {
      const tripDate = formatDateString(trip.createdAt);
      return tripDate === target;
    });
    return matches;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">📅 Trip Calendar</h2>

      <Calendar
        onChange={setSelectedDate}
        className="shadow border rounded"
      />

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">
            Trips on {formatDateString(selectedDate)}
          </h3>

          {tripsOnDate(selectedDate).length > 0 ? (
            <div className="space-y-2">
              {tripsOnDate(selectedDate).map((trip) => (
                <div
                  key={trip._id}
                  className="p-4 bg-white rounded shadow hover:bg-gray-50 transition"
                >
                  <Link
                    to={`/trip/${trip._id}`}
                    className="text-blue-600 text-lg font-medium hover:underline"
                  >
                    {trip.name}
                  </Link>
                  <p className="text-gray-500 text-sm">
                    Created on {new Date(trip.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No trips found on this date.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;
