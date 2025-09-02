import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Strong Password Validation
  const validateStrongPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < minLength) {
      return "Password must be at least 8 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  // Get password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    if (score <= 2) return { strength: score, label: "Weak", color: "text-red-500" };
    if (score <= 3) return { strength: score, label: "Fair", color: "text-yellow-500" };
    if (score <= 4) return { strength: score, label: "Good", color: "text-blue-500" };
    return { strength: score, label: "Strong", color: "text-green-500" };
  };

  // Validation for Login Form
  const validateLoginFields = () => {
    const errors = {};
    
    if (!emailId.trim()) {
      errors.emailId = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
      errors.emailId = "Please enter a valid email";
    }
    
    if (!password.trim()) {
      errors.password = "Password is required";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validation for SignUp Form
  const validateSignUpFields = () => {
    const errors = {};
    
    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (firstName.length < 2 || firstName.length > 20) {
      errors.firstName = "First name must be 2-20 characters";
    }
    
    if (!lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (lastName.length < 2 || lastName.length > 20) {
      errors.lastName = "Last name must be 2-20 characters";
    }
    
    if (!emailId.trim()) {
      errors.emailId = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
      errors.emailId = "Please enter a valid email";
    }
    
    if (!password.trim()) {
      errors.password = "Password is required";
    } else {
      const passwordError = validateStrongPassword(password);
      if (passwordError) {
        errors.password = passwordError;
      }
    }
    
    if (!age) {
      errors.age = "Age is required";
    } else if (parseInt(age) < 18 || parseInt(age) > 120) {
      errors.age = "Age must be between 18 and 120";
    }
    
    if (!gender) {
      errors.gender = "Gender is required";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if all login fields are filled
  const isLoginFormValid = () => {
    return emailId.trim() && password.trim();
  };

  // Check if all signup fields are filled
  const isSignUpFormValid = () => {
    return firstName.trim() && lastName.trim() && emailId.trim() && 
           password.trim() && age && gender;
  };

  // Extract error message from backend response
  const extractErrorMessage = (err) => {
    if (err?.response?.data) {
      const errorData = err.response.data;
      
      // Handle "Error : " prefix from your backend
      if (typeof errorData === 'string' && errorData.includes("Error : ")) {
        return errorData.split("Error : ")[1];
      }
      
      // Handle "Error creating user:" prefix from signup
      if (typeof errorData === 'string' && errorData.includes("Error creating user:")) {
        return errorData.split("Error creating user:")[1];
      }
      
      // Return the error message as is
      return errorData;
    }
    
    return "Something went wrong. Please try again.";
  };

  const handleLogin = async () => {
    if (!validateLoginFields()) {
      showErrorMessage("Please fill all required fields correctly");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      
      // Check if response contains error message
      if (res.data && typeof res.data === 'string' && res.data.includes('Error')) {
        const errorMessage = res.data.includes("Error : ") 
          ? res.data.split("Error : ")[1] 
          : res.data;
        showErrorMessage(errorMessage);
        return;
      }
      
      // If we get user object, login successful
      if (res.data && typeof res.data === 'object') {
        dispatch(addUser(res.data));
        showSuccessMessage("Login successful! Welcome back!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        showErrorMessage("Unexpected response from server. Please try again.");
      }
      
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      showErrorMessage(errorMessage);
      setFieldErrors({});
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validateSignUpFields()) {
      showErrorMessage("Please fill all required fields correctly");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        { 
          firstName, 
          lastName, 
          emailId, 
          password, 
          age: parseInt(age), 
          gender 
        },
        { withCredentials: true }
      );
      
      // Check if response contains error message
      if (res.data && typeof res.data === 'string' && res.data.includes('Error')) {
        // Backend sent error in response body
        const errorMessage = res.data.includes("Error creating user:") 
          ? res.data.split("Error creating user:")[1] 
          : res.data;
        showErrorMessage(errorMessage);
        return;
      }
      
      // Check if response is success message
      if (res.data === 'User created successfully') {
        // Show success toast
        showSuccessMessage("Account created successfully! Please login to continue.");
        
        // Clear form data after a delay
        setTimeout(() => {
          setFirstName("");
          setLastName("");
          setEmailId("");
          setPassword("");
          setAge("");
          setGender("");
          setFieldErrors({});
          setIsLoginForm(true);
        }, 2000);
      } else {
        // If we get here, something unexpected happened
        showErrorMessage("Unexpected response from server. Please try again.");
      }
      
    } catch (err) {
      const errorMessage = extractErrorMessage(err);
      showErrorMessage(errorMessage);
      setFieldErrors({});
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLoginForm((value) => !value);
    setShowPassword(false);
    setFieldErrors({});
    // Clear all fields when switching forms
    setFirstName("");
    setLastName("");
    setAge("");
    setGender("");
    setEmailId("");
    setPassword("");
  };

  // Clear field error when user starts typing
  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const passwordStrength = !isLoginForm ? getPasswordStrength(password) : null;

  // Show toast functions
  const showSuccessMessage = (message) => {
    setToastMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4000);
  };

  const showErrorMessage = (message) => {
    setToastMessage(message);
    setShowErrorToast(true);
    setTimeout(() => setShowErrorToast(false), 4000);
  };

  // Auto hide toasts
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => setShowSuccessToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  useEffect(() => {
    if (showErrorToast) {
      const timer = setTimeout(() => setShowErrorToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showErrorToast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success shadow-2xl max-w-sm">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-base font-semibold">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-error shadow-2xl max-w-sm">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-base font-semibold">{toastMessage}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-amber-400 mb-2">
            {isLoginForm ? "Welcome Back!" : "Create Account"}
          </h1>
          <p className="text-white/60 text-sm sm:text-base px-2">
            {isLoginForm 
              ? "Sign in to your account to continue" 
              : "Join us today and start your journey"
            }
          </p>
        </div>

        {/* Main Card */}
        <div className="card bg-white shadow-2xl border-0">
          <div className="card-body p-4 sm:p-8">
            <form className="space-y-4 sm:space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              {/* Sign Up Fields */}
              {!isLoginForm && (
                <div className="space-y-3 sm:space-y-4 animate-in fade-in slide-in-from-top-3 duration-500">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm sm:text-base font-semibold text-gray-700">
                          First Name <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        className={`input input-bordered w-full text-sm sm:text-base focus:input-primary transition-all duration-300 ${
                          fieldErrors.firstName ? 'input-error border-red-500' : ''
                        }`}
                        placeholder="Enter first name"
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          clearFieldError('firstName');
                        }}
                      />
                      {fieldErrors.firstName && (
                        <label className="label">
                          <span className="label-text-alt text-xs sm:text-sm text-red-500">{fieldErrors.firstName}</span>
                        </label>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm sm:text-base font-semibold text-gray-700">
                          Last Name <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        className={`input input-bordered w-full text-sm sm:text-base focus:input-primary transition-all duration-300 ${
                          fieldErrors.lastName ? 'input-error border-red-500' : ''
                        }`}
                        placeholder="Enter last name"
                        onChange={(e) => {
                          setLastName(e.target.value);
                          clearFieldError('lastName');
                        }}
                      />
                      {fieldErrors.lastName && (
                        <label className="label">
                          <span className="label-text-alt text-xs sm:text-sm text-red-500">{fieldErrors.lastName}</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Age and Gender Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm sm:text-base font-semibold text-gray-700">
                          Age <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={age}
                          min="18"
                          max="120"
                          className={`input input-bordered w-full pl-10 sm:pl-12 text-sm sm:text-base focus:input-primary transition-all duration-300 ${
                            fieldErrors.age ? 'input-error border-red-500' : ''
                          }`}
                          placeholder="Enter your age"
                          onChange={(e) => {
                            setAge(e.target.value);
                            clearFieldError('age');
                          }}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      {fieldErrors.age && (
                        <label className="label">
                          <span className="label-text-alt text-xs sm:text-sm text-red-500">{fieldErrors.age}</span>
                        </label>
                      )}
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text text-sm sm:text-base font-semibold text-gray-700">
                          Gender <span className="text-red-500">*</span>
                        </span>
                      </label>
                      <div className="relative">
                        <select
                          value={gender}
                          className={`select select-bordered w-full pl-10 sm:pl-12 text-sm sm:text-base focus:select-primary transition-all duration-300 ${
                            fieldErrors.gender ? 'select-error border-red-500' : ''
                          }`}
                          onChange={(e) => {
                            setGender(e.target.value);
                            clearFieldError('gender');
                          }}
                        >
                          <option value="" disabled>Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                      {fieldErrors.gender && (
                        <label className="label">
                          <span className="label-text-alt text-xs sm:text-sm text-red-500">{fieldErrors.gender}</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base font-semibold text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={emailId}
                    className={`input input-bordered w-full pl-10 sm:pl-12 text-sm sm:text-base focus:input-primary transition-all duration-300 ${
                      fieldErrors.emailId ? 'input-error border-red-500' : ''
                    }`}
                    placeholder="Enter your email"
                    onChange={(e) => {
                      setEmailId(e.target.value);
                      clearFieldError('emailId');
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                {fieldErrors.emailId && (
                  <label className="label">
                    <span className="label-text-alt text-xs sm:text-sm text-red-500">{fieldErrors.emailId}</span>
                  </label>
                )}
              </div>

              {/* Password Field */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-sm sm:text-base font-semibold text-gray-700">
                    Password <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    className={`input input-bordered w-full pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base focus:input-primary transition-all duration-300 ${
                      fieldErrors.password ? 'input-error border-red-500' : ''
                    }`}
                    placeholder={isLoginForm ? "Enter your password" : "Create a strong password"}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearFieldError('password');
                    }}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button
                    type="button"
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m6.878-6.878L21 3m-8.122 6.878L15 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                
                {/* Password Strength Indicator for Signup */}
                {!isLoginForm && password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">Password Strength:</span>
                      <span className={`text-xs font-medium ${passwordStrength?.color}`}>
                        {passwordStrength?.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength?.strength <= 2 
                            ? 'bg-red-500' 
                            : passwordStrength?.strength <= 3 
                            ? 'bg-yellow-500' 
                            : passwordStrength?.strength <= 4
                            ? 'bg-blue-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength?.strength || 0) * 20}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      <p className="mb-1">Password must contain:</p>
                      <ul className="list-disc list-inside ml-2 space-y-0.5">
                        <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                          At least 8 characters
                        </li>
                        <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                          One uppercase letter
                        </li>
                        <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                          One lowercase letter
                        </li>
                        <li className={/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                          One number
                        </li>
                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                          One special character (!@#$%^&*)
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {fieldErrors.password && (
                  <label className="label">
                    <span className="label-text-alt text-xs sm:text-sm text-red-500">{fieldErrors.password}</span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <div className="form-control mt-6 sm:mt-8">
                <button
                  className={`btn btn-lg w-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                    isLoading 
                      ? 'bg-indigo-500 text-white cursor-wait' 
                      : (isLoginForm ? isLoginFormValid() : isSignUpFormValid())
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                  }`}
                  onClick={isLoginForm ? handleLogin : handleSignUp}
                  disabled={isLoading || (isLoginForm ? !isLoginFormValid() : !isSignUpFormValid())}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                      <span className="text-sm sm:text-base">
                        {isLoginForm ? 'Signing In...' : 'Creating Account...'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isLoginForm ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          <span className="text-sm sm:text-base">Sign In</span>
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          <span className="text-sm sm:text-base">Create Account</span>
                        </>
                      )}
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Toggle Form */}
        <div className="text-center mt-6 sm:mt-8">
          <div className="bg-white rounded-2xl shadow-lg px-4 sm:px-6 py-3 sm:py-4 border border-gray-100">
            <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">
              {isLoginForm 
                ? "Don't have an account yet?" 
                : "Already have an account?"
              }
            </p>
            <button
              className="text-purple-600 hover:text-purple-800 text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-105 flex items-center mx-auto group"
              onClick={toggleForm}
            >
              {isLoginForm ? (
                <>
                  <span>Join us today</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  <span>Sign in instead</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-gray-500 text-xs sm:text-sm px-4">
            By continuing, you agree to our{" "}
            <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-purple-600 hover:text-purple-800 font-medium">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;