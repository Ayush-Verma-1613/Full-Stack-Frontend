import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  console.log("🔍 Navbar - User state:", !!user);

  const handleLogOut = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-2 sm:px-4">
      {/* Left Logo */}
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-lg sm:text-xl px-2 sm:px-4">
          {/* Hide emoji on very small screens */}
          <span className="hidden xs:inline">💻</span>
          <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent ml-1 sm:ml-2">
            CodeBase
          </span>
        </Link>
      </div>

      {/* Right Section */}
      <div className="flex-none">
        {!user ? (
          // Join button - responsive
          <Link
            to="/login"
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 
                       text-white font-semibold rounded-lg shadow-md 
                       transition-all duration-300 hover:scale-105 hover:shadow-lg
                       text-sm sm:text-base"
          >
            JOIN US
          </Link>
        ) : (
          // Logged in state - responsive
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Welcome message - hide on mobile */}
            <p className="text-white font-medium hidden sm:block text-sm sm:text-base">
              Welcome, {user.firstName}
            </p>
            
            {/* Mobile welcome - show only on small screens */}
            <p className="text-white font-medium block sm:hidden text-sm truncate max-w-20">
              Hi, {user.firstName}
            </p>
            
            <div className="dropdown dropdown-end mx-1 sm:mx-3">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-8 sm:w-10 rounded-full">
                  <img alt="User avatar" src={user.photoUrl || 'https://via.placeholder.com/40'} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 text-amber-400 rounded-box z-[9999] mt-3 w-48 sm:w-52 p-2 shadow-lg border"
              >
                <li>
                  <Link to="/profile" className="justify-between text-sm sm:text-base py-2">
                    Profile <span className="badge badge-sm">New</span>
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="text-sm sm:text-base py-2">
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="text-sm sm:text-base py-2">
                    Requests
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="text-sm sm:text-base py-2">
                    Settings
                  </Link>
                </li>
               <li className="mt-2">
  <button
    onClick={handleLogOut}
    className="mx-auto w-full flex justify-center items-center 
               px-3 py-2 text-xs sm:text-sm 
               bg-gradient-to-r from-emerald-500 to-teal-500 
               text-white font-medium rounded-md shadow-md 
               transition-all duration-300 
               hover:scale-105 hover:shadow-lg
               hover:from-emerald-600 hover:to-teal-600"
  >
    Logout
  </button>
</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

