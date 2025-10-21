import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';

const RevenueChart = () => {
  const [chartType, setChartType] = useState('area');
  const [timeRange, setTimeRange] = useState('6months');

  const revenueData = [
    { month: 'Apr 2024', revenue: 45000, target: 50000, growth: 12.5 },
    { month: 'May 2024', revenue: 52000, target: 55000, growth: 15.6 },
    { month: 'Jun 2024', revenue: 48000, target: 52000, growth: 6.7 },
    { month: 'Jul 2024', revenue: 61000, target: 58000, growth: 27.1 },
    { month: 'Aug 2024', revenue: 58000, target: 60000, growth: 20.8 },
    { month: 'Sep 2024', revenue: 67000, target: 65000, growth: 39.6 },
    { month: 'Oct 2024', revenue: 72000, target: 70000, growth: 44.0 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card p-4 border border-border/50 shadow-floating">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-muted-foreground capitalize">{entry?.dataKey}:</span>
              <span className="text-sm font-medium text-foreground">
                ${entry?.value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Trends</h3>
          <p className="text-sm text-muted-foreground">Monthly performance vs targets</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-muted/30 rounded-lg p-1">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                chartType === 'area' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                chartType === 'line' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Line
            </button>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e?.target?.value)}
            className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="12months">12 Months</option>
          </select>
        </div>
      </div>
      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'area' ? (
            <AreaChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => value?.split(' ')?.[0]}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="var(--color-accent)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#targetGradient)"
                name="Target"
              />
            </AreaChart>
          ) : (
            <LineChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => value?.split(' ')?.[0]}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="var(--color-accent)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 3 }}
                name="Target"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-xs text-muted-foreground">Avg Growth</span>
          </div>
          <p className="text-lg font-semibold text-success">+23.8%</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Target Hit</span>
          </div>
          <p className="text-lg font-semibold text-primary">85.7%</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="DollarSign" size={16} className="text-accent" />
            <span className="text-xs text-muted-foreground">Total Revenue</span>
          </div>
          <p className="text-lg font-semibold text-foreground">$403k</p>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;