// Mobile Responsive Feeds Component - BIGGER SIZE
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { removeUser } from "../utils/userSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { BASE_URL } from "../utils/constants";
import { ArrowLeft, ArrowRight, Heart, X } from "lucide-react";

import SkillMatchingLandingPage from "./CodeBasePage"; // Import the landing page

const Feeds = () => {
  const user = useSelector((state) => state.user);
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false); // Track if feed fetch was attempted

  const getFeed = async () => {
    if (!user) return;
    setIsLoading(true);
    setHasAttemptedFetch(true); // Mark that we've attempted to fetch
    
    try {
      const res = await axios.get(BASE_URL +"/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.error("Error fetching feed", err);
      
      // If authentication error, clear user state
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log("Authentication failed, clearing user state");
        dispatch(removeUser());
        // Optionally redirect to login
        // window.location.href = "/login";
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getFeed();
    }
  }, [user]);

  const handleNext = () => {
    if (feed && currentIndex < feed.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (feed) {
      setCurrentIndex(feed.length);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Show landing page if user is not logged in
  if (!user) {
    return <SkillMatchingLandingPage />;
  }

  // Show loading while fetching
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 sm:py-24 px-4">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin absolute top-2 left-2 animation-delay-150"></div>
        </div>
        <h1 className="text-white text-xl sm:text-2xl ml-4 animate-pulse">Loading...</h1>
      </div>
    );
  }

  // Show "all caught up" message when user has viewed all profiles
  if (hasAttemptedFetch && (!feed || feed.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-400 flex items-center justify-center p-4">
        <div className="text-center space-y-6 sm:space-y-8 max-w-md sm:max-w-lg w-full">
          <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🎉</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">All Caught Up!</h2>
          <p className="text-base sm:text-lg text-slate-950">You've seen all available profiles</p>
          
          
            <p className="text-base sm:text-lg text-slate-950 mb-6 sm:mb-8">Come back later for more connections!</p>
            
        </div>
      </div>
    );
  }

  // Show normal feed interface for logged-in users with feed data
  const currentUser = feed && feed.length > 0 ? feed[currentIndex] : null;

  // If no current user to display, show loading or empty state
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center py-20 sm:py-24 px-4">
        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin absolute top-2 left-2 animation-delay-150"></div>
        </div>
        <h1 className="text-white text-xl sm:text-2xl ml-4 animate-pulse">Loading profiles...</h1>
     </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 px-3 py-4 sm:px-4 sm:py-6">
      {/* Header - Made Bigger */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-white/60 mb-3">Discover People</h1>
        <p className="text-base sm:text-lg text-white/60">Find your next connection</p>
        <div className="mt-4 sm:mt-5">
          <span className="bg-white shadow-sm px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base text-gray-700 font-medium">
            {currentIndex + 1} of {feed?.length || 0}
          </span>
        </div>
      </div>

      {/* User Card with Navigation - Made Much Bigger */}
      <div className="max-w-md sm:max-w-lg mx-auto relative">
        {/* Card */}
        <UserCard user={currentUser} />

        {/* Navigation Arrows - Hidden on mobile, shown on tablet+ */}
        <div className="hidden md:block">
          {/* Left Arrow */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="absolute left-[-80px] lg:left-[-250px] top-1/2 -translate-y-1/2 p-3 lg:p-4 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 transition"
          >
            <ArrowLeft className="text-white w-6 h-6 lg:w-7 lg:h-7" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            disabled={!feed || currentIndex === feed.length - 1}
            className="absolute right-[-80px] lg:right-[-250px] top-1/2 -translate-y-1/2 p-3 lg:p-4 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 transition"
          >
            <ArrowRight className="text-white w-6 h-6 lg:w-7 lg:h-7" />
          </button>
        </div>

        {/* Mobile Navigation - Bottom positioned - Made Bigger */}
        <div className="md:hidden mt-6 flex justify-center gap-6">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 transition shadow-lg"
          >
            <ArrowLeft className="text-white w-6 h-6" />
          </button>
          
          <button
            onClick={handleNext}
            disabled={!feed || currentIndex === feed.length - 1}
            className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-30 transition shadow-lg"
          >
            <ArrowRight className="text-white w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Feeds;