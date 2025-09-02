import React, { useEffect, useState } from 'react';
import { User, CheckCircle, XCircle, AlertCircle, RefreshCw, Users } from 'lucide-react';
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

// Loading Component
const LoadingSpinner = () => (
  <div className="flex flex-col sm:flex-row justify-center items-center my-12 sm:my-20 px-4">
    <div className="relative mb-4 sm:mb-0">
      <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
      <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin absolute top-2 left-2"></div>
    </div>
    <h1 className="text-white text-lg sm:text-xl sm:ml-4 animate-pulse text-center">Loading requests...</h1>
  </div>
);

// Error Component
const ErrorDisplay = ({ error, onRetry }) => (
  <div className="flex justify-center my-12 sm:my-20 px-4">
    <div className="text-center p-6 sm:p-8 bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/20 transform hover:scale-105 transition-all duration-300 w-full max-w-md">
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
        <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
      </div>
      <h1 className="text-red-400 text-lg sm:text-xl mb-4">{error}</h1>
      <button 
        className="flex items-center justify-center px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 hover:scale-105 transform transition-all duration-300 touch-manipulation" 
        onClick={onRetry}
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry
      </button>
    </div>
  </div>
);

// No Requests Component
const NoRequestsFound = () => (
  <div className="flex justify-center my-12 sm:my-20 px-4">
    <div className="text-center p-8 sm:p-12 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 transform hover:scale-105 transition-all duration-500 w-full max-w-md">
      <div className="w-16 h-16 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full flex items-center justify-center animate-pulse">
        <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
      </div>
      <h1 className="text-white text-xl sm:text-2xl font-light">No Connection Requests</h1>
      <p className="text-white/60 mt-2 text-sm sm:text-base">Check back later for new requests</p>
    </div>
  </div>
);

// Request Card Component with Mobile Optimization
const RequestCard = ({ request, onReviewRequest, index }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Error handling for null fromUserId
  if (!request || !request.fromUserId) {
    console.warn('Invalid request data:', request);
    return (
      <div className="group relative bg-red-500/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mx-auto max-w-2xl mb-4 sm:mb-6 border border-red-500/20">
        <div className="flex items-center justify-center text-red-400">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
          <span className="text-sm sm:text-base">Invalid request data</span>
        </div>
      </div>
    );
  }

  // Safe destructuring with default values
  const {
    _id = 'unknown',
    firstName = 'Unknown',
    lastName = 'User',
    photoUrl = 'https://via.placeholder.com/80',
    age,
    gender,
    about = 'No description available'
  } = request.fromUserId || {};

  const handleReviewRequest = async (status) => {
    setIsProcessing(true);
    try {
      await onReviewRequest(status, request._id);
    } catch (error) {
      console.error('Error reviewing request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="group relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 mx-auto max-w-2xl mb-4 sm:mb-6 border border-white/20 transform hover:scale-[1.02] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
      style={{
        animationDelay: `${index * 0.1}s`,
        animation: 'slideInUp 0.6s ease-out both'
      }}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Processing overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm sm:text-base">Processing...</p>
          </div>
        </div>
      )}

      {/* Mobile Layout: Stack vertically on small screens */}
      <div className="relative z-0 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Profile Section */}
        <div className="flex items-center space-x-3 sm:space-x-4 flex-grow">
          <div className="relative group flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5 transform group-hover:rotate-6 transition-transform duration-300">
              <img
                alt={`${firstName} ${lastName}`}
                className="w-full h-full rounded-full object-cover"
                src={photoUrl}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/80";
                }}
              />
            </div>
            {/* Status indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white/20 animate-pulse"></div>
          </div>

          <div className="text-left flex-grow min-w-0">
            <h2 className="font-bold text-lg sm:text-2xl text-white mb-1 group-hover:text-blue-300 transition-colors duration-300 truncate">
              {firstName} {lastName}
            </h2>
            {age && gender && (
              <p className="text-white/70 mb-1 sm:mb-2 flex items-center text-sm sm:text-base">
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                {age}, {gender}
              </p>
            )}
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed line-clamp-2">{about}</p>
          </div>
        </div>

        {/* Action Buttons - Mobile: Horizontal layout, Desktop: Vertical */}
        <div className="flex flex-row sm:flex-col space-x-3 sm:space-x-0 sm:space-y-3 sm:ml-6 justify-center sm:justify-start">
          <button
            className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg hover:bg-red-500/30 hover:scale-105 sm:hover:scale-110 transform transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 touch-manipulation flex-1 sm:flex-initial text-sm sm:text-base"
            onClick={() => handleReviewRequest("rejected")}
            disabled={isProcessing}
          >
            <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Reject
          </button>
          <button
            className="flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-lg hover:bg-green-500/30 hover:scale-105 sm:hover:scale-110 transform transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 touch-manipulation flex-1 sm:flex-initial text-sm sm:text-base"
            onClick={() => handleReviewRequest("accepted")}
            disabled={isProcessing}
          >
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Requests Component
const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      console.log("Request reviewed:", res.data);
    } catch (err) {
      console.error("Error reviewing request:", err);
      setError("Failed to review request");
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      console.log("API Response:", res.data);
      console.log("Requests data:", res.data.data);

      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter out invalid requests
  const validRequests = requests?.filter(request => 
    request && request.fromUserId && request.fromUserId._id
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-6 sm:py-10 safe-area-inset">
        {/* Mobile-optimized Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-2 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse px-4">
            Connection Requests
          </h1>
          <div className="w-16 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        {loading && <LoadingSpinner />}
        
        {error && <ErrorDisplay error={error} onRetry={fetchRequests} />}
        
        {!loading && !error && validRequests.length === 0 && (
          <NoRequestsFound />
        )}

        {!loading && !error && validRequests.length > 0 && (
          <div className="space-y-4 sm:space-y-6">
            <p className="text-center text-white/70 text-base sm:text-lg mb-6 sm:mb-8 px-4">
              You have <span className="text-blue-400 font-semibold">{validRequests.length}</span> pending {validRequests.length === 1 ? 'request' : 'requests'}
            </p>
            
            <div className="px-2 sm:px-0">
              {validRequests.map((request, index) => (
                <RequestCard
                  key={request._id}
                  request={request}
                  onReviewRequest={reviewRequest}
                  index={index}
                />
              ))}
            </div>
            
            {/* Show count of invalid requests if any */}
            {requests && requests.length !== validRequests.length && (
              <div className="text-center text-yellow-400 text-xs sm:text-sm px-4">
                Note: {requests.length - validRequests.length} invalid requests were filtered out
              </div>
            )}
          </div>
        )}
        
        {/* Bottom safe area for mobile */}
        <div className="h-4 sm:h-0"></div>
      </div>

      {/* Custom CSS for animations and mobile utilities */}
      <style>{`
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
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .safe-area-inset {
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
        }
        
        .touch-manipulation {
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
};

export default Requests;