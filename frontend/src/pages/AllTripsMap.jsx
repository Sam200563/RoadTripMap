import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { api } from "../api";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

// Fix for default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const AllTripsMap = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    api.get("/trips/all").then((res) => {
      setTrips(res.data);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">🗺️ All Trip Locations</h2>
      <MapContainer center={[20, 78]} zoom={2} className="h-96 w-full rounded">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {trips.map((trip) =>
          trip.stops.map((stop, i) => (
            <Marker key={`${trip._id}-${i}`} position={[stop.lat, stop.lng]}>
              <Popup>
                <strong>{trip.name}</strong>
                <br />
                <Link
                  to={`/trip/${trip._id}`}
                  className="text-blue-600 underline"
                >
                  View Trip
                </Link>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default AllTripsMap;
