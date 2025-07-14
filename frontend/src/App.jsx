import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { setAuthToken } from "./api";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TripDetail from "./pages/TripDetail";
import TripsList from "./pages/TripsList";
import AddTrip from "./pages/AddTrip";
import Footer from "./components/Footer";
import Favorites from "./pages/Favorites";
import CalendarView from "./pages/CalendarView";
import AllTripsMap from "./pages/AllTripsMap";
import EditTrip from "./pages/EditTrip";
import Profile from "./pages/Profile";
function App() {
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");

    if (loginTime && Date.now() - parseInt(loginTime) > 12 * 60 * 60 * 1000) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    setUser(null);
    return;
  }

    if (token) {
      setAuthToken(token);
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        localStorage.removeItem("user"); // prevent future errors
      }
    }
  }, []);

  const handlelogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white">
      <nav className="bg-white dark:bg-gray-800 shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-xl font-bold text-blue-700 dark:text-white"
          >
            🌍 RoadTrip Planner
          </Link>
          <div className="space-x-6 text-sm md:text-base">
            <Link
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              to="/trips"
            >
              Trips
            </Link>
            <Link
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              to="/add"
            >
              Add Trip
            </Link>
            <Link
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              to="/calendar"
            >
              Calendar
            </Link>
            <Link
              className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              to="/allmap"
            >
              Map
            </Link>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-800 dark:text-white hover:text-black dark:hover:text-yellow-400"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            {!user ? (
              <Link
                to="/register"
                className="text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                Register
              </Link>
            ) : (
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold"
                >
                  {getInitial(user.name)}
                </button>
                {showMenu && (
                  <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1 text-sm text-gray-700 dark:text-white">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setShowMenu(false)}
                      >
                        👤 Profile
                      </Link>
                      <Link
                        to="/favorites"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        onClick={() => setShowMenu(false)}
                      >
                        ❤️ Saved Trips
                      </Link>
                      <button
                        onClick={handlelogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <Login
                onLogin={() => {
                  try {
                    const userData = localStorage.getItem("user");
                    if (userData) {
                      setUser(JSON.parse(userData));
                    } else {
                      console.warn("No user data in localStorage after login");
                    }
                  } catch (err) {
                    console.error(
                      "Failed to parse user from localStorage",
                      err
                    );
                    localStorage.removeItem("user");
                  }
                }}
              />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/trips" element={<TripsList />} />
          <Route path="/trip/:id" element={<TripDetail />} />
          <Route path="/add" element={<AddTrip />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/allmap" element={<AllTripsMap />} />
          <Route path="/edit/:id" element={<EditTrip />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
