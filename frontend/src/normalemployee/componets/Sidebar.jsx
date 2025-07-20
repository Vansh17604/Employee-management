import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";

import {
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LogOut,
  LayoutDashboard,
  Clock,
  Calendar,
  DollarSign,
  FileText,
  Settings,
  MessageSquare,
  BookOpen,
  Target,
  Bell,
  CheckSquare,
  Users,
  Heart,
  Gift,
  HelpCircle,
  Phone,
  Loader2
} from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Import the auth store
import useAuthStore from '../../app/authStore';

const useNav = () => {
  const _nav = [
  {
      type: "item",
      title:"View employee",
      path:"/normalemployee/viewapproveddata",
      icon:<User size={20} />
    }
   
  ];

  return _nav;
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("/normalemployee/viewapproveddata");
  const [openGroups, setOpenGroups] = useState({});
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  
  const _nav = useNav();
  const navigate = useNavigate();
  
  const { user, logout, getUserById, loading, error } = useAuthStore();

  // Fetch user details from API
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

  const toggleGroup = (groupName) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const handleNavigation = (path) => {
    navigate(path);
    setActivePath(path);
  };

  // Handle logout with API call
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

  // Get display data from API or fallback
  const displayName = userDetails?.name || user?.name || 'User';
  const displayRole = userDetails?.role || user?.role || 'Employee';
  const displayEmail = userDetails?.email || user?.email || '';
  const displayEmployeeId = userDetails?.employeeId || user?.employeeId || 'N/A';
  const displayDepartment = userDetails?.department || user?.department || 'General';

  // Render navigation item based on type
  const renderNavItem = (item, index) => {
    // Title type
    if (item.type === "title") {
      return (
        <div key={index} className={cn(
          "px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider",
          collapsed && "text-center px-1"
        )}>
          {!collapsed && item.title}
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
                      "w-full justify-between mb-1 hover:bg-accent/60 transition-colors",
                      collapsed && "justify-center p-2"
                    )}
                  >
                    <span className={cn(
                      "flex items-center gap-3",
                      collapsed && "justify-center"
                    )}>
                      <span className="text-muted-foreground">{item.icon}</span>
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </span>
                    {!collapsed && (
                      openGroups[item.title] ? 
                        <ChevronUp size={16} className="text-muted-foreground" /> : 
                        <ChevronDown size={16} className="text-muted-foreground" />
                    )}
                  </Button>
                </CollapsibleTrigger>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right">
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                  </div>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          
          {!collapsed && (
            <CollapsibleContent className="pl-8 space-y-1">
              {item.items.map((subItem, subIndex) => (
                <Button
                  key={subIndex}
                  variant={activePath === subItem.path ? "secondary" : "ghost"}
                  className="w-full justify-start hover:bg-accent/60 text-sm transition-colors"
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
                  "w-full justify-start gap-3 mb-1 hover:bg-accent/60 transition-colors",
                  collapsed && "justify-center p-2"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={cn(
                  "text-muted-foreground",
                  activePath === item.path && "text-foreground"
                )}>
                  {item.icon}
                </span>
                {!collapsed && (
                  <span className="flex-1 text-left text-sm">{item.title}</span>
                )}
                {!collapsed && item.badge && item.badge.text && (
                  <Badge variant={item.badge.variant} className="ml-auto shrink-0 text-xs">
                    {item.badge.text}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
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
    <div 
      className={cn(
        "flex flex-col h-screen bg-background border-r border-border transition-all duration-300 ease-in-out shadow-sm",
        collapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo & Collapse Button */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <span className="font-bold text-lg text-blue-700 dark:text-blue-300">Supervisor Panel</span>

            </div>
          </div>
        )}
        {collapsed && (
          <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mx-auto">
            <User className="h-5 w-5 text-blue-600" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <Separator />

     
      <div className={cn(
        "p-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950/50 dark:to-blue-950/20 border-b",
        collapsed ? "flex justify-center" : "flex items-center gap-3"
      )}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-11 w-11 cursor-pointer border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:scale-105">
                <AvatarImage src={userDetails?.avatar} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold text-sm">
                  {userLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    getUserInitials(displayName)
                  )}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <div className="text-sm">
                  <p className="font-medium">
                    {userLoading ? 'Loading...' : displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userLoading ? '' : displayRole}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {userLoading ? '' : displayDepartment}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ID: {userLoading ? '' : displayEmployeeId}
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
        
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-foreground truncate">
              {userLoading ? 'Loading...' : displayName}
            </span>
            <span className="text-xs text-muted-foreground truncate">
                      {displayRole.toLowerCase() === 'normalemployee' && (
  <div className="text-lg font-semibold text-gray-900 dark:text-white">
    Supervisor 
  </div>
)}
            </span>
           
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        <nav className="flex flex-col gap-1">
          {_nav.map((item, index) => renderNavItem(item, index))}
        </nav>
      </div>

      {/* Error display */}
      {error && !collapsed && (
        <div className="mx-3 mb-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* Logout with API Integration */}
      <div className="p-3 mt-auto border-t bg-muted/20">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                disabled={loading}
                className={cn(
                  "w-full border-dashed hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-300 transition-colors disabled:opacity-50",
                  collapsed && "p-2"
                )}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-muted-foreground" />
                ) : (
                  <LogOut size={18} className="text-muted-foreground" />
                )}
                {!collapsed && (
                  <span className="ml-2 text-sm">
                    {loading ? 'Signing out...' : 'Sign Out'}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                <p>{loading ? 'Signing out...' : 'Sign Out'}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;