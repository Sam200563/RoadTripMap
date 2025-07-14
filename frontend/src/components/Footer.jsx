import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 mt-16 py-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-400">
            🌍 RoadTrip Planner
          </h3>
          <p className="text-sm">Plan your dream journeys with ease.</p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-semibold mb-2">Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-500 dark:hover:text-blue-300">Home</Link>
            </li>
            <li>
              <Link to="/trips" className="hover:text-blue-500 dark:hover:text-blue-300">All Trips</Link>
            </li>
            <li>
              <Link to="/add" className="hover:text-blue-500 dark:hover:text-blue-300">Add Trip</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-blue-500 dark:hover:text-blue-300">Register</Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <div className="flex space-x-4 text-lg">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-300">🌐</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-300">🔗</a>
            <a href="mailto:support@example.com" className="hover:text-blue-500 dark:hover:text-blue-300">✉️</a>
          </div>
        </div>
      </div>

      <p className="text-center text-xs mt-6 text-gray-500 dark:text-gray-400">
        &copy; 2025 RoadTrip. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
