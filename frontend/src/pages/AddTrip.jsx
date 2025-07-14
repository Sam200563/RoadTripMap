import React, { useState } from "react";
import { api } from "../api";

const GEOCODING_API_KEY = "25ab3e0ea76a4c068eb2a94790668fa7"; // <-- Replace with your real API key

const AddTrip = () => {
  const [name, setName] = useState("");
  const [stops, setStops] = useState([
    { name: "", lat: "", lng: "", description: "" ,day:1},
  ]);
  const [photos, setPhotos] = useState([null]);

  const handleAddStop = () =>
    setStops([...stops, { name: "", lat: "", lng: "", description: "",day:1 }]);
  // const handleAddPhoto = () => setPhotos([...photos, ""]);
  const handleFileChange = (e, index) => {
  const updatedPhotos = [...photos];
  updatedPhotos[index] = e.target.files[0];
  setPhotos(updatedPhotos);
};


  const handleAddPhoto = () => {
    setPhotos([...photos, null]);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("stops", JSON.stringify(stops));
    photos.forEach((photo) => formData.append("photos", photo));

    try {
      const res = await api.post("/trips/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.success) {
        alert("Trip added successfully!");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to add trip.");
    }
  };

  const handlePlaceSearch = async (value, index) => {
    const updatedStops = [...stops];
    updatedStops[index].name = value;

    if (value.length > 2) {
      try {
        const res = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            value
          )}&key=${GEOCODING_API_KEY}`
        );
        const data = await res.json();
        if (data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          updatedStops[index].lat = lat;
          updatedStops[index].lng = lng;
        }
      } catch (err) {
        console.error("Geocoding failed:", err);
      }
    }

    setStops(updatedStops);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 mt-6 rounded-md">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Add Trip</h2>

      <input
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Trip Name"
        onChange={(e) => setName(e.target.value)}
        required
      />
      <h3 className="text-xl font-semibold mb-2">Stops</h3>
      {stops.map((stop, index) => (
        <div key={index} className="border p-4 rounded mb-4">
          <input
            placeholder="Place Name"
            className="w-full p-2 border border-gray-300 rounded mb-2"
            onChange={(e) => handlePlaceSearch(e.target.value, index)}
            value={stop.name}
          />
          <div className="flex gap-4 mb-2">
            <input
              className="w-1/2 p-2 border border-gray-300 rounded"
              placeholder="Latitude"
              value={stop.lat}
              readOnly
            />
            <input
              className="w-1/2 p-2 border border-gray-300 rounded"
              placeholder="Longitude"
              value={stop.lng}
              readOnly
            />
          </div>
          <input
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded"
            onChange={(e) => {
              const updated = [...stops];
              updated[index].description = e.target.value;
              setStops(updated);
            }}
          />
          <select
            className="w-full p-2 border rounded mb-2"
            value={stop.day}
            onChange={(e) => {
              const updated = [...stops];
              updated[index].day = parseInt(e.target.value);
              setStops(updated);
            }}
          >
            {[...Array(10)].map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                Day {idx + 1}
              </option>
            ))}
          </select>
        </div>
      ))}
      
      <button
        className="mb-6 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        onClick={handleAddStop}
      >
        ➕ Add Another Stop
      </button>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Upload Photos</h3>
        {photos.map((file, index) => (
          <div key={index} className="mb-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, index)}
            />
            {file && <p className="text-sm text-gray-600">{file.name}</p>}
          </div>
        ))}

        <button
          onClick={handleAddPhoto}
          className="mt-2 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ➕ Add Another Photo
        </button>
      </div>

      <br />

      <button
        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        ✅ Save Trip
      </button>
    </div>
  );
};

export default AddTrip;
