import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Lock, AlertTriangle, UserX } from 'lucide-react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import {
  setDeleteResponse,
  clearDeleteResponse,
  setPasswordResponse,
  clearPasswordResponse,
} from '../utils/accountSlice'; // Adjust the import path as needed

 // Update this to match your backend

const SettingsPage = () => {
  // Real Redux hooks
  const dispatch = useDispatch();
  const { deleteResponse, passwordResponse } = useSelector(state => state.account);
  const user = useSelector(state => state.auth?.user) || { _id: '12345', email: 'user@example.com' };

  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  // Password validation function - NEW ADDITION
  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 6;
    
    return {
      isValid: hasUpperCase && hasNumber && hasSpecialChar && hasMinLength,
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
      hasMinLength
    };
  };

  // Check if form is valid - NEW ADDITION
  const isFormValid = () => {
    const passwordValidation = validatePassword(passwords.newPassword);
    return (
      passwords.oldPassword.trim() !== '' &&
      passwordValidation.isValid &&
      passwords.newPassword === passwords.confirmPassword
    );
  };

  // Clear local error when responses change
  useEffect(() => {
    if (passwordResponse || deleteResponse) {
      setError(null);
    }
  }, [passwordResponse, deleteResponse]);

  // API call for changing password - using axios like other components
  const changePasswordApi = async (passwordData) => {
    try {
      const res = await axios.put(
        BASE_URL + "/profile/change-password",
        passwordData,
        { withCredentials: true }
      );
      
      dispatch(setPasswordResponse({
        success: true,
        message: res.data.message || 'Password updated successfully!'
      }));
      
      // Clear form on success
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      console.log("Password changed:", res.data);
      
    } catch (err) {
      console.error("Error changing password:", err);
      
      if (err.response?.status === 401) {
        dispatch(setPasswordResponse({
          success: false,
          message: err.response.data.message || 'Session expired. Please login again.'
        }));
      } else {
        dispatch(setPasswordResponse({
          success: false,
          message: err.response?.data?.message || 'Failed to update password'
        }));
      }
    }
  };

  // API call for deleting account - using axios like other components
  const deleteAccountApi = async () => {
    try {
      const res = await axios.delete(
        BASE_URL + "/profile/delete-account",
        { withCredentials: true }
      );
      
      dispatch(setDeleteResponse({
        success: true,
        message: res.data.message || 'Account deleted successfully'
      }));
      
      console.log("Account deleted:", res.data);
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      
    } catch (err) {
      console.error("Error deleting account:", err);
      
      if (err.response?.status === 401) {
        dispatch(setDeleteResponse({
          success: false,
          message:  'Session expired. Please login again.'
        }));
      } else {
        dispatch(setDeleteResponse({
          success: false,
          message:  'Failed to delete account'
        }));
      }
    }
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous responses
    dispatch(clearPasswordResponse());
    setError(null);
    
    // Validation
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    const passwordValidation = validatePassword(passwords.newPassword);
    if (!passwordValidation.isValid) {
      setError('Password must contain at least one uppercase letter, one number, and one special character');
      return;
    }

    setLoading(true);
    await changePasswordApi({
      oldPassword: passwords.oldPassword,
      newPassword: passwords.newPassword
    });
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    dispatch(clearDeleteResponse());
    setDeleteLoading(true);
    await deleteAccountApi();
    setDeleteLoading(false);
    
    // Only close modal if deletion failed
    if (deleteResponse && !deleteResponse.success) {
      setShowDeleteModal(false);
    }
  };

  // Clear responses when component unmounts or when user wants to clear them
  const clearMessages = () => {
    dispatch(clearPasswordResponse());
    dispatch(clearDeleteResponse());
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-3 sm:p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Mobile-optimized Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">Settings</h1>
          <p className="text-gray-300 text-sm sm:text-base">Manage your account preferences and security</p>
        </div>

        {/* Success Messages */}
        {passwordResponse?.success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <p className="text-green-400 text-sm sm:text-base">{passwordResponse.message}</p>
            <button
              onClick={() => dispatch(clearPasswordResponse())}
              className="text-green-400 hover:text-green-300 text-sm underline self-start sm:self-auto touch-manipulation"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {deleteResponse?.success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm sm:text-base">{deleteResponse.message}</p>
          </div>
        )}

        {/* Error Messages */}
        {(error || passwordResponse?.success === false || deleteResponse?.success === false) && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <p className="text-red-400 text-sm sm:text-base">
              {error || passwordResponse?.message || deleteResponse?.message}
            </p>
            <button
              onClick={clearMessages}
              className="text-red-400 hover:text-red-300 text-sm underline self-start sm:self-auto touch-manipulation"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Change Password Card - Mobile Optimized */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-white/20">
          <div className="flex items-start sm:items-center mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">Change Password</h2>
              <p className="text-gray-300 text-sm sm:text-base">Update your account password</p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 sm:space-y-6">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.old ? "text" : "password"}
                  name="oldPassword"
                  value={passwords.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('old')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1 touch-manipulation"
                >
                  {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1 touch-manipulation"
                >
                  {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Password Requirements - NEW ADDITION */}
              {passwords.newPassword && (
                <div className="mt-2 space-y-1">
                  <div className={`text-xs flex items-center gap-1 ${validatePassword(passwords.newPassword).hasMinLength ? 'text-green-400' : 'text-red-400'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    At least 6 characters
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${validatePassword(passwords.newPassword).hasUpperCase ? 'text-green-400' : 'text-red-400'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    One uppercase letter (A-Z)
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${validatePassword(passwords.newPassword).hasNumber ? 'text-green-400' : 'text-red-400'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    One number (0-9)
                  </div>
                  <div className={`text-xs flex items-center gap-1 ${validatePassword(passwords.newPassword).hasSpecialChar ? 'text-green-400' : 'text-red-400'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    One special character (!@#$%^&*)
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white p-1 touch-manipulation"
                >
                  {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Conditional Button - MODIFIED */}
            {isFormValid() && (
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 touch-manipulation active:scale-95 text-sm sm:text-base"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            )}
          </form>
        </div>

        {/* Danger Zone - Mobile Optimized */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-red-500/30">
          <div className="flex items-start sm:items-center mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl sm:text-2xl font-semibold text-white">Danger Zone</h2>
              <p className="text-gray-300 text-sm sm:text-base">Irreversible account actions</p>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 sm:p-4 mb-4">
            <p className="text-red-200 text-xs sm:text-sm leading-relaxed">
              <strong>Warning:</strong> Deactivating your account will permanently delete all your data and cannot be undone.
            </p>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center gap-2 touch-manipulation active:scale-95 text-sm sm:text-base"
          >
            <UserX size={18} />
            Deactivate Account
          </button>
        </div>

        {/* Delete Confirmation Modal - Mobile Optimized */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full border border-red-500/30 mx-4">
              <div className="flex items-start sm:items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white">Confirm Account Deletion</h3>
              </div>
              
              <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                Are you absolutely sure you want to deactivate your account? This action cannot be undone and you will lose all your data permanently.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 touch-manipulation text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 touch-manipulation text-sm sm:text-base"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;