import { useSelector } from "react-redux";
import ProfileCard from "./ProfileCard";

const Profile = () => {
  const user = useSelector((store) => store.user);
  
  return (
    user && (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-4 sm:py-8">
       
        <div className="container mx-auto px-2 sm:px-4">
          {/* Page Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold">My Profile</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">View your profile information</p>
          </div>

          {/* Profile Card */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <ProfileCard user={user} />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8 max-w-4xl mx-auto">
            <div className="stat bg-base-100 shadow rounded-lg p-4">
              <div className="stat-figure text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 sm:w-8 sm:h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <div className="stat-title text-sm">Profile</div>
              <div className="stat-value text-primary text-lg sm:text-xl">Complete</div>
              <div className="stat-desc text-xs sm:text-sm">Your profile is set up</div>
            </div>

            <div className="stat bg-base-100 shadow rounded-lg p-4">
              <div className="stat-figure text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 sm:w-8 sm:h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="stat-title text-sm">Skills</div>
              <div className="stat-value text-secondary text-lg sm:text-xl">{user.skills?.length || 0}</div>
              <div className="stat-desc text-xs sm:text-sm">Skills added</div>
            </div>

            <div className="stat bg-base-100 shadow rounded-lg p-4 sm:col-span-2 md:col-span-1">
              <div className="stat-figure text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 sm:w-8 sm:h-8 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                </svg>
              </div>
              <div className="stat-title text-sm">Active</div>
              <div className="stat-value text-accent text-lg sm:text-xl">Member</div>
              <div className="stat-desc text-xs sm:text-sm">Since {new Date(user.createdAt).getFullYear()}</div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;