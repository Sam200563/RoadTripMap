import React, { useEffect, useState } from "react";
import { api } from "../api";
import { useParams, useNavigate } from "react-router-dom";

const EditTrip = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [name, setName] = useState("");
  const [stops, setStops] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/trips/${id}`).then((res) => {
      setTrip(res.data);
      setName(res.data.name);
      setStops(res.data.stops.map(stop=>({...stop,day:stop.day || 1})));
      setExistingPhotos(res.data.photos || []);
    });
  }, [id]);

  const handleAddStop = () => {
    setStops([...stops, { name: "", lat: "", lng: "", description: "",day:1 }]);
  };

  const handleFileChange = (e, index) => {
    const updated = [...newPhotos];
    updated[index] = e.target.files[0];
    setNewPhotos(updated);
  };

  const handleAddPhoto = () => {
    setNewPhotos([...newPhotos, null]);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("stops", JSON.stringify(stops));
    existingPhotos.forEach((url) => formData.append("existingPhotos", url));
    newPhotos.forEach((file) => {
      if (file) formData.append("photos", file);
    });

    try {
      await api.put(`/trips/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Trip updated successfully!");
      navigate(`/trip/${id}`);
    } catch (err) {
      console.error("Update error", err);
      alert("Failed to update trip.");
    }
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">✏️ Edit Trip</h2>

      <label className="block mb-2 font-semibold">Trip Name</label>
      <input
        className="w-full border p-2 mb-4 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Trip Name"
      />

      <h3 className="text-xl font-semibold mb-2">Stops</h3>
      {stops.map((stop, i) => (
        <div key={i} className="mb-4 p-3 bg-gray-100 rounded">
          <div className="flex items-center gap-2 mb-2">
            <input
              className="w-full p-2 border rounded"
              placeholder="Name"
              value={stop.name}
              onChange={(e) => {
                const updated = [...stops];
                updated[i].name = e.target.value;
                setStops(updated);
              }}
            />
            <button
              onClick={() => {
                const updated = stops.filter((_, idx) => idx !== i);
                setStops(updated);
              }}
              className="text-red-500 text-xl hover:text-red-700"
              title="Delete Stop"
            >
              ❌
            </button>
          </div>
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Lat"
            value={stop.lat}
            onChange={(e) => {
              const updated = [...stops];
              updated[i].lat = e.target.value;
              setStops(updated);
            }}
          />
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Lng"
            value={stop.lng}
            onChange={(e) => {
              const updated = [...stops];
              updated[i].lng = e.target.value;
              setStops(updated);
            }}
          />
          <input
            className="w-full p-2 border rounded"
            placeholder="Description"
            value={stop.description}
            onChange={(e) => {
              const updated = [...stops];
              updated[i].description = e.target.value;
              setStops(updated);
            }}
          />
          <input
            type="number"
            min="1"
            className="p-2 border rounded w-32"
            value={stop.day}
            onChange={(e) => {
              const updated = [...stops];
              updated[i].day = parseInt(e.target.value);
              setStops(updated);
            }}
            placeholder="Day"
          />
        </div>
      ))}
      <button
        onClick={handleAddStop}
        className="mb-6 px-3 py-1 bg-blue-500 text-white rounded"
      >
        ➕ Add Another Stop
      </button>

      <h3 className="text-xl font-semibold mb-2">Existing Photos</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        {existingPhotos.map((url, i) => (
          <div key={i} className="relative group">
            <img
              src={`http://localhost:5000${url}`}
              alt={`Photo ${i + 1}`}
              className="rounded w-full h-40 object-cover"
            />
            <button
              onClick={() => {
                const updated = [...existingPhotos];
                updated.splice(i, 1);
                setExistingPhotos(updated);
              }}
              className="absolute inset-0 bg-black bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition flex justify-center items-center text-sm font-semibold"
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-2">Add New Photos</h3>
      {newPhotos.map((file, index) => (
        <div key={index} className="mb-2">
          <input type="file" onChange={(e) => handleFileChange(e, index)} />
          {file && <span className="ml-2 text-sm text-gray-600">{file.name}</span>}
        </div>
      ))}
      <button
        onClick={handleAddPhoto}
        className="mb-6 px-3 py-1 bg-purple-600 text-white rounded"
      >
        ➕ Add Another Photo
      </button>

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        ✅ Save Changes
      </button>
    </div>
  );
};

export default EditTrip;
