import { useState, useEffect } from 'react';
import { Heart, Users, ExternalLink, Github, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AppFooter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState([]);
  
  const currentYear = new Date().getFullYear();
  const appName = "Manager Panel";
  const version = "v2.1.0";
  
  // Mock loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
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

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-3 px-3 md:py-4 md:px-6 lg:px-8 w-full">
      {/* Main content row */}
      <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
        {/* App branding */}
        <div className="flex flex-col items-center sm:items-start lg:items-start">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
            <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">{appName}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {version}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center sm:text-left">
            © {currentYear} Employee Management System. All rights reserved.
          </p>
        </div>
      </div>
      
      {/* Divider */}
      <div className="mt-3 sm:mt-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
        
        {/* Bottom section with status and actions */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mt-3 sm:mt-4">
          {/* System Status */}
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start space-x-2">
            <span className="font-medium">System Status:</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${
                isLoading 
                  ? 'bg-yellow-500 animate-pulse' 
                  : 'bg-green-500 shadow-sm shadow-green-500/50'
              }`}></div>
              <span className={`font-semibold text-xs ${
                isLoading 
                  ? 'text-yellow-600 dark:text-yellow-400' 
                  : 'text-green-600 dark:text-green-400'
              }`}>
                {isLoading ? 'Syncing...' : 'All Systems Operational'}
              </span>
            </div>
          </div>
          
          {/* Credits and actions section */}
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:gap-4">
            {/* Credits */}
            <div className="flex items-center justify-center sm:justify-start flex-wrap gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">Built with</span>
              <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
              <span className="text-xs text-gray-500 dark:text-gray-400">for employees by</span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                TechCorp Solutions
              </span>
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center justify-center space-x-1">
              <Tooltip content="View source code">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group">
                  <Github className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
              </Tooltip>
              <Tooltip content="Documentation">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group">
                  <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                </button>
              </Tooltip>
              <Tooltip content="Report issue">
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 group">
                  <AlertCircle className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-orange-500 dark:group-hover:text-orange-400" />
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