import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import PhotoUpload from "./PhotoUpload";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const MAX_ABOUT_LENGTH = 120;

  // Enhanced validation function
  const validateFields = () => {
    const errors = {};
    
    if (!firstName.trim()) {
      errors.firstName = "Please fill this field";
    }
    
    if (!lastName.trim()) {
      errors.lastName = "Please fill this field";
    }
    
    if (!age || age < 18 || age > 100) {
      errors.age = "Please fill this field";
    }
    
    if (!gender) {
      errors.gender = "Please fill this field";
    }

    // Skills validation - required field
    if (skills.length === 0) {
      errors.skills = "Please add at least one skill";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate individual skill - simplified
  const validateSkill = (skill) => {
    const trimmedSkill = skill.trim();
    
    if (!trimmedSkill) {
      return "Skill cannot be empty";
    }
    
    // Check if skill already exists (case insensitive)
    if (skills.some(existingSkill => 
      existingSkill.toLowerCase() === trimmedSkill.toLowerCase()
    )) {
      return "This skill has already been added";
    }
    
    return null; // No validation errors
  };

  // Check if form is valid
  const isFormValid = () => {
    return firstName.trim() && 
           lastName.trim() && 
           age && 
           age >= 18 && 
           age <= 100 && 
           gender &&
           skills.length > 0; // At least one skill required
  };

  const handleAboutChange = (e) => {
    const value = e.target.value;
    // Only update if length is within limit
    if (value.length <= MAX_ABOUT_LENGTH) {
      setAbout(value);
    }
  };

  // Enhanced add skill function with validation
  const addSkill = () => {
    const skillError = validateSkill(newSkill);
    
    if (skillError) {
      setValidationErrors(prev => ({ ...prev, newSkill: skillError }));
      return;
    }

    // Add the skill
    const trimmedSkill = newSkill.trim();
    setSkills([...skills, trimmedSkill]);
    setNewSkill("");
    
    // Clear any skill-related validation errors
    setValidationErrors(prev => {
      const { newSkill: _, skills: __, ...rest } = prev;
      return rest;
    });
  };

  // Remove skill function
  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
    
    // If removing the last skill, show validation error
    if (skills.length === 1) {
      setValidationErrors(prev => ({
        ...prev,
        skills: "Please add at least one skill"
      }));
    }
  };

  // Handle Enter key for adding skills
  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Handle skill input change
  const handleSkillInputChange = (e) => {
    const value = e.target.value;
    setNewSkill(value);
    
    // Clear validation error when user starts typing
    if (validationErrors.newSkill && value.trim()) {
      setValidationErrors(prev => ({ ...prev, newSkill: '' }));
    }
  };

  const saveProfile = async () => {
    if (!validateFields()) {
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const profileData = {
        firstName,
        lastName,
        photoUrl,
        age,
        gender,
        about: about.trim() || "This user prefers to keep their story a mystery for now.",
        skills,
      };

      const res = await axios.put(
        BASE_URL + "/profile/edit",
        profileData,
        { withCredentials: true }
      );

      console.log("Profile update response:", res);
      dispatch(addUser(res?.data?.data));

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err?.response?.data || "An unknown error occurred");
      
      // Show error toast
      setShowErrorToast(true);
      setTimeout(() => {
        setShowErrorToast(false);
      }, 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const isAboutLimitExceeded = about.length > MAX_ABOUT_LENGTH;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-4 px-2 sm:py-8 sm:px-4">
      <div className="container mx-auto">
        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Edit Form Card */}
          <div className="order-2 xl:order-1">
            <div className="card bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border-0 h-fit">
              <div className="card-body p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-center mb-4 sm:mb-6">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400">Edit Profile</h2>
                </div>

                <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-white/60 text-sm">First Name</span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        className={`input input-bordered w-full text-sm sm:text-base transition-all duration-300 ${
                          validationErrors.firstName 
                            ? 'input-error border-red-500' 
                            : 'focus:input-primary'
                        }`}
                        placeholder="Enter first name"
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          // Clear validation error when user starts typing
                          if (validationErrors.firstName && e.target.value.trim()) {
                            setValidationErrors(prev => ({ ...prev, firstName: '' }));
                          }
                        }}
                      />
                      {validationErrors.firstName && (
                        <label className="label">
                          <span className="label-text-alt text-red-500 font-medium text-xs">
                            {validationErrors.firstName}
                          </span>
                        </label>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-white/60 text-sm">Last Name</span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        className={`input input-bordered w-full text-sm sm:text-base transition-all duration-300 ${
                          validationErrors.lastName 
                            ? 'input-error border-red-500' 
                            : 'focus:input-primary'
                        }`}
                        placeholder="Enter last name"
                        onChange={(e) => {
                          setLastName(e.target.value);
                          // Clear validation error when user starts typing
                          if (validationErrors.lastName && e.target.value.trim()) {
                            setValidationErrors(prev => ({ ...prev, lastName: '' }));
                          }
                        }}
                      />
                      {validationErrors.lastName && (
                        <label className="label">
                          <span className="label-text-alt text-red-500 font-medium text-xs">
                            {validationErrors.lastName}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div className="form-control">
                    <PhotoUpload 
                      photoUrl={photoUrl} 
                      setPhotoUrl={setPhotoUrl}
                      defaultUrl="https://cdn.pfps.gg/pfps/2903-default-blue.png"
                    />
                  </div>

                  {/* Age and Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-white/60 text-sm">Age</span>
                      </label>
                      <input
                        type="number"
                        value={age}
                        className={`input input-bordered w-full text-sm sm:text-base transition-all duration-300 ${
                          validationErrors.age 
                            ? 'input-error border-red-500' 
                            : 'focus:input-primary'
                        }`}
                        placeholder="Enter your age"
                        min="18"
                        max="100"
                        onChange={(e) => {
                          setAge(e.target.value);
                          // Clear validation error when user enters valid age
                          if (validationErrors.age && e.target.value >= 18 && e.target.value <= 100) {
                            setValidationErrors(prev => ({ ...prev, age: '' }));
                          }
                        }}
                      />
                      {validationErrors.age && (
                        <label className="label">
                          <span className="label-text-alt text-red-500 font-medium text-xs">
                            {validationErrors.age}
                          </span>
                        </label>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-white/60 text-sm">Gender</span>
                      </label>
                      <select
                        value={gender}
                        className={`select select-bordered w-full text-sm sm:text-base transition-all duration-300 ${
                          validationErrors.gender 
                            ? 'select-error border-red-500' 
                            : 'focus:select-primary'
                        }`}
                        onChange={(e) => {
                          setGender(e.target.value);
                          // Clear validation error when user selects gender
                          if (validationErrors.gender && e.target.value) {
                            setValidationErrors(prev => ({ ...prev, gender: '' }));
                          }
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {validationErrors.gender && (
                        <label className="label">
                          <span className="label-text-alt text-red-500 font-medium text-xs">
                            {validationErrors.gender}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Skills Section */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-white/60 text-sm">Skills*</span>
                    </label>
                    
                    {/* Add Skill Input */}
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                      <input
                        type="text"
                        value={newSkill}
                        className={`input input-bordered flex-1 text-sm sm:text-base transition-all duration-300 ${
                          validationErrors.newSkill 
                            ? 'input-error border-red-500' 
                            : 'focus:input-primary'
                        }`}
                        placeholder="Add a skill..."
                        onChange={handleSkillInputChange}
                        onKeyPress={handleSkillKeyPress}
                      />
                      <button
                        type="button"
                        className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto"
                        onClick={addSkill}
                        disabled={!newSkill.trim()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="ml-1 sm:hidden">Add Skill</span>
                      </button>
                    </div>

                    {/* Skill Input Validation Error */}
                    {validationErrors.newSkill && (
                      <label className="label">
                        <span className="label-text-alt text-red-500 font-medium text-xs">
                          {validationErrors.newSkill}
                        </span>
                      </label>
                    )}

                    {/* Skills Validation Error */}
                    {validationErrors.skills && (
                      <label className="label">
                        <span className="label-text-alt text-red-500 font-medium text-xs">
                          {validationErrors.skills}
                        </span>
                      </label>
                    )}

                    {/* Skills Display */}
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {skills.map((skill, index) => (
                        <div key={index} className="badge badge-primary gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
                          <span>{skill}</span>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs text-white hover:text-red-300"
                            onClick={() => removeSkill(skill)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {skills.length === 0 && (
                      <p className="text-white/40 text-xs sm:text-sm italic">No skills added yet</p>
                    )}
                  </div>

                  {/* About with Character Limit */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-white/60 text-sm">About You</span>
                    </label>
                    <textarea
                      value={about}
                      className={`textarea textarea-bordered h-20 sm:h-24 w-full text-sm sm:text-base transition-all duration-300 resize-none ${
                        isAboutLimitExceeded 
                          ? 'textarea-error border-red-500 focus:textarea-error' 
                          : 'focus:textarea-primary'
                      }`}
                      placeholder="Tell us about yourself... (Leave empty to use default)"
                      onChange={handleAboutChange}
                      onKeyDown={(e) => {
                        // Prevent typing if at character limit (except for backspace, delete, etc.)
                        if (about.length >= MAX_ABOUT_LENGTH && 
                            !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].includes(e.key) &&
                            !e.ctrlKey && !e.metaKey) {
                          e.preventDefault();
                        }
                      }}
                    />
                    <label className="label">
                      <span className={`label-text-alt text-xs ${
                        isAboutLimitExceeded ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {about.length}/{MAX_ABOUT_LENGTH} characters
                        {isAboutLimitExceeded && (
                          <span className="ml-1 sm:ml-2 font-semibold">
                            - Character limit exceeded!
                          </span>
                        )}
                      </span>
                    </label>
                    
                    {/* Character limit warning */}
                    {about.length >= MAX_ABOUT_LENGTH * 0.9 && about.length < MAX_ABOUT_LENGTH && (
                      <div className="alert alert-warning shadow-lg mt-2 py-2">
                        <div className="text-xs sm:text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="font-medium">
                            You're approaching the character limit ({MAX_ABOUT_LENGTH - about.length} remaining)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Character limit exceeded error */}
                    {isAboutLimitExceeded && (
                      <div className="alert alert-error shadow-lg mt-2 animate-pulse py-2">
                        <div className="text-xs sm:text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">
                            Please reduce your text to {MAX_ABOUT_LENGTH} characters or less
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="alert alert-error shadow-lg mt-4 py-2">
                    <div className="text-xs sm:text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="card-actions justify-center mt-6 sm:mt-8">
                  <button 
                    className={`btn btn-md sm:btn-lg px-8 sm:px-12 w-full sm:w-auto text-sm sm:text-base transition-all duration-300 ${
                      !isFormValid() || isAboutLimitExceeded || isLoading
                        ? 'btn-disabled opacity-50 cursor-not-allowed blur-sm' 
                        : 'btn-primary hover:scale-105'
                    } ${isLoading ? 'loading' : ''}`}
                    onClick={saveProfile}
                    disabled={!isFormValid() || isAboutLimitExceeded || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="loading loading-spinner loading-sm mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Profile
                      </>
                    )}
                  </button>
                </div>

                {/* Form Status Indicator */}
                {!isFormValid() && (
                  <div className="text-center mt-3 sm:mt-4">
                    <p className="text-white/60 text-xs sm:text-sm">
                      Please fill all required fields to save your profile
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="order-1 xl:order-2">
            <div className="xl:sticky xl:top-8">
              <div className="text-center mb-3 sm:mb-4">
                 <div className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400 bg-gradient-to-br from-gray-900 to-gray-800 p-2 sm:p-3 rounded-md shadow-md">
                   <p>Live Preview</p>
                 </div>
                <p className="text-stone-950 text-xs sm:text-sm mt-1">See how your profile will look</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-2 sm:p-3 lg:p-4 rounded-2xl">
                <UserCard
                  user={{ 
                    _id: user._id, 
                    firstName, 
                    lastName, 
                    photoUrl, 
                    age, 
                    gender, 
                    about: about.trim() || "This user prefers to keep their story a mystery for now.", 
                    skills 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success shadow-2xl max-w-xs sm:max-w-sm">
            <div className="text-xs sm:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">Profile saved successfully!</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-error shadow-2xl max-w-xs sm:max-w-sm">
            <div className="text-xs sm:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Sorry! Profile update failed. Please try again.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;