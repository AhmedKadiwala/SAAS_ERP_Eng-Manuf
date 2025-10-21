import React from 'react';
import Icon from '../../../components/AppIcon';

const PipelineMetrics = ({ metrics }) => {
  const metricCards = [
    {
      title: 'Total Pipeline Value',
      value: `$${metrics?.totalValue?.toLocaleString()}`,
      change: metrics?.valueChange,
      icon: 'DollarSign',
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Conversion Rate',
      value: `${metrics?.conversionRate}%`,
      change: metrics?.conversionChange,
      icon: 'TrendingUp',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Average Deal Size',
      value: `$${metrics?.avgDealSize?.toLocaleString()}`,
      change: metrics?.dealSizeChange,
      icon: 'Target',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      title: 'Sales Velocity',
      value: `${metrics?.salesVelocity} days`,
      change: metrics?.velocityChange,
      icon: 'Zap',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  const getChangeColor = (change) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'ArrowUp';
    if (change < 0) return 'ArrowDown';
    return 'Minus';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {metricCards?.map((metric, index) => (
        <div
          key={index}
          className="glass-card p-6 hover-lift transition-all duration-150"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${metric?.color} flex items-center justify-center`}>
              <Icon name={metric?.icon} size={24} />
            </div>
            <div className={`flex items-center space-x-1 ${getChangeColor(metric?.change)}`}>
              <Icon name={getChangeIcon(metric?.change)} size={16} />
              <span className="text-sm font-medium">
                {Math.abs(metric?.change)}%
              </span>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1">{metric?.value}</h3>
            <p className="text-sm text-muted-foreground">{metric?.title}</p>
          </div>

          {/* Mini Chart Placeholder */}
          <div className="mt-4 h-8 bg-muted/20 rounded-lg flex items-end justify-between px-1">
            {[...Array(7)]?.map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary/30 rounded-full"
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PipelineMetrics;