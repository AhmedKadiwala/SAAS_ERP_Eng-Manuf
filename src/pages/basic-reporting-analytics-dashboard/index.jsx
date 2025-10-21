import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import Icon from '../../components/AppIcon';
import { analyticsService } from '../../services/analyticsService';
import ChartBuilder from './components/ChartBuilder';
import ReportGallery from './components/ReportGallery';

import ExportPanel from './components/ExportPanel';

const BasicReportingAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('revenue');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const [realtimeData, setRealtimeData] = useState(null);

  useEffect(() => {
    loadAnalytics();
    
    // Set up real-time subscription
    const unsubscribe = analyticsService?.subscribeToAnalyticsUpdates(() => {
      loadAnalytics();
    });

    return () => unsubscribe?.();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const [overviewResult, revenueResult, customerResult, productResult] = await Promise.all([
        analyticsService?.getAnalyticsOverview(),
        analyticsService?.getRevenueAnalytics(selectedPeriod),
        analyticsService?.getCustomerAnalytics(),
        analyticsService?.getProductAnalytics()
      ]);

      if (overviewResult?.error) {
        throw overviewResult?.error;
      }

      setAnalytics({
        overview: overviewResult?.data,
        revenue: revenueResult?.data,
        customers: customerResult?.data,
        products: productResult?.data
      });

    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type, format) => {
    try {
      const result = await analyticsService?.exportAnalytics(type, format);
      if (result?.data) {
        // Create download link
        const blob = new Blob([result?.data], { type: 'application/json' });
        const url = URL?.createObjectURL(blob);
        const link = document?.createElement('a');
        link.href = url;
        link.download = result?.filename;
        document?.body?.appendChild(link);
        link?.click();
        document?.body?.removeChild(link);
        URL?.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };

  const chartTypes = [
    { id: 'revenue', label: 'Revenue Trends', icon: 'TrendingUp' },
    { id: 'customers', label: 'Customer Analytics', icon: 'Users' },
    { id: 'products', label: 'Product Performance', icon: 'Package' },
    { id: 'activities', label: 'Activity Analysis', icon: 'Activity' }
  ];

  const periodOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'builder', label: 'Chart Builder', icon: 'Settings' },
    { id: 'reports', label: 'Report Gallery', icon: 'FileText' },
    { id: 'export', label: 'Export', icon: 'Download' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="AlertCircle" className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-destructive">{error}</p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive business intelligence and reporting</p>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e?.target?.value)}
                className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {periodOptions?.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={loadAnalytics}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <Icon name="RefreshCw" size={16} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Content Area */}
      <div className="container mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${analytics?.revenue?.summary?.totalRevenue?.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-success flex items-center mt-2">
                      <Icon name="TrendingUp" size={14} className="mr-1" />
                      +12.5% vs last period
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="DollarSign" className="text-primary" size={24} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Customers</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analytics?.overview?.customers?.toLocaleString() || '0'}
                    </p>
                    <p className="text-sm text-success flex items-center mt-2">
                      <Icon name="TrendingUp" size={14} className="mr-1" />
                      +8.3% growth
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Users" className="text-blue-500" size={24} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analytics?.overview?.products?.total || '0'}
                    </p>
                    <p className="text-sm text-orange-500 flex items-center mt-2">
                      <Icon name="AlertCircle" size={14} className="mr-1" />
                      {analytics?.overview?.products?.lowStock || '0'} low stock
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Package" className="text-green-500" size={24} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Invoice Value</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${analytics?.revenue?.summary?.averageValue?.toFixed(0) || '0'}
                    </p>
                    <p className="text-sm text-success flex items-center mt-2">
                      <Icon name="TrendingUp" size={14} className="mr-1" />
                      +15.2% vs last period
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Icon name="Receipt" className="text-purple-500" size={24} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Revenue Trends</h3>
                  <div className="flex space-x-2">
                    {chartTypes?.map((type) => (
                      <button
                        key={type?.id}
                        onClick={() => setSelectedChart(type?.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedChart === type?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                        title={type?.label}
                      >
                        <Icon name={type?.icon} size={16} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.revenue?.chartData || []}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                        tickFormatter={(value) => `$${value?.toLocaleString()}`}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload?.[0]) {
                            return (
                              <div className="glass-card p-3 shadow-floating border border-border/50">
                                <p className="text-sm font-medium text-foreground">{label}</p>
                                <p className="text-sm text-primary">
                                  Revenue: ${payload?.[0]?.value?.toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="var(--color-primary)"
                        strokeWidth={2}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Customer Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-6">Customer Distribution</h3>
                
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object?.entries(analytics?.customers?.industryBreakdown || {})?.map(([industry, count]) => ({
                          name: industry?.charAt(0)?.toUpperCase() + industry?.slice(1),
                          value: count,
                          alt: `${industry} industry: ${count} customers`
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {Object?.entries(analytics?.customers?.industryBreakdown || {})?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload?.[0]) {
                            return (
                              <div className="glass-card p-3 shadow-floating border border-border/50">
                                <p className="text-sm font-medium text-foreground">{payload?.[0]?.payload?.name}</p>
                                <p className="text-sm text-primary">
                                  Customers: {payload?.[0]?.value}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  {Object?.entries(analytics?.customers?.industryBreakdown || {})?.slice(0, 4)?.map(([industry, count], index) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {industry?.charAt(0)?.toUpperCase() + industry?.slice(1)}: {count}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Activities Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass-card p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activities</h3>
              
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {analytics?.overview?.activities?.map((activity, index) => (
                  <div key={activity?.id || index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Activity" size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                      <p className="text-sm text-muted-foreground">{activity?.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity?.created_at)?.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {activity?.activity_type?.replace('_', ' ')}
                    </span>
                  </div>
                ))}
                
                {(!analytics?.overview?.activities || analytics?.overview?.activities?.length === 0) && (
                  <div className="text-center text-muted-foreground py-8">
                    <Icon name="Activity" size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No recent activities found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'builder' && (
          <ChartBuilder 
            analytics={analytics}
            onChartUpdate={(chartData) => setRealtimeData(chartData)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportGallery 
            analytics={analytics}
            onGenerateReport={(reportConfig) => console.log('Generate report:', reportConfig)}
          />
        )}

        {activeTab === 'export' && (
          <ExportPanel 
            analytics={analytics}
            onExport={handleExport}
          />
        )}
      </div>
    </div>
  );
};

export default BasicReportingAnalyticsDashboard;