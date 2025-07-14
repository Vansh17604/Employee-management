import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';

import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  LayoutDashboard,
  Users,
  UserPlus,
  Eye,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Award,
  Clock,
  TrendingUp,
  Loader2,
  X,
  Menu,
  File
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Import the auth store
import useAuthStore from '../../app/authStore';

// Hook to detect screen size
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

// Navigation configuration for Employee Management System
const useNav = () => {
   const _nav = [
    {
      type: "item",
      title: "Dashboard",
      path: "/admin",
      icon: <LayoutDashboard size={20} />,
      badge: { text: "NEW", variant: "default" }
    },
    {
      type: "title",
      title: "Employee Management",
    },
    {
      type: "group",
      title: "Employees",
      icon: <Users size={20} />,
      items: [
        {
          type: "item",
          title: "Add User",
          path: "/admin/adduser",
        },
        {
          type: "item",
          title: "Workplace Add/Edit",
          path: "/admin/addworkplace",
        },
        {
          type: "item",
          title: "Add/Edit Bank",
          path: "/admin/addbank"
        },
      ]
    },
    {
      type: 'group',
      title: 'View Employees',
      icon: <Users size={20} />,
      items: [
        {
          type: "item",
          title: "View Pending Employee",
          path: "/admin/vieweemployees"
        },
        {
          type: "item",
          title: "View Rejected Employee",
          path: "/admin/viewrejectedemployee"
        },{
          type: "item",
          title: "View Approved Employee",
          
          path: "/admin/viewapprovedemployee"
        }
        
      ]
    },
    {
      type:'group',
      title:"View Documents",
      icon: <File size={20} />,
      items:[
         
        {
          type: "item",
          title: "View Pending Documents",
          path: "/admin/viewpendingdoc",

        },{
 type: "item",
          title: "View Rejected Documents",
          path: "/admin/rejectedDocs",
        },{
 type: "item",
          title: "View Approved Documents",
          path: "/admin/approvedDocs",
        },

      ]

    }
  ];

  return _nav;
};

