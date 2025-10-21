import React from 'react';
import Icon from '../../../components/AppIcon';

const UsageMetrics = ({ usageData }) => {
  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, color = "primary" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
      if (percentage >= 90) return "text-error";
      if (percentage >= 75) return "text-warning";
      return "text-success";
    };

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-muted/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={`${getColor()} transition-all duration-500 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">{percentage}%</p>
            <p className="text-xs text-muted-foreground">Used</p>
          </div>
        </div>
      </div>
    );
  };

  const MetricCard = ({ metric }) => (
    <div className="glass-card p-6 hover-lift">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name={metric?.icon} size={20} className="text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{metric?.name}</h4>
            <p className="text-sm text-muted-foreground">{metric?.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <CircularProgress percentage={metric?.percentage} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Used</span>
          <span className="font-medium">{metric?.used?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Limit</span>
          <span className="font-medium">{metric?.limit?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-medium text-success">{(metric?.limit - metric?.used)?.toLocaleString()}</span>
        </div>
      </div>

      {metric?.percentage >= 80 && (
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <p className="text-sm text-warning font-medium">
              {metric?.percentage >= 90 ? 'Limit almost reached' : 'Approaching limit'}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Usage Metrics</h2>
        <button className="text-sm text-primary hover:text-primary/80 font-medium">
          View Details
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usageData?.map((metric) => (
          <MetricCard key={metric?.id} metric={metric} />
        ))}
      </div>
    </div>
  );
};

export default UsageMetrics;