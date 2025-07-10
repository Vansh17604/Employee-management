import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import Sidebar from './Sidebar';

// Hook to detect mobile screen size
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on mount
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Only close sidebar when switching from mobile to desktop
  // Keep track of previous mobile state to detect actual transitions
  const [prevIsMobile, setPrevIsMobile] = useState(isMobile);

  useEffect(() => {
    // Only close sidebar if we're transitioning FROM mobile TO desktop
    // and the sidebar was open
    if (prevIsMobile && !isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
    setPrevIsMobile(isMobile);
  }, [isMobile, prevIsMobile, sidebarOpen]);

  const handleSidebarToggle = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      <div className="flex flex-col min-h-screen">
        {/* Header with sidebar toggle for mobile */}
        <AppHeader 
          onToggleSidebar={handleSidebarToggle} // Fixed prop name to match AppHeader
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
        />
        
        <div className="flex flex-1 relative">
          {/* Sidebar - Always render, let Sidebar component handle visibility */}
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
          />
          
          {/* Main content */}
          <main className="flex-1 p-4 bg-gray-100 transition-all duration-300 ease-in-out">
            <Outlet />
          </main>
        </div>
        
        <AppFooter />
      </div>
    </div>
  );
};

export default AdminLayout;