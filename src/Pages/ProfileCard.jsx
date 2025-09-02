import React from "react";
import { Link } from "react-router-dom";

const ProfileCard = ({ user }) => {
  // Default values if user data is missing
  const {
    firstName = "User",
    lastName = "",
    photoUrl = "https://via.placeholder.com/150",
   
    age = "",
    gender = "",
    about = "No bio available",
    skills = [],
    createdAt = "",
  } = user || {};

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
   
<div className="card bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl max-w-2xl w-full mx-auto">
    
  <div className="card-body items-center text-center p-4 sm:p-6">
    
    {/* Avatar */}
    <div className="avatar">
      <div className="w-24 sm:w-32 text-amber-400 rounded-full ring ring-primary ring-offset-white ring-offset-2">
        <img 
          src={photoUrl} 
          alt={`${firstName} ${lastName}`} 
          onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
        />
      </div>
    </div>

    {/* Name */}
    <h2 className="card-title text-xl sm:text-2xl font-bold text-amber-400 mt-3 sm:mt-4">
      {firstName} {lastName}
    </h2>

    {/* Email */}
   

    {/* About Section */}
    <div className="w-full mt-4 sm:mt-6">
      <h3 className="text-base sm:text-lg font-semibold text-amber-400 mb-2">About</h3>
      <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg">
        {about}
      </p>
    </div>

    {/* Personal Info Grid */}
    <div className="w-full mt-3 sm:mt-4">
      <h3 className="text-base sm:text-lg font-semibold text-amber-400 mb-2 sm:mb-3">Personal Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {age && (
          <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
            <p className="text-xs sm:text-sm text-bold text-stone-950">Age</p>
            <p className="text-sm sm:text-base font-semibold text-gray-800">{age}</p>
          </div>
        )}
        {gender && (
          <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
            <p className="text-xs sm:text-sm text-bold text-stone-950">Gender</p>
            <p className="text-sm sm:text-base font-semibold capitalize text-gray-800">{gender}</p>
          </div>
        )}
      </div>
    </div>

    {/* Skills */}
    {skills?.length > 0 && (
      <div className="w-full mt-3 sm:mt-4">
        <h3 className="text-base sm:text-lg font-semibold text-amber-400 mb-2 sm:mb-3">Skills</h3>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="badge bg-blue-800 text-white text-xs px-2 py-0.5 hover:bg-blue-900 transition-all duration-300 cursor-default">
              {skill}
            </span>
          ))}
        </div>
      </div>
    )}

    {/* Member Since */}
    {createdAt && (
      <div className="w-full mt-3 sm:mt-4">
        <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
          <p className="text-xs sm:text-sm text-semibold text-stone-950">Member Since</p>
          <p className="text-sm sm:text-base font-semibold text-gray-800">{formatDate(createdAt)}</p>
        </div>
      </div>
    )}

    {/* Button */}
    <div className="card-actions justify-center mt-4 sm:mt-6 w-full">
      <Link to="/edit-profile" className="btn btn-primary w-full sm:btn-wide">
        Edit Profile
      </Link>
    </div>
  </div>
</div>

  );
};

export default ProfileCard;