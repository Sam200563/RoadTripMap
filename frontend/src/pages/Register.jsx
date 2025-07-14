import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await api.post("/auth/register", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      state: formData.state,
      password: formData.password,
    });

    if (res.data.success) {
      alert("Registration successful");
      navigate("/login");
    } else {
      alert(res.data.error);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <form
        onSubmit={handleRegister}
        className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl w-full max-w-lg animate-fade-in"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Create Your Account
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          />
          <input
            name="phone"
            type="tel"
            max={10}
            placeholder="Phone Number"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          />
          <input
            name="country"
            placeholder="Country"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          />
          <input
            name="state"
            placeholder="State"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
        <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
      </form>
      
    </div>
  );
};

export default Register;
