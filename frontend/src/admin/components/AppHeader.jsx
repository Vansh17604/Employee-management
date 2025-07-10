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
  Loader2
} from 'lucide-react';
import  useAuthStore  from '../../app/authStore';

const AppHeader = ({ onToggleSidebar }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const navigate= useNavigate();
  
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
        <div className="flex h-16 items-center px-4 sm:px-6">
          {/* Mobile menu button */}
          <button 
            className="md:hidden mr-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" 
            onClick={onToggleSidebar}
          >
            <Menu size={20} />
          </button>
          
          
          <div className="md:hidden font-semibold text-gray-900 dark:text-white">
            Admin Panel
          </div>
<div className="hidden  md:block text-2xl font-bold text-gray-900 dark:text-white">
  Admin Panel
</div>

          
          {/* Date & Time */}
          <div className="hidden md:flex ml-auto mr-4 items-center">
            <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              <div className="font-medium text-gray-900 dark:text-white">
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div>{currentTime}</div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2 md:gap-4">
      

        
            <button 
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleDarkMode}
            >
              {darkMode ? <Sun size={18} className="text-gray-600 dark:text-gray-300" /> : <Moon size={18} className="text-gray-600 dark:text-gray-300" />}
            </button>
          
            <div className="h-8 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          
          
            <div className="relative">
              <button 
                className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowUserMenu(!showUserMenu)}
                disabled={userLoading}
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  {userLoading ? (
                    <Loader2 size={14} className="text-white animate-spin" />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {getUserInitials(displayName)}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {userLoading ? 'Loading...' : displayName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {userLoading ? '' : displayRole}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
              
              {/* User dropdown menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {userLoading ? 'Loading...' : displayName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {userLoading ? '' : displayEmail}
                    </p>
                  </div>
                  <div className="py-1">
                    <button 
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => navigate('/admin/profile')}
                    >
                      <User size={16} />
                      Profile
                    </button>
                
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                    <button 
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
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
        
       

        {/* Error display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mx-4 mb-2">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Overlay to close dropdowns when clicking outside */}
      {(showUserMenu || showNotifications) && (
        <div 
          className="fixed inset-0 z-20" 
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </>
  );
};

export default AppHeader;