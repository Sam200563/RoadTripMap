import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import jsPDF from "jspdf";

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TripDetail = () => {
  const [trip, setTrip] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const res = await api.get(`/trips/${id}`);
        setTrip(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchTrip();
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this trip?")) {
      try {
        await api.delete(`/trips/${id}`);
        alert("Trip deleted successfully");
        navigate("/trips");
      } catch (err) {
        alert("Failed to delete trip");
        console.error(err);
      }
    }
  };

  const handleFavorite = async () => {
    try {
      await api.post(`/favorites/${id}`);
      alert("Trip saved to favorites!");
    } catch (err) {
      alert("Login to save trips.");
    }
  };

  const downloadPDF = async () => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(33, 150, 243);
  doc.text(trip.name, 105, y, { align: "center" });
  y += 12;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text("Itinerary", 10, y);
  y += 10;

  // ✅ Group stops by day (instead of slicing fixed number)
  const groupedStops = trip.stops.reduce((acc, stop) => {
    const day = stop.day || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(stop);
    return acc;
  }, {});

  // ✅ Sort days numerically
  const sortedDays = Object.keys(groupedStops)
    .map(Number)
    .sort((a, b) => a - b);

  for (let day of sortedDays) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`Day ${day}`, 10, y);
    y += 8;

    groupedStops[day].forEach((stop) => {
      doc.setDrawColor(200);
      doc.rect(10, y, 190, 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`Name: ${stop.name}`, 12, y + 6);
      doc.text(`Lat: ${stop.lat}, Lng: ${stop.lng}`, 12, y + 12);
      doc.text(`Description: ${stop.description}`, 12, y + 18);
      y += 24;

      if (y > 260) {
        doc.addPage();
        y = 20;
      }
    });
  }

  // ✅ Photos section
  if (trip.photos.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Photos", 10, y);
    y += 10;

    for (const url of trip.photos) {
      const fullUrl = `http://localhost:5000${url}`;

      try {
        const imgData = await toBase64(fullUrl);
        doc.addImage(imgData, "JPEG", 12, y, 60, 40);
        y += 50;

        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      } catch (err) {
        console.warn("Could not load image", fullUrl, err);
      }
    }
  }

  doc.save(`${trip.name}-Itinerary.pdf`);
};


// Utility to convert image URL to base64
const toBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext("2d").drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = reject;
    img.src = url;
  });
};




  if (!trip) return <div>Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">{trip.name}</h1>

      {/* Map */}
      <div className="bg-purple-500 p-4 rounded-md mb-10">
        <MapContainer
          center={[trip.stops[0]?.lat || 0, trip.stops[0]?.lng || 0]}
          zoom={5}
          scrollWheelZoom={false}
          className="h-96 w-full rounded"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline
            positions={trip.stops.map((stop) => [stop.lat, stop.lng])}
            color="blue"
          />
          {trip.stops.map((stop, i) => (
            <Marker key={i} position={[stop.lat, stop.lng]}>
              <Popup>
                <strong>{stop.name}</strong>
                <br />
                {stop.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Itinerary */}
      <div className="space-y-10">
  <h2 className="text-2xl font-bold text-gray-800">Itinerary</h2>

  {Object.entries(
    trip.stops.reduce((acc, stop) => {
      const day = stop.day || 1;
      if (!acc[day]) acc[day] = [];
      acc[day].push(stop);
      return acc;
    }, {})
  ).map(([day, stops]) => (
    <div key={day}>
      <h3 className="text-xl font-semibold text-blue-600 mb-4">Day {day}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stops.map((stop, i) => (
          <div
            key={i}
            className="bg-purple-400 text-white p-4 rounded-md shadow"
          >
            <h4 className="font-bold text-lg">{stop.name}</h4>
            <p className="text-sm">📍 {stop.lat}, {stop.lng}</p>
            <p className="text-sm mt-2">{stop.description}</p>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

      {/* Photos */}
      {trip.photos.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-4">
            Photos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trip.photos.map((url, i) => (
              <img
                key={i}
                src={`http://localhost:5000${url}`}
                alt={`Photo ${i + 1}`}
                className="w-full h-48 object-cover rounded shadow"
              />
            ))}
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mt-8">
        {user && user._id === trip.userId ? (
          <>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Delete Trip
            </button>
            <button
              onClick={() => navigate(`/edit/${trip._id}`)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ✏️ Edit Trip
            </button>
          </>
        ) : (
          <button
            onClick={() =>
              alert("Only the owner can delete this trip. Please login.")
            }
            className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
          >
            Delete Trip
          </button>
        )}
        <button
          onClick={handleFavorite}
          className="text-white bg-red-600 px-4 py-2 rounded"
        >
          ❤️ Save Trip
        </button>
        <button
          onClick={downloadPDF}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          📥 Download Itinerary
        </button>
      </div>
    </div>
  );
};

export default TripDetail;
