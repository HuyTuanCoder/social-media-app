import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onLogout: () => void;
  username: string; // Add username as a prop
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call the logout function passed from the parent
    navigate('/'); // Redirect to the login page
  };

  return (
    <nav className="bg-beige text-gray-800 p-4 shadow-md" style={{ backgroundColor: '#f5f5dc' }}>
      <ul className="flex justify-between items-center">
        {/* Navigation Links */}
        <div className="flex space-x-6">
          <li>
            <Link to="/messages" className="hover:underline font-medium">
              Messages
            </Link>
          </li>
          <li>
            <Link to="/friends" className="hover:underline font-medium">
              Friends
            </Link>
          </li>
          <li>
            <Link to="/report" className="hover:underline font-medium">
              Report
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:underline font-medium">
              Profile
            </Link>
          </li>
        </div>

        {/* Separator */}
        <div className="flex items-center space-x-4">
          {/* Username */}
          <span className="text-sm font-semibold bg-white text-gray-800 px-3 py-1 rounded-full shadow-sm">
            {username}
          </span>

          {/* Log Out Button */}
          <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 shadow-md"
          >
            Log Out
          </button>
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;