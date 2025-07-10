import { useState, useEffect } from 'react';
import { Heart, Users, ExternalLink, Github, Activity, Database, TrendingUp } from 'lucide-react';

const AppFooter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  
  const currentYear = new Date().getFullYear();
  const appName = "Admin Panel";
  const version = "v1.0.0";
  


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
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap z-10">
            {content}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
          </div>
        )}
      </div>
    );
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 w-full">
      <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {/* Stats Section - Only show on larger screens */}
      

        {/* Main content - responsive layout */}
        <div className="space-y-4">
          {/* Primary row - Logo and basic info */}
          <div className="flex flex-col items-center space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
            {/* Logo and copyright */}
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 dark:text-white">
                  {appName}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1">
                  {version}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                © {currentYear} {appName}. All rights reserved.
              </p>
            </div>

            <div className="flex lg:hidden items-center gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-600 dark:text-gray-300">247</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-300">18</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-600 dark:text-gray-300">12</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 dark:bg-gray-700"></div>

      
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;