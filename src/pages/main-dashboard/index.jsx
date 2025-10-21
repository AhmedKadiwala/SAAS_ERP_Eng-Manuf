import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import TeamPerformance from './components/TeamPerformance';
import RegionalMap from './components/RegionalMap';
import Icon from '../../components/AppIcon';

const MainDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock KPI data with trends
  const kpiData = [
    {
      title: 'Total Revenue',
      value: 1250000,
      previousValue: 1100000,
      icon: 'DollarSign',
      gradient: 'bg-gradient-to-r from-blue-500 to-purple-600',
      prefix: '$',
      trend: 'M 10 50 Q 30 30 50 40 T 90 30 T 130 35 T 170 25 T 190 30'
    },
    {
      title: 'Active Customers',
      value: 4140,
      previousValue: 3850,
      icon: 'Users',
      gradient: 'bg-gradient-to-r from-green-500 to-teal-600',
      trend: 'M 10 45 Q 30 35 50 30 T 90 25 T 130 20 T 170 15 T 190 20'
    },
    {
      title: 'Sales Pipeline',
      value: 89,
      previousValue: 76,
      icon: 'TrendingUp',
      gradient: 'bg-gradient-to-r from-orange-500 to-red-600',
      suffix: ' deals',
      trend: 'M 10 40 Q 30 45 50 35 T 90 30 T 130 25 T 170 20 T 190 25'
    },
    {
      title: 'Inventory Value',
      value: 485000,
      previousValue: 465000,
      icon: 'Package',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-600',
      prefix: '$',
      trend: 'M 10 35 Q 30 40 50 30 T 90 35 T 130 30 T 170 25 T 190 30'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - ModernERP</title>
        <meta name="description" content="Comprehensive business overview with animated KPI cards and customizable widget layout for executive decision-making" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <NavigationSidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <NavigationHeader sidebarCollapsed={sidebarCollapsed} />

        <main className={`
          transition-all duration-300 ease-out pt-16
          ${sidebarCollapsed ? 'ml-16' : 'ml-72'}
        `}>
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <NavigationBreadcrumbs />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="text-3xl font-bold gradient-text mb-2">
                    Welcome back, Admin
                  </h1>
                  <p className="text-muted-foreground">
                    {formatDate(currentTime)} • {formatTime(currentTime)}
                  </p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex items-center space-x-4"
              >
                <div className="glass-card px-4 py-2 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-foreground">System Online</span>
                </div>
                
                <button className="glass-card p-3 hover:bg-muted/50 transition-colors duration-150">
                  <Icon name="RefreshCw" size={18} />
                </button>
              </motion.div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {kpiData?.map((kpi, index) => (
                <motion.div
                  key={kpi?.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <KPICard {...kpi} />
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Revenue Chart - Spans 2 columns */}
              <div className="xl:col-span-2">
                <RevenueChart />
              </div>

              {/* Activity Feed */}
              <div className="xl:col-span-1">
                <ActivityFeed />
              </div>
            </div>

            {/* Secondary Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Team Performance */}
              <TeamPerformance />

              {/* Regional Map */}
              <RegionalMap />
            </div>

            {/* Quick Stats Footer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="glass-card p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mx-auto mb-3">
                    <Icon name="Calendar" size={24} color="white" />
                  </div>
                  <h4 className="text-sm font-medium text-muted-foreground">This Month</h4>
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-xs text-muted-foreground">New Customers</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl mx-auto mb-3">
                    <Icon name="FileText" size={24} color="white" />
                  </div>
                  <h4 className="text-sm font-medium text-muted-foreground">Invoices</h4>
                  <p className="text-2xl font-bold text-foreground">89</p>
                  <p className="text-xs text-muted-foreground">Generated Today</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl mx-auto mb-3">
                    <Icon name="Target" size={24} color="white" />
                  </div>
                  <h4 className="text-sm font-medium text-muted-foreground">Conversion</h4>
                  <p className="text-2xl font-bold text-foreground">73%</p>
                  <p className="text-xs text-muted-foreground">Lead to Customer</p>
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl mx-auto mb-3">
                    <Icon name="Clock" size={24} color="white" />
                  </div>
                  <h4 className="text-sm font-medium text-muted-foreground">Avg. Response</h4>
                  <p className="text-2xl font-bold text-foreground">2.4h</p>
                  <p className="text-xs text-muted-foreground">Customer Support</p>
                </div>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Quick Actions Floating Button */}
        <QuickActions />
      </div>
    </>
  );
};

export default MainDashboard;