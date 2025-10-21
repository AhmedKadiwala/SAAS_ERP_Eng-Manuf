import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const SalesForecasting = () => {
  const [forecastPeriod, setForecastPeriod] = useState('6months');
  const [confidenceLevel, setConfidenceLevel] = useState('80');

  const historicalData = [
    { month: 'May 2024', actual: 52000, pipeline: 48000, forecast: null, upper: null, lower: null },
    { month: 'Jun 2024', actual: 48000, pipeline: 52000, forecast: null, upper: null, lower: null },
    { month: 'Jul 2024', actual: 61000, pipeline: 58000, forecast: null, upper: null, lower: null },
    { month: 'Aug 2024', actual: 58000, pipeline: 61000, forecast: null, upper: null, lower: null },
    { month: 'Sep 2024', actual: 67000, pipeline: 65000, forecast: null, upper: null, lower: null },
    { month: 'Oct 2024', actual: 72000, pipeline: 70000, forecast: null, upper: null, lower: null }
  ];

  const forecastData = [
    { month: 'Nov 2024', actual: null, pipeline: 75000, forecast: 78000, upper: 85000, lower: 71000 },
    { month: 'Dec 2024', actual: null, pipeline: 82000, forecast: 85000, upper: 93000, lower: 77000 },
    { month: 'Jan 2025', actual: null, pipeline: 78000, forecast: 82000, upper: 90000, lower: 74000 },
    { month: 'Feb 2025', actual: null, pipeline: 85000, forecast: 88000, upper: 96000, lower: 80000 },
    { month: 'Mar 2025', actual: null, pipeline: 90000, forecast: 92000, upper: 101000, lower: 83000 },
    { month: 'Apr 2025', actual: null, pipeline: 88000, forecast: 95000, upper: 104000, lower: 86000 }
  ];

  const combinedData = [...historicalData, ...forecastData];

  const pipelineMetrics = [
    {
      stage: 'Qualified Leads',
      current: 245,
      projected: 285,
      conversionRate: 24.5,
      value: 1225000,
      icon: 'Users',
      color: 'primary'
    },
    {
      stage: 'Proposals Sent',
      current: 68,
      projected: 78,
      conversionRate: 45.2,
      value: 850000,
      icon: 'FileText',
      color: 'secondary'
    },
    {
      stage: 'Negotiations',
      current: 32,
      projected: 38,
      conversionRate: 72.8,
      value: 640000,
      icon: 'Handshake',
      color: 'accent'
    },
    {
      stage: 'Closing',
      current: 18,
      projected: 22,
      conversionRate: 85.4,
      value: 450000,
      icon: 'Target',
      color: 'success'
    }
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

  const calculateAccuracy = () => {
    // Mock accuracy calculation based on historical data
    return 87.3;
  };

  const getConfidenceColor = (level) => {
    if (level >= 85) return 'text-success';
    if (level >= 70) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Sales Forecasting</h3>
            <p className="text-sm text-muted-foreground">Predictive analytics and pipeline projections</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={forecastPeriod}
              onChange={(e) => setForecastPeriod(e?.target?.value)}
              className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="3months">3 Months</option>
              <option value="6months">6 Months</option>
              <option value="12months">12 Months</option>
            </select>
            
            <select
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(e?.target?.value)}
              className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="70">70% Confidence</option>
              <option value="80">80% Confidence</option>
              <option value="90">90% Confidence</option>
            </select>
            
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>

        {/* Forecast Accuracy */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">Forecast Accuracy</span>
            </div>
            <p className={`text-2xl font-bold ${getConfidenceColor(calculateAccuracy())}`}>
              {calculateAccuracy()}%
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-xs text-muted-foreground">Projected Growth</span>
            </div>
            <p className="text-2xl font-bold text-success">+18.5%</p>
          </div>
          
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="DollarSign" size={16} className="text-accent" />
              <span className="text-xs text-muted-foreground">Pipeline Value</span>
            </div>
            <p className="text-2xl font-bold text-accent">$3.2M</p>
          </div>
          
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="Calendar" size={16} className="text-warning" />
              <span className="text-xs text-muted-foreground">Avg Deal Cycle</span>
            </div>
            <p className="text-2xl font-bold text-warning">32 days</p>
          </div>
        </div>
      </div>
      {/* Forecast Chart */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-foreground">Revenue Forecast</h4>
            <p className="text-sm text-muted-foreground">Historical performance vs projected revenue</p>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-muted-foreground">Forecast</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success/30 rounded-full" />
              <span className="text-muted-foreground">Confidence Range</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.05}/>
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
              
              {/* Confidence Interval */}
              <Line
                type="monotone"
                dataKey="upper"
                stroke="var(--color-success)"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
                connectNulls={false}
                name="Upper Bound"
              />
              <Line
                type="monotone"
                dataKey="lower"
                stroke="var(--color-success)"
                strokeWidth={1}
                strokeDasharray="2 2"
                dot={false}
                connectNulls={false}
                name="Lower Bound"
              />
              
              {/* Actual Revenue */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="var(--color-primary)"
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Actual"
              />
              
              {/* Forecast */}
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="var(--color-accent)"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 4 }}
                connectNulls={false}
                name="Forecast"
              />
              
              {/* Current Month Separator */}
              <ReferenceLine x="Oct 2024" stroke="var(--color-border)" strokeDasharray="3 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Pipeline Breakdown */}
      <div className="glass-card p-6 space-y-6">
        <div>
          <h4 className="text-lg font-semibold text-foreground mb-2">Pipeline Analysis</h4>
          <p className="text-sm text-muted-foreground">Current pipeline stages and projections</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineMetrics?.map((metric, index) => (
            <div key={index} className="p-4 bg-muted/20 rounded-lg space-y-3 hover-lift">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 bg-${metric?.color}/10 rounded-lg flex items-center justify-center`}>
                  <Icon name={metric?.icon} size={20} className={`text-${metric?.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  <p className={`text-sm font-semibold text-${metric?.color}`}>
                    {metric?.conversionRate}%
                  </p>
                </div>
              </div>
              
              <div>
                <h5 className="font-medium text-foreground mb-1">{metric?.stage}</h5>
                <p className="text-xs text-muted-foreground">
                  Pipeline Value: ${metric?.value?.toLocaleString()}
                </p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted-foreground">Current</p>
                  <p className="font-semibold text-foreground">{metric?.current}</p>
                </div>
                <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Projected</p>
                  <p className="font-semibold text-success">{metric?.projected}</p>
                </div>
              </div>
              
              <div className="w-full bg-muted/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-${metric?.color} transition-all duration-500`}
                  style={{ width: `${(metric?.current / metric?.projected) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesForecasting;