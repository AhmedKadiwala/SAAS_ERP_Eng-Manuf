import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const BillingAnalytics = ({ analyticsData }) => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const revenueData = [
    { month: 'Jan', revenue: 12500, subscriptions: 45 },
    { month: 'Feb', revenue: 15200, subscriptions: 52 },
    { month: 'Mar', revenue: 18900, subscriptions: 61 },
    { month: 'Apr', revenue: 22100, subscriptions: 68 },
    { month: 'May', revenue: 25800, subscriptions: 75 },
    { month: 'Jun', revenue: 28400, subscriptions: 82 }
  ];

  const churnData = [
    { name: 'Retained', value: 85, color: '#4facfe' },
    { name: 'Churned', value: 15, color: '#f5576c' }
  ];

  const upgradePatterns = [
    { plan: 'Starter to Pro', count: 24, percentage: 45 },
    { plan: 'Pro to Enterprise', count: 12, percentage: 23 },
    { plan: 'Starter to Enterprise', count: 8, percentage: 15 },
    { plan: 'Downgrades', count: 9, percentage: 17 }
  ];

  const MetricCard = ({ title, value, change, icon, color = "primary" }) => (
    <div className="glass-card p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-${color}/10 rounded-xl flex items-center justify-center`}>
          <Icon name={icon} size={24} className={`text-${color}`} />
        </div>
        <div className={`
          flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
          ${change >= 0 ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}
        `}>
          <Icon name={change >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );

  const ChartContainer = ({ title, children }) => (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">{title}</h3>
      <div className="h-80">
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Billing Analytics</h2>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e?.target?.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          >
            <option value="revenue">Revenue</option>
            <option value="subscriptions">Subscriptions</option>
            <option value="churn">Churn Rate</option>
            <option value="upgrades">Upgrades</option>
          </select>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Monthly Revenue"
          value="$28,400"
          change={12.5}
          icon="DollarSign"
          color="success"
        />
        <MetricCard
          title="Active Subscriptions"
          value="82"
          change={8.2}
          icon="Users"
          color="primary"
        />
        <MetricCard
          title="Churn Rate"
          value="15%"
          change={-2.1}
          icon="TrendingDown"
          color="warning"
        />
        <MetricCard
          title="Avg Revenue Per User"
          value="$346"
          change={5.8}
          icon="Target"
          color="accent"
        />
      </div>
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <ChartContainer title="Revenue Growth">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Subscription Growth */}
        <ChartContainer title="Subscription Growth">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar
                dataKey="subscriptions"
                fill="var(--color-accent)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        {/* Churn Analysis */}
        <ChartContainer title="Customer Retention">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={churnData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {churnData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {churnData?.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item?.name}: {item?.value}%
                </span>
              </div>
            ))}
          </div>
        </ChartContainer>

        {/* Upgrade Patterns */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Plan Changes</h3>
          <div className="space-y-4">
            {upgradePatterns?.map((pattern, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="ArrowUpRight" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{pattern?.plan}</p>
                    <p className="text-sm text-muted-foreground">{pattern?.count} changes</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{pattern?.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Payment Success Rate */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Payment Success Rate</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full" />
            <span className="text-sm text-muted-foreground">98.5% Success Rate</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
            <p className="text-2xl font-bold text-foreground">1,247</p>
            <p className="text-sm text-muted-foreground">Successful Payments</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="XCircle" size={24} className="text-error" />
            </div>
            <p className="text-2xl font-bold text-foreground">19</p>
            <p className="text-sm text-muted-foreground">Failed Payments</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Clock" size={24} className="text-warning" />
            </div>
            <p className="text-2xl font-bold text-foreground">8</p>
            <p className="text-sm text-muted-foreground">Pending Payments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingAnalytics;