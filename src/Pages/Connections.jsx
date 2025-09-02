import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/ConnectionSlice";
import { Link } from "react-router-dom";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex flex-col sm:flex-row justify-center items-center my-10 sm:my-20 px-4">
    <div className="relative mb-4 sm:mb-0">
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin absolute top-2 left-2 animation-delay-150"></div>
    </div>
    <h1 className="text-white text-base sm:text-xl sm:ml-4 animate-pulse text-center">Loading connections...</h1>
  </div>
);

// Error Component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="flex justify-center my-10 sm:my-20 px-4">
    <div className="text-center p-4 sm:p-8 bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/20 transform hover:scale-105 transition-all duration-300 max-w-sm">
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-red-400 text-lg sm:text-xl mb-3 sm:mb-4">{error}</h1>
      <button 
        className="btn btn-sm sm:btn-md bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 hover:scale-105 transform transition-all duration-300" 
        onClick={onRetry}
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Retry
      </button>
    </div>
  </div>
);

// No Connections Component
const NoConnectionsFound = () => (
  <div className="flex justify-center my-10 sm:my-20 px-4">
    <div className="text-center p-6 sm:p-12 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 transform hover:scale-105 transition-all duration-500 max-w-md">
      <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full flex items-center justify-center animate-pulse">
        <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h1 className="text-white text-xl sm:text-2xl font-light mb-2">No Connections Yet</h1>
      <p className="text-white/60 text-sm sm:text-base">Start connecting with people to see them here</p>
    </div>
  </div>
);

// Premium Chat Button Component - Mobile Optimized
const PremiumChatButton = ({ userId, userName }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Link
      to={`/chat/${userId}`}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* Main Button */}
      <div className={`
        relative overflow-hidden
        px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl
        bg-gradient-to-r from-slate-700 to-slate-600
        hover:from-slate-600 hover:to-slate-500
        border border-slate-500/30 hover:border-slate-400/50
        shadow-lg hover:shadow-xl hover:shadow-slate-500/20
        transform transition-all duration-300 ease-out
        ${isHovered ? 'sm:scale-105 sm:-translate-y-1' : 'scale-100'}
        ${isPressed ? 'scale-95' : ''}
        cursor-pointer
        active:scale-95
      `}>
        
        {/* Animated Background Shimmer */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          transform transition-transform duration-700 ease-out
          ${isHovered ? 'translate-x-full' : '-translate-x-full'}
        `} />

        {/* Content */}
        <div className="relative flex items-center gap-1 sm:gap-2 z-10">
          {/* Chat Icon */}
          <svg 
            className={`w-4 h-4 sm:w-5 sm:h-5 text-white transition-transform duration-300 ${
              isHovered ? 'sm:scale-110' : 'scale-100'
            }`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
            />
          </svg>
          
          {/* Button Text */}
          <span className={`
            text-white font-medium transition-all duration-300 text-sm sm:text-base
            ${isHovered ? 'sm:tracking-wider' : 'tracking-normal'}
          `}>
            Chat
          </span>

          {/* Arrow Icon - Hidden on mobile */}
          <svg 
            className={`w-3 h-3 sm:w-4 sm:h-4 text-white transition-transform duration-300 hidden sm:block ${
              isHovered ? 'translate-x-1' : 'translate-x-0'
            }`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M13 7l5 5m0 0l-5 5m5-5H6" 
            />
          </svg>
        </div>

        {/* Bottom Glow Effect */}
        <div className={`
          absolute bottom-0 left-1/2 transform -translate-x-1/2
          w-0 h-0.5 bg-gradient-to-r from-slate-400 to-slate-300
          transition-all duration-300 ease-out rounded-full
          ${isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'}
        `} />
      </div>

      {/* Tooltip - Desktop Only */}
      <div className={`
        absolute -top-12 left-1/2 transform -translate-x-1/2
        px-3 py-1.5 rounded-lg
        bg-gray-800 border border-gray-600
        text-white text-sm whitespace-nowrap
        transition-all duration-300 ease-out
        hidden sm:block
        ${isHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}
      `}>
        <span>Chat with {userName}</span>
        {/* Tooltip Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="border-4 border-transparent border-t-gray-800"></div>
        </div>
      </div>
    </Link>
  );
};

// Connection Card Component - Mobile Optimized
const ConnectionCard = ({ connection, index }) => {
  const {_id, firstName, lastName, photoUrl, age, gender, about } = connection;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="group relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mx-2 sm:mx-auto max-w-2xl mb-4 sm:mb-6 border border-white/20 transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      style={{
        animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        {/* Profile Section */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-grow">
          <div className="relative group">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-0.5 transform group-hover:rotate-6 transition-transform duration-300">
              <img
                alt="photo"
                className={`w-full h-full rounded-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                src={photoUrl}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80";
                  setImageLoaded(true);
                }}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-600 rounded-full animate-pulse flex items-center justify-center">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {/* Online status indicator */}
            {/* <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white/20">
              <div className="w-full h-full bg-green-400 rounded-full animate-ping"></div>
            </div> */}
          </div>

          <div className="text-left flex-grow min-w-0">
            <h2 className="font-bold text-lg sm:text-2xl text-white mb-1 group-hover:text-green-300 transition-colors duration-300 truncate">
              {firstName} {lastName}
            </h2>
            {age && gender && (
              <p className="text-white/70 mb-1 sm:mb-2 flex items-center text-sm sm:text-base">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="truncate">{age}, {gender}</span>
              </p>
            )}
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-2 break-words">
              {about}
            </p>
          </div>
        </div>

        {/* Enhanced Premium Chat Button */}
        <div className="flex justify-end sm:justify-start sm:ml-4 flex-shrink-0">
          <PremiumChatButton 
            userId={_id} 
            userName={`${firstName} ${lastName}`}
          />
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-green-400/0 group-hover:border-green-400/30 transition-colors duration-500 pointer-events-none"></div>
    </div>
  );
};

// Main Connections Component
const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      
      console.log("Connections fetched:", res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError("Failed to fetch connections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
            My Connections
          </h1>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        {loading && <LoadingSpinner />}
        
        {error && <ErrorDisplay error={error} onRetry={fetchConnections} />}
        
        {!loading && !error && (!connections || !Array.isArray(connections) || connections.length === 0) && (
          <NoConnectionsFound />
        )}

        {!loading && !error && connections && Array.isArray(connections) && connections.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <p className="text-center text-white/70 text-base sm:text-lg mb-6 sm:mb-8 px-4">
              You have <span className="text-green-400 font-semibold">{connections.length}</span> active connection{connections.length !== 1 ? 's' : ''}
            </p>
            
            <div className="max-w-4xl mx-auto">
              {connections.map((connection, index) => (
                <ConnectionCard
                  key={connection._id}
                  connection={connection}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Mobile-specific touch interactions */
        @media (max-width: 640px) {
          .group:active {
            transform: scale(0.98);
          }
        }
      `}</style>
    </div>
  );
};

export default Connections;