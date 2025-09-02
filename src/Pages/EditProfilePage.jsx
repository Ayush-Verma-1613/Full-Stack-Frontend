import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";
import { Link } from "react-router-dom";

const EditProfilePage = () => {
  const user = useSelector((store) => store.user);
  
  return (
    user && (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
        <div className="container mx-auto px-4">
          {/* Page Header with Back Button */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-between max-w-4xl mx-auto mb-4">
              <Link 
                to="/profile" 
                className="btn btn-ghost btn-circle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-4xl font-bold">Edit Profile</h1>
              <div></div> {/* Empty div for centering */}
            </div>
            <p className="text-white/60 mt-2">Update your profile information</p>
          </div>

          {/* Edit Profile Component */}
          <div className="flex justify-center">
            <EditProfile user={user} />
          </div>
        </div>
      </div>
    )
  );
};

export default EditProfilePage;