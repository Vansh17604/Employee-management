import { useState, useEffect } from 'react';
import { Users, Clock, TrendingUp, Award, Menu, X, UserCheck, AlertCircle } from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const mockDashboardStats = [
  {
    title: "Total Employees",
    value: "247",
    icon: "Users",
    change: "+12%",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200"
  },
  {
    title: "Present Today",
    value: "231",
    icon: "UserCheck",
    change: "94%",
    color: "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200"
  },
  {
    title: "Avg Performance",
    value: "8.5/10",
    icon: "TrendingUp",
    change: "+0.3",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-200"
  },
  {
    title: "Avg Hours/Week",
    value: "42.5",
    icon: "Clock",
    change: "+2.1",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-200"
  }
];

const mockWeeklyAttendance = [
  { name: 'Mon', present: 235, absent: 12, late: 8 },
  { name: 'Tue', present: 240, absent: 7, late: 5 },
  { name: 'Wed', present: 231, absent: 16, late: 12 },
  { name: 'Thu', present: 238, absent: 9, late: 7 },
  { name: 'Fri', present: 242, absent: 5, late: 3 },
  { name: 'Sat', present: 186, absent: 61, late: 2 },
  { name: 'Sun', present: 89, absent: 158, late: 1 }
];

const mockMonthlyPerformance = [
  { name: 'Jan', performance: 8.2, productivity: 85 },
  { name: 'Feb', performance: 8.0, productivity: 82 },
  { name: 'Mar', performance: 8.4, productivity: 88 },
  { name: 'Apr', performance: 8.6, productivity: 90 },
  { name: 'May', performance: 8.3, productivity: 87 },
  { name: 'Jun', performance: 8.5, productivity: 89 }
];

const mockDepartmentStats = [
  { name: 'Engineering', value: 82, color: '#0088FE' },
  { name: 'Marketing', value: 34, color: '#00C49F' },
  { name: 'Sales', value: 45, color: '#FFBB28' },
  { name: 'HR', value: 28, color: '#FF8042' },
  { name: 'Finance', value: 35, color: '#8884d8' },
  { name: 'Operations', value: 23, color: '#82ca9d' }
];

const mockRecentActivities = [
  {
    id: "EMP001",
    employee: "Sarah Johnson",
    action: "Clock In",
    department: "Engineering",
    time: "09:15 AM",
    status: "On Time"
  },
  {
    id: "EMP045",
    employee: "Mike Chen",
    action: "Leave Request",
    department: "Marketing",
    time: "08:45 AM",
    status: "Pending"
  },
  {
    id: "EMP123",
    employee: "Emily Davis",
    action: "Task Completed",
    department: "Sales",
    time: "11:30 AM",
    status: "Completed"
  },
  {
    id: "EMP067",
    employee: "James Wilson",
    action: "Clock Out",
    department: "HR",
    time: "06:15 PM",
    status: "Overtime"
  },
  {
    id: "EMP089",
    employee: "Lisa Anderson",
    action: "Performance Review",
    department: "Finance",
    time: "02:00 PM",
    status: "Scheduled"
  }
];

// StatsCard Component - Enhanced for mobile
const StatsCard = ({ title, value, icon: Icon, change, color }) => (
  <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
    <div className="flex justify-between items-start mb-3 sm:mb-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</h3>
        <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className={`p-2 sm:p-3 rounded-full flex-shrink-0 ml-2 ${color}`}>
        <Icon size={16} className="sm:w-5 sm:h-5" />
      </div>
    </div>
    <div className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">
      {change} <span className="text-gray-500 dark:text-gray-400">from last month</span>
    </div>
  </div>
);

