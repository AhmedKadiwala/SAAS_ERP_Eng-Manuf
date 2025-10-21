import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const RevenueChart = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  const mockData = {
    '7d': [
      { name: 'Mon', revenue: 12500, orders: 45, alt: 'Monday revenue data point showing $12,500' },
      { name: 'Tue', revenue: 15200, orders: 52, alt: 'Tuesday revenue data point showing $15,200' },
      { name: 'Wed', revenue: 18900, orders: 68, alt: 'Wednesday revenue data point showing $18,900' },
      { name: 'Thu', revenue: 22100, orders: 71, alt: 'Thursday revenue data point showing $22,100' },
      { name: 'Fri', revenue: 25800, orders: 89, alt: 'Friday revenue data point showing $25,800' },
      { name: 'Sat', revenue: 19400, orders: 63, alt: 'Saturday revenue data point showing $19,400' },
      { name: 'Sun', revenue: 16700, orders: 48, alt: 'Sunday revenue data point showing $16,700' }
    ],
    '30d': [
      { name: 'Week 1', revenue: 85000, orders: 320, alt: 'Week 1 revenue data showing $85,000' },
      { name: 'Week 2', revenue: 92000, orders: 385, alt: 'Week 2 revenue data showing $92,000' },
      { name: 'Week 3', revenue: 78000, orders: 295, alt: 'Week 3 revenue data showing $78,000' },
      { name: 'Week 4', revenue: 105000, orders: 425, alt: 'Week 4 revenue data showing $105,000' }
    ],
    '90d': [
      { name: 'Jan', revenue: 320000, orders: 1250, alt: 'January revenue data showing $320,000' },
      { name: 'Feb', revenue: 285000, orders: 1100, alt: 'February revenue data showing $285,000' },
      { name: 'Mar', revenue: 410000, orders: 1580, alt: 'March revenue data showing $410,000' }
    ]
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [timeframe]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card p-3 shadow-floating border border-border/50">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">Revenue:</span>
              <span className="text-sm font-semibold text-foreground">
                ${payload?.[0]?.value?.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-sm text-muted-foreground">Orders:</span>
              <span className="text-sm font-semibold text-foreground">
                {payload?.[1]?.value || 0}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const timeframeOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Overview</h3>
          <p className="text-sm text-muted-foreground">Track your revenue performance over time</p>
        </div>
        
        <div className="flex items-center space-x-2">
          {timeframeOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setTimeframe(option?.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                timeframe === option?.value
                  ? 'bg-primary text-primary-foreground shadow-elevated'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex items-center space-x-3">
              <Icon name="Loader2" size={24} className="animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Loading chart data...</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData?.[timeframe]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2, fill: 'white' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">+12.5%</span>
            <span className="text-sm text-muted-foreground">vs last period</span>
          </div>
        </div>
        
        <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
          <span>View Details</span>
          <Icon name="ArrowRight" size={14} />
        </button>
      </div>
    </motion.div>
  );
};

export default RevenueChart;