const Sidebar = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("/admin");
  const [openGroups, setOpenGroups] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  
  // Media queries for responsive behavior
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  
  const navigate = useNavigate();
  const _nav = useNav();
  
  
  const { user, logout, getUserById, loading, error } = useAuthStore();

  
  useEffect(() => {
    if (isMobile) {
      setCollapsed(false);
    } else if (isTablet && !isMobile) {
      setCollapsed(true);
    } else if (isDesktop) {
      
    }
  }, [isMobile, isTablet, isDesktop]);

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

  // Update active path based on current location
  useEffect(() => {
    setActivePath(window.location.pathname);
  }, []);

  // Close sidebar when clicking outside on mobile - FIXED
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen) {
        const sidebar = document.querySelector('[data-sidebar]');
        const backdrop = document.querySelector('[data-backdrop]');
        
        // If clicking on backdrop or outside sidebar
        if (event.target === backdrop || 
            (sidebar && !sidebar.contains(event.target))) {
          onClose?.();
        }
      }
    };

    if (isMobile && isOpen) {
      // Add slight delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobile, isOpen, onClose]);

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isMobile && isOpen) {
        onClose?.();
      }
    };

    if (isMobile && isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => document.removeEventListener('keydown', handleEscapeKey);
    }
  }, [isMobile, isOpen, onClose]);

  // Toggle nav group open/closed state
  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Handle navigation
  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
    // Close mobile sidebar after navigation
    if (isMobile && onClose) {
      onClose();
    }
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

  // Handle collapse toggle
  const handleCollapseToggle = () => {
    // On mobile, don't allow collapse - use close instead
    if (isMobile) {
      onClose?.();
    } else {
      setCollapsed(!collapsed);
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

  // Determine effective collapsed state
  const effectiveCollapsed = isMobile ? false : collapsed;

  // Render navigation item based on type
  const renderNavItem = (item, index) => {
    // Title type
    if (item.type === "title") {
      return (
        <div key={index} className={cn(
          "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
          effectiveCollapsed && "text-center"
        )}>
          {!effectiveCollapsed && item.title}
        </div>
      );
    }
    
    // Group type
    else if (item.type === "group") {
      return (
        <Collapsible 
          key={index}
          open={openGroups[item.title]} 
          onOpenChange={() => toggleGroup(item.title)}
          className="w-full"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between mb-1 hover:bg-accent transition-colors",
                      effectiveCollapsed && "justify-center p-2"
                    )}
                  >
                    <span className={cn(
                      "flex items-center gap-3",
                      effectiveCollapsed && "justify-center"
                    )}>
                      <span className="text-muted-foreground">{item.icon}</span>
                      {!effectiveCollapsed && <span className="text-sm md:text-base">{item.title}</span>}
                    </span>
                    {!effectiveCollapsed && (
                      openGroups[item.title] ? 
                        <ChevronUp size={16} className="text-muted-foreground" /> : 
                        <ChevronDown size={16} className="text-muted-foreground" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </TooltipTrigger>
              {effectiveCollapsed && (
                <TooltipContent side="right">
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          {!effectiveCollapsed && (
            <CollapsibleContent className="pl-6 md:pl-8 space-y-1">
              {item.items.map((subItem, subIndex) => (
                <Button
                  key={subIndex}
                  variant={activePath === subItem.path ? "secondary" : "ghost"}
                  className="w-full justify-start hover:bg-accent transition-colors text-sm"
                  onClick={() => handleNavigation(subItem.path)}
                >
                  <span className="flex-1 text-left">{subItem.title}</span>
                </Button>
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    }
    
    // Regular item
    else {
      return (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePath === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1 hover:bg-accent transition-colors",
                  effectiveCollapsed && "justify-center p-2"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={cn(
                  "text-muted-foreground",
                  activePath === item.path && "text-foreground"
                )}>
                  {item.icon}
                </span>
                {!effectiveCollapsed && (
                  <span className="flex-1 text-left text-sm md:text-base">{item.title}</span>
                )}
                {!effectiveCollapsed && item.badge && item.badge.text && (
                  <Badge variant={item.badge.variant} className="ml-auto shrink-0 text-xs">
                    {item.badge.text}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            {effectiveCollapsed && (
              <TooltipContent side="right">
                <div className="flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.badge && item.badge.text && (
                    <Badge variant={item.badge.variant} className="shrink-0 text-xs">
                      {item.badge.text}
                    </Badge>
                  )}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    }
  };

  return (
    <>
      {/* Mobile backdrop - FIXED */}
      {isMobile && isOpen && (
        <div 
          data-backdrop
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar - FIXED positioning and transform */}
      <div 
        data-sidebar
        className={cn(
          "flex flex-col h-screen bg-background border-r border-border transition-all duration-300 ease-in-out shadow-sm",
          // Position - FIXED
          isMobile ? "fixed left-0 top-0" : "relative",
          "z-50",
          // Width
          isMobile ? "w-72" : effectiveCollapsed ? "w-16 md:w-20" : "w-64 lg:w-72",
          // Transform for mobile - FIXED
          isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"
        )}
      >
        {/* Header with Logo & Controls */}
        <div className={cn(
          "flex items-center justify-between p-3 md:p-4 bg-primary/5 border-b",
          effectiveCollapsed && !isMobile && "justify-center"
        )}>
          {/* Logo */}
          <div className={cn(
            "flex items-center gap-2",
            effectiveCollapsed && !isMobile && "justify-center"
          )}>
            <Building2 className="h-6 w-6 text-primary flex-shrink-0" />
            {(!effectiveCollapsed || isMobile) && (
              <span className="font-bold text-lg md:text-xl text-primary whitespace-nowrap">
                Admin Panel
              </span>
            )}
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-1">
            {/* Collapse/Expand button (desktop only) */}
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCollapseToggle}
                className="hover:bg-accent h-8 w-8"
              >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Button>
            )}
            
            {/* Close button (mobile only) - FIXED */}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose?.();
                }}
                className="hover:bg-accent h-8 w-8"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div className={cn(
          "p-3 md:p-4 bg-muted/20 border-b",
          effectiveCollapsed && !isMobile ? "flex justify-center" : "flex items-center gap-3"
        )}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-8 w-8 md:h-10 md:w-10 cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-colors flex-shrink-0">
                  <AvatarImage src={userDetails?.avatar} alt={displayName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs md:text-sm">
                    {userLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      getUserInitials(displayName)
                    )}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              {(effectiveCollapsed && !isMobile) && (
                <TooltipContent side="right">
                  <div className="text-left">
                    <p className="font-medium">
                      {userLoading ? 'Loading...' : displayName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {userLoading ? '' : displayRole}
                    </p>
                    {displayEmail && (
                      <p className="text-xs text-muted-foreground">
                        {displayEmail}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          {(!effectiveCollapsed || isMobile) && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-medium text-sm md:text-base truncate">
                {userLoading ? 'Loading...' : displayName}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground truncate">
                {userLoading ? '' : displayRole}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-2 md:px-3 py-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <nav className="flex flex-col gap-1">
            {_nav.map((item, index) => renderNavItem(item, index))}
          </nav>
        </div>

        {/* Error display */}
        {error && (!effectiveCollapsed || isMobile) && (
          <div className="mx-2 md:mx-3 mb-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        {/* Logout Button */}
        <div className="p-2 md:p-3 mt-auto border-t bg-muted/10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  disabled={loading}
                  className={cn(
                    "w-full border-dashed hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 disabled:opacity-50 transition-colors",
                    (effectiveCollapsed && !isMobile) && "p-2 justify-center"
                  )}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin text-muted-foreground" />
                  ) : (
                    <LogOut size={18} className="text-muted-foreground" />
                  )}
                  {(!effectiveCollapsed || isMobile) && (
                    <span className="ml-2 text-sm">
                      {loading ? 'Logging out...' : 'Logout'}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {(effectiveCollapsed && !isMobile) && (
                <TooltipContent side="right">
                  <p>{loading ? 'Logging out...' : 'Logout'}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};

export default Sidebar;