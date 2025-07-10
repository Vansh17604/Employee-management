import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  ChevronDown,
  Menu,
  User,
  Settings,
  LogOut,
  Calendar,
  Clock,
  FileText,
  Loader2
} from 'lucide-react';
import useAuthStore from '../../app/authStore';

const AppHeader = ({ onToggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigate = useNavigate();
  
  // Get auth store functions and state
  const { user, logout, getUserById, loading, error } = useAuthStore();

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user?.id) {
        setUserLoading(true);
        try {
          const userData = await getUserById(user.id);
          if (userData) {
            setUserDetails(userData);
          }
        } catch (err) {
          console.error('Error fetching user details:', err);
        } finally {
          setUserLoading(false);
        }
      } else {
        setUserLoading(false);
      }
    };

    fetchUserDetails();
  }, [user?.id, getUserById]);

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const success = await logout();
      if (success) {
        navigate('/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get display name and role
  const displayName = userDetails?.name || user?.name || 'User';
  const displayRole = userDetails?.role || user?.role || 'Employee';
  const displayEmail = userDetails?.email || user?.email || '';

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 shadow-sm">
        <div className="flex h-12 sm:h-14 lg:h-16 items-center px-3 sm:px-4 lg:px-6">
          {/* Mobile menu button */}
          <button 
            className="lg:hidden mr-2 p-1.5 sm:p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
            onClick={onToggleSidebar}
          >
            <Menu size={18} className="sm:w-5 sm:h-5" />
          </button>
          
          {/* Company name - responsive text */}
          <div className="lg:hidden font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
            <span className="hidden sm:inline">Edit User Pannel</span>
        
          </div>
           <div className="hidden md:block  font-bold text-2xl text-gray-900 dark:text-white text-sm sm:text-base truncate">
            <span className="hidden sm:inline">Edit User Pannel</span>
        
          </div>
          
          {/* Spacer for mobile */}
          <div className="flex-1 lg:hidden"></div>
          
          {/* Date & Time - responsive visibility and sizing */}
          <div className="hidden sm:flex lg:ml-auto mr-2 sm:mr-4 items-center">
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-right">
              <div className="font-medium text-gray-900 dark:text-white">
                <span className="hidden md:inline">
                  {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <span className="md:hidden">
                  {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="text-xs">{currentTime}</div>
            </div>
          </div>

          {/* Action buttons - responsive spacing and sizing */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
            {/* Dark mode toggle */}
            <button 
              className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleDarkMode}
            >
              {darkMode ? 
                <Sun size={16} className="sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" /> : 
                <Moon size={16} className="sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
              }
            </button>
          
            <div className="h-6 sm:h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          
            {/* User menu - responsive layout */}
            <div className="relative">
              <button 
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setShowUserMenu(!showUserMenu)}
                disabled={userLoading}
              >
                <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  {userLoading ? (
                    <Loader2 size={12} className="sm:w-3.5 sm:h-3.5 text-white animate-spin" />
                  ) : (
                    <span className="text-white font-medium text-xs sm:text-sm">
                      {getUserInitials(displayName)}
                    </span>
                  )}
                </div>
                
                {/* User info - responsive visibility */}
                <div className="hidden sm:flex md:flex flex-col items-start text-sm min-w-0">
                  <span className="font-medium text-gray-900 dark:text-white truncate max-w-24 md:max-w-32 lg:max-w-40">
                    {userLoading ? 'Loading...' : displayName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-24 md:max-w-32 lg:max-w-40">
                              {displayRole.toLowerCase() === 'employee' && (
  <div className="text-sm font-semibold text-gray-900 dark:text-white">
    EDIT User
  </div>
)}
                  </span>
                </div>
                
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              </button>
              
              {/* User dropdown menu - responsive positioning and sizing */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {userLoading ? 'Loading...' : displayName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {userLoading ? '' : displayEmail}
                    </p>
                  </div>

                  <div className="py-1">
                    <button 
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/profile');
                      }}
                    >
                      <User size={16} />
                      My Profile
                    </button>
                  
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button 
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <LogOut size={16} />
                      )}
                      {loading ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error message - responsive */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-3 sm:p-4 mx-3 sm:mx-4 mb-2">
            <div className="flex">
              <div className="ml-3">
                <p className="text-xs sm:text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Backdrop overlay */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default AppHeader;