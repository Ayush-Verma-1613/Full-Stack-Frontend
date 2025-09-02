import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {}
  };

  return (
    <div className="flex justify-center items-center px-4 sm:px-0">
      <div className="w-full max-w-xs sm:max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
        {/* Image Section - Made smaller */}
        <div className="relative h-64 sm:h-80">
          <img
            src={photoUrl || "https://images.unsplash.com/photo-1494790108755-2616b9fe6d57?w=400&h=500&fit=crop&crop=face"}
            alt={firstName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section - Reduced padding */}
        <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
          {/* Name and Age */}
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white truncate pr-2">
              {firstName} {lastName || ""}
            </h2>
            {(age || gender) && (
              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">
                {age && gender ? `${age}, ${gender}` : age || gender}
              </span>
            )}
          </div>

          {/* About - Made more compact */}
          <div className="mb-2 sm:mb-3">
            <h4 className="font-medium text-amber-400 mb-1 text-sm">About</h4>
            <div className="bg-gray-50 rounded-lg p-2 max-h-20 sm:max-h-24 overflow-hidden">
              <p className="text-gray-600 text-xs leading-relaxed break-words overflow-hidden">
                <span className="line-clamp-2">{about || "No bio available"}</span>
              </p>
            </div>

            {/* Custom CSS for line-clamp */}
            <style jsx>{`
              .line-clamp-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-wrap: break-word;
                word-break: break-word;
                hyphens: auto;
              }
            `}</style>
          </div>

          {/* Skills - More compact */}
          {skills?.length > 0 && (
            <div>
              <h4 className="font-medium text-amber-400 mb-1 text-sm">Skills</h4>
              <div className="flex gap-1 flex-wrap">
                {skills.slice(0, 2).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full truncate max-w-16 sm:max-w-20"
                    title={skill}
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 2 && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    +{skills.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons with Text and Icons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => handleSendRequest("ignored", _id)}
              aria-label="Ignore user"
              className="flex-1 bg-red-400 hover:bg-red-500 active:bg-red-600 text-white font-medium py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 text-xs sm:text-sm transform hover:scale-105 active:scale-95 hover:shadow-md active:shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Ignore</span>
            </button>

            <button
              onClick={() => handleSendRequest("interested", _id)}
              aria-label="Mark as interested"
              className="flex-1 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 text-xs sm:text-sm transform hover:scale-105 active:scale-95 hover:shadow-md active:shadow-sm relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 active:opacity-20 transition-opacity duration-200 rounded-lg"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Interested</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;