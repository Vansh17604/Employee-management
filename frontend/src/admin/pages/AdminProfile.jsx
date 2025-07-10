import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import  useAuthStore  from '@/app/authStore';

const Profile = () => {
  const { user, loading, error, getUserById, updateUserProfile } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserDetails();
    }
  }, [user?.id]);

  const fetchUserDetails = async () => {
    const userData = await getUserById(user.id);
    if (userData) {
      setAdminData(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || ''
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Only send changed fields
    const hasNameChanged = formData.name !== adminData?.name && formData.name.trim();
    const hasEmailChanged = formData.email !== adminData?.email && formData.email.trim();

    if (!hasNameChanged && !hasEmailChanged) {
      toast.info('No changes detected');
      setIsEditing(false);
      return;
    }

    const updatedUser = await updateUserProfile(
      user.id, 
      formData.name.trim(), 
      formData.email.trim()
    );

    if (updatedUser) {
      setAdminData(updatedUser);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (adminData) {
      setFormData({
        name: adminData.name || '',
        email: adminData.email || ''
      });
    }
    setIsEditing(false);
  };

  if (loading && !adminData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your account settings and profile information</p>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {adminData?.name || 'Admin User'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">{adminData?.email}</p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                    !isEditing ? 'bg-gray-50 dark:bg-gray-600 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 ${
                    !isEditing ? 'bg-gray-50 dark:bg-gray-600 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
            </div>

         

            {/* Change Password Button */}
            <button 
              type="button"
              className='px-4 py-2 bg-black dark:bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors'  
              onClick={() => navigate("/admin/changepassword")}
            >
              Change Password
            </button>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-md hover:bg-green-700 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;