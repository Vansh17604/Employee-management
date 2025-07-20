import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Bell, 
  Search, 
  Menu, 
  X, 
  Settings, 
  LogOut, 
  User, 
  Home, 
  Calendar, 
  FileText, 
  MessageSquare, 
  ChevronDown,
  Sun,
  Moon,
  Briefcase,
  Loader2
} from 'lucide-react';
import useAuthStore from '../../app/authStore';

const AppHeader = ({ onToggleSidebar }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const navigate = useNavigate();
  
  // Get auth store functions and state
  const { user, logout, getUserById, loading, error } = useAuthStore();
  
  const appName = "Supervisor Panel";
  const version = "v2.1.0";

 
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
    setIsDarkMode(!isDarkMode);
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

  // Get display name, role, and email
  const displayName = userDetails?.name || user?.name || 'User';
  const displayRole = userDetails?.role || user?.role || 'Employee';
  const displayEmail = userDetails?.email || user?.email || '';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const Tooltip = ({ children, content }) => {
    const [show, setShow] = useState(false);
    
    return (
      <div 
        className="relative"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
        {show && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg">
            {content}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900 dark:border-b-gray-700"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 w-full shadow-sm">
        <div className="px-3 sm:px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left section - Logo and Nav */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  if (onToggleSidebar) onToggleSidebar();
                }}
                className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Logo */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{appName}</h1>
                </div>
              </div>

             
            </div>

         

            {/* Right section - Actions and Profile */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Date & Time - responsive visibility */}
              <div className="hidden sm:flex mr-2 sm:mr-4 items-center">
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

              {/* Dark mode toggle */}
              <Tooltip content={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}>
                <button
                  onClick={toggleDarkMode}
                  className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  {isDarkMode ? (
                    <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
                  ) : (
                    <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </Tooltip>

              {/* Separator */}
              <div className="h-6 sm:h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

              {/* Profile dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  disabled={userLoading}
                  className="flex items-center space-x-2 sm:space-x-3 p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0">
                    {userLoading ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      getUserInitials(displayName)
                    )}
                  </div>
                  <div className="hidden sm:block text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-24 md:max-w-32 lg:max-w-40">
                      {userLoading ? 'Loading...' : displayName}
                    </p>
       <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-24 md:max-w-32 lg:max-w-40">
  {displayRole.toLowerCase() === 'normalemployee' && (
    <div className="text-sm font-semibold text-gray-900 dark:text-white">
      Supervisor 
    </div>
  )}
</div>


                  </div>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                </button>

                {/* Profile dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {userLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            getUserInitials(displayName)
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {userLoading ? 'Loading...' : displayName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {userLoading ? '' : displayEmail}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/normalemployee/supervisorprofile');
                        }}
                        className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </button>
                     
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        disabled={loading}
                        className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-600 dark:text-red-400 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        <span>{loading ? 'Logging out...' : 'Sign out'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Error message */}
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
      {(isProfileOpen || isNotificationOpen) && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationOpen(false);
          }}
        />
      )}
    </>
  );
};

export default AppHeader;