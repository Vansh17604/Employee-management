import { useState, useEffect } from 'react';
import { Heart, User, Clock, CheckCircle, Coffee, HelpCircle } from 'lucide-react';

const AppFooter = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userStats, setUserStats] = useState(null);
  
  const currentYear = new Date().getFullYear();
  const appName = "Employee Portal";
  const version = "v1.2.0";
  
  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Mock user stats - replace with actual API call
  useEffect(() => {
    const fetchUserStats = async () => {
      // Simulate API call
      setTimeout(() => {
        setUserStats({
          tasksCompleted: 12,
          hoursLogged: 7.5,
          lastBreak: "2:30 PM"
        });
      }, 800);
    };
    
    fetchUserStats();
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
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap z-10 shadow-lg">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        )}
      </div>
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-4 md:px-6 w-full">
      {/* Main content row */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
        {/* App branding */}
        <div className="flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">{appName}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {version}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            © {currentYear} Your Company. All rights reserved.
          </p>
        </div>
                
        {/* Personal stats and time */}
        <div className="flex items-center justify-center space-x-3 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto sm:justify-end">
          {/* Current time */}
          <Tooltip content="Current time">
            <div className="flex flex-col items-center px-3 py-2 rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200 dark:border-gray-700 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatTime(currentTime)}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                Current Time
              </span>
            </div>
          </Tooltip>

          {/* User stats */}
          {userStats ? (
            <>
              <Tooltip content="Tasks completed today">
                <div className="flex flex-col items-center px-3 py-2 rounded-lg bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userStats.tasksCompleted}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                    Tasks Done
                  </span>
                </div>
              </Tooltip>

              <Tooltip content="Hours logged today">
                <div className="flex flex-col items-center px-3 py-2 rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userStats.hoursLogged}h
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                    Hours Logged
                  </span>
                </div>
              </Tooltip>

              <Tooltip content="Last break time">
                <div className="flex flex-col items-center px-3 py-2 rounded-lg bg-gradient-to-b from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Coffee className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {userStats.lastBreak}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                    Last Break
                  </span>
                </div>
              </Tooltip>
            </>
          ) : (
            // Loading skeleton for stats
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse min-w-0">
                <div className="h-4 w-8 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            ))
          )}
        </div>
      </div>
                
      {/* Bottom section */}
      <div className="mt-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-3 sm:space-y-0">
          {/* Connection status */}
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-2">
            <span className="font-medium">Connection:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50"></div>
              <span className="font-semibold text-xs text-green-600 dark:text-green-400">
                Connected
              </span>
            </div>
          </div>
                    
          {/* Credits and help */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">Made with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500 mx-1.5" />
              <span className="text-xs text-gray-500 dark:text-gray-400">for our team</span>
            </div>
                        
            <div className="flex items-center">
              <Tooltip content="Need help?">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group">
                  <HelpCircle className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;