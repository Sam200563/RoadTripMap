import React, { useEffect, useState } from "react";
import { api } from "../api";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    country: "",
    state: "",
  });

  useEffect(() => {
    api
      .get("/auth/profile")
      .then((res) => {
        if (res.data.success) {
          setProfile(res.data.profile);
          setForm({
            name: res.data.profile.name,
            phone: res.data.profile.phone,
            country: res.data.profile.country,
            state: res.data.profile.state,
          });
        }
      })
      .catch((err) => {
        console.error("Profile load failed", err);
      });
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await api.put("/auth/profile", form);
      if (res.data.success) {
        setProfile(res.data.profile);
        setIsEditing(false);
        alert("Profile updated successfully");
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Profile update failed");
    }
  };

  if (!profile) return <div>Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700">👤 Your Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            ✏️ Edit
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div><strong>Name:</strong> {profile.name}</div>
          <div><strong>Email:</strong> {profile.email}</div>
          <div><strong>Phone:</strong> {profile.phone}</div>
          <div><strong>Country:</strong> {profile.country}</div>
          <div><strong>State:</strong> {profile.state}</div>
          <div><strong>Total Trips:</strong> {profile.totalTrips}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="border p-2 rounded"
          />
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
            className="border p-2 rounded"
          />
          <input
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            placeholder="Country"
            className="border p-2 rounded"
          />
          <input
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            placeholder="State"
            className="border p-2 rounded"
          />
          <div className="col-span-2 flex gap-4">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              ✅ Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <h3 className="text-xl font-semibold mb-2">❤️ Favorite Trips</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profile.favorites.map((trip) => (
          <div key={trip._id} className="bg-gray-100 p-3 rounded shadow">
            <img
              src={
                trip.photos[0]
                  ? `http://localhost:5000/uploads/${trip.photos[0]}`
                  : "https://via.placeholder.com/300"
              }
              className="w-full h-32 object-cover mb-2 rounded"
              alt={trip.name}
            />
            <p className="font-medium">{trip.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
