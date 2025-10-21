import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionButton from '../../components/ui/QuickActionButton';
import RevenueChart from './components/RevenueChart';
import ConversionFunnel from './components/ConversionFunnel';
import TeamPerformance from './components/TeamPerformance';
import GoalTracking from './components/GoalTracking';
import CommissionCalculator from './components/CommissionCalculator';
import SalesForecasting from './components/SalesForecasting';
import RegionalHeatMap from './components/RegionalHeatMap';
import DateRangePicker from './components/DateRangePicker';

const SalesAnalyticsSuite = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'performance', label: 'Team Performance', icon: 'Users' },
    { id: 'goals', label: 'Goal Tracking', icon: 'Target' },
    { id: 'commission', label: 'Commission', icon: 'DollarSign' },
    { id: 'forecasting', label: 'Forecasting', icon: 'TrendingUp' },
    { id: 'regional', label: 'Regional', icon: 'Globe' }
  ];

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '$4.2M',
      change: '+18.5%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'primary'
    },
    {
      title: 'Deals Closed',
      value: '342',
      change: '+12.3%',
      trend: 'up',
      icon: 'Handshake',
      color: 'success'
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '+2.1%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'accent'
    },
    {
      title: 'Avg Deal Size',
      value: '$12.3k',
      change: '-3.2%',
      trend: 'down',
      icon: 'Calculator',
      color: 'warning'
    }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      console.log(`Exporting analytics data as ${format}`);
      setIsExporting(false);
    }, 2000);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    console.log('Date range changed:', range);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart />
              <ConversionFunnel />
            </div>
          </div>
        );
      case 'performance':
        return <TeamPerformance />;
      case 'goals':
        return <GoalTracking />;
      case 'commission':
        return <CommissionCalculator />;
      case 'forecasting':
        return <SalesForecasting />;
      case 'regional':
        return <RegionalHeatMap />;
      default:
        return (
          <div className="glass-card p-12 text-center">
            <Icon name="BarChart3" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Select a Tab</h3>
            <p className="text-muted-foreground">Choose a tab above to view analytics</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Breadcrumbs */}
        <NavigationBreadcrumbs />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Sales Analytics Suite</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive sales performance visualization and data-driven insights
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <DateRangePicker onDateChange={handleDateRangeChange} />
            
            <div className="relative">
              <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors duration-150"
              >
                {isExporting ? (
                  <Icon name="Loader2" size={16} className="animate-spin" />
                ) : (
                  <Icon name="Download" size={16} />
                )}
                <span className="text-sm font-medium">
                  {isExporting ? 'Exporting...' : 'Export'}
                </span>
              </button>
            </div>
            
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150">
              <Icon name="RefreshCw" size={20} />
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards?.map((kpi, index) => (
            <motion.div
              key={kpi?.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover-lift"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${kpi?.color}/10 rounded-xl flex items-center justify-center`}>
                  <Icon name={kpi?.icon} size={24} className={`text-${kpi?.color}`} />
                </div>
                <div className={`flex items-center space-x-1 ${
                  kpi?.trend === 'up' ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={kpi?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                  />
                  <span className="text-sm font-medium">{kpi?.change}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-1">{kpi?.value}</h3>
                <p className="text-sm text-muted-foreground">{kpi?.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="glass-card p-2">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg whitespace-nowrap transition-all duration-150 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span className="text-sm font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>

        {/* Quick Actions */}
        <QuickActionButton />
      </div>
    </div>
  );
};

export default SalesAnalyticsSuite;