// AttendanceChart Component - Mobile optimized
const AttendanceChart = ({ attendanceData, isLoading }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-gray-900 dark:text-white">Weekly Attendance</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px] sm:h-[300px]">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
          <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF" 
              fontSize={12}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(255, 255, 255)', 
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '8px',
                color: 'black',
                fontSize: '12px'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="present" fill="#10b981" name="Present" />
            <Bar dataKey="late" fill="#f59e0b" name="Late" />
            <Bar dataKey="absent" fill="#ef4444" name="Absent" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// PerformanceChart Component - Mobile optimized
const PerformanceChart = ({ performanceData, isLoading }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-gray-900 dark:text-white">Performance & Productivity</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px] sm:h-[300px]">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
          <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF" 
              fontSize={12}
              tick={{ fontSize: 10 }}
            />
            <YAxis 
              stroke="#9CA3AF" 
              fontSize={12}
              tick={{ fontSize: 10 }}
              width={40}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(255, 255, 255)', 
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '8px',
                color: 'black',
                fontSize: '12px'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Area 
              type="monotone" 
              dataKey="performance" 
              stroke="#4f46e5" 
              fill="#4f46e5" 
              fillOpacity={0.2} 
              name="Performance Score" 
            />
            <Area 
              type="monotone" 
              dataKey="productivity" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.2} 
              name="Productivity %" 
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// DepartmentChart Component - Mobile optimized
const DepartmentChart = ({ departmentData, isLoading }) => {
  const [isMobile, setIsMobile] = useState(false);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-gray-900 dark:text-white">Department Distribution</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-[200px] sm:h-[300px]">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
          <PieChart>
            <Pie
              data={departmentData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={isMobile ? 60 : 80}
              fill="#8884d8"
              label={!isMobile ? ({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%` : false}
              labelStyle={{ fontSize: '10px' }}
            >
              {departmentData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(255, 255, 255)', 
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '8px',
                color: 'black',
                fontSize: '12px'
              }} 
            />
            <Legend wrapperStyle={{ fontSize: '10px' }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// RecentActivitiesTable Component - Mobile optimized
const RecentActivitiesTable = ({ activities, isLoading }) => {
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Status badge color mapping
  const statusColorMap = {
    'Completed': 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200',
    'Pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200',
    'On Time': 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200',
    'Overtime': 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-200',
    'Scheduled': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };

  // Show only first 3 activities on mobile unless "Show All" is clicked
  const displayActivities = isMobile && !showAll ? activities.slice(0, 3) : activities;

  return (
    <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Recent Activities</h3>
        {isMobile && activities.length > 3 && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {showAll ? 'Show Less' : `Show All (${activities.length})`}
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-[150px] sm:h-[200px]">
          <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Action</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">Time</th>
                  <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {displayActivities.map((activity, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">{activity.employee}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">{activity.department}</div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300">{activity.action}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 dark:text-gray-300 hidden sm:table-cell">{activity.time}</td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[activity.status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                        {activity.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Loading Skeleton for Stats Cards
const StatsCardSkeleton = () => (
  <div className="p-4 sm:p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800 animate-pulse border border-gray-200 dark:border-gray-700">
    <div className="flex justify-between items-start mb-3 sm:mb-4">
      <div className="flex-1">
        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded w-16 sm:w-20 mb-2"></div>
        <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-600 rounded w-12 sm:w-16"></div>
      </div>
      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
    </div>
    <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-600 rounded w-20 sm:w-24"></div>
  </div>
);

// Icon mapping for stats cards
const iconMap = {
  'Users': Users,
  'UserCheck': UserCheck,
  'TrendingUp': TrendingUp,
  'Clock': Clock,
  'Award': Award
};

// Main Dashboard Component - Enhanced for mobile
const EmployeeDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState([]);
  const [weeklyAttendance, setWeeklyAttendance] = useState([]);
  const [monthlyPerformance, setMonthlyPerformance] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardStats(mockDashboardStats);
      setWeeklyAttendance(mockWeeklyAttendance);
      setMonthlyPerformance(mockMonthlyPerformance);
      setDepartmentStats(mockDepartmentStats);
      setRecentActivities(mockRecentActivities);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      // Refresh data in real implementation
      console.log('Refreshing dashboard data...');
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header - Mobile optimized */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Employee Management</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor your team's performance and activities</p>
          </div>
          
          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="sm:hidden p-2 text-gray-500 dark:text-gray-400"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Cards - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {isLoading ? (
            // Show skeleton loading for stats cards
            Array(4).fill(0).map((_, index) => (
              <StatsCardSkeleton key={index} />
            ))
          ) : (
            // Show actual stats cards
            dashboardStats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={iconMap[stat.icon] || Users}
                change={stat.change}
                color={stat.color}
              />
            ))
          )}
        </div>
        
        {/* Charts Row - Stack on mobile, side by side on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <AttendanceChart 
            attendanceData={weeklyAttendance} 
            isLoading={isLoading} 
          />
          <PerformanceChart 
            performanceData={monthlyPerformance} 
            isLoading={isLoading} 
          />
        </div>
        
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <DepartmentChart 
              departmentData={departmentStats} 
              isLoading={isLoading} 
            />
          </div>
          <div className="lg:col-span-3">
            <RecentActivitiesTable 
              activities={recentActivities} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;