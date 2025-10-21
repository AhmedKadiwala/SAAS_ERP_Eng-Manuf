import React, { useState } from 'react';
import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const ConversionFunnel = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const funnelData = [
    { name: 'Website Visitors', value: 12500, color: '#667eea', percentage: 100 },
    { name: 'Leads Generated', value: 3750, color: '#764ba2', percentage: 30 },
    { name: 'Qualified Leads', value: 1875, color: '#f093fb', percentage: 15 },
    { name: 'Proposals Sent', value: 750, color: '#f5576c', percentage: 6 },
    { name: 'Deals Closed', value: 225, color: '#4facfe', percentage: 1.8 }
  ];

  const previousData = [
    { name: 'Website Visitors', value: 11200, color: '#667eea', percentage: 100 },
    { name: 'Leads Generated', value: 3136, color: '#764ba2', percentage: 28 },
    { name: 'Qualified Leads', value: 1568, color: '#f093fb', percentage: 14 },
    { name: 'Proposals Sent', value: 672, color: '#f5576c', percentage: 6 },
    { name: 'Deals Closed', value: 168, color: '#4facfe', percentage: 1.5 }
  ];

  const currentData = selectedPeriod === 'current' ? funnelData : previousData;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="glass-card p-4 border border-border/50 shadow-floating">
          <p className="font-semibold text-foreground mb-2">{data?.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Count:</span>
              <span className="text-sm font-medium text-foreground">{data?.value?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Conversion:</span>
              <span className="text-sm font-medium text-foreground">{data?.percentage}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const calculateConversionRate = (current, previous) => {
    if (previous === 0) return 0;
    return ((current / previous) * 100)?.toFixed(1);
  };

  const getChangeIcon = (current, previous) => {
    if (current > previous) return <Icon name="TrendingUp" size={14} className="text-success" />;
    if (current < previous) return <Icon name="TrendingDown" size={14} className="text-error" />;
    return <Icon name="Minus" size={14} className="text-muted-foreground" />;
  };

  const getChangeColor = (current, previous) => {
    if (current > previous) return 'text-success';
    if (current < previous) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Conversion Funnel</h3>
          <p className="text-sm text-muted-foreground">Sales pipeline conversion rates</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e?.target?.value)}
            className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="current">This Month</option>
            <option value="previous">Last Month</option>
          </select>
          
          <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150">
            <Icon name="Download" size={16} />
          </button>
        </div>
      </div>
      {/* Funnel Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip content={<CustomTooltip />} />
            <Funnel
              dataKey="value"
              data={currentData}
              isAnimationActive={true}
              animationDuration={800}
            >
              {currentData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry?.color} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </div>
      {/* Detailed Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">Stage Breakdown</h4>
        <div className="space-y-2">
          {currentData?.map((stage, index) => {
            const previousStage = selectedPeriod === 'current' ? previousData?.[index] : funnelData?.[index];
            const conversionRate = index > 0 ? calculateConversionRate(stage?.value, currentData?.[index - 1]?.value) : 100;
            
            return (
              <div key={stage?.name} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors duration-150">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: stage?.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{stage?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {stage?.value?.toLocaleString()} ({stage?.percentage}% of total)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-foreground">{conversionRate}%</span>
                    {getChangeIcon(stage?.value, previousStage?.value)}
                  </div>
                  <p className={`text-xs ${getChangeColor(stage?.value, previousStage?.value)}`}>
                    {stage?.value > previousStage?.value ? '+' : ''}
                    {((stage?.value - previousStage?.value) / previousStage?.value * 100)?.toFixed(1)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Zap" size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">Overall Conversion</span>
          </div>
          <p className="text-lg font-semibold text-primary">1.8%</p>
          <p className="text-xs text-success">+0.3% vs last month</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Clock" size={16} className="text-accent" />
            <span className="text-xs text-muted-foreground">Avg. Cycle Time</span>
          </div>
          <p className="text-lg font-semibold text-accent">28 days</p>
          <p className="text-xs text-error">+2 days vs last month</p>
        </div>
      </div>
    </div>
  );
};

export default ConversionFunnel;