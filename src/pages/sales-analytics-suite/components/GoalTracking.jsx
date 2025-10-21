import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const GoalTracking = () => {
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 2024');

  const goals = [
    {
      id: 1,
      title: 'Quarterly Revenue',
      target: 500000,
      current: 387500,
      unit: '$',
      icon: 'DollarSign',
      color: 'primary',
      deadline: '2024-12-31',
      category: 'Revenue'
    },
    {
      id: 2,
      title: 'New Customers',
      target: 150,
      current: 127,
      unit: '',
      icon: 'Users',
      color: 'secondary',
      deadline: '2024-12-31',
      category: 'Growth'
    },
    {
      id: 3,
      title: 'Deal Conversion Rate',
      target: 25,
      current: 22.5,
      unit: '%',
      icon: 'TrendingUp',
      color: 'success',
      deadline: '2024-12-31',
      category: 'Performance'
    },
    {
      id: 4,
      title: 'Average Deal Size',
      target: 15000,
      current: 13750,
      unit: '$',
      icon: 'Target',
      color: 'accent',
      deadline: '2024-12-31',
      category: 'Revenue'
    },
    {
      id: 5,
      title: 'Sales Calls Made',
      target: 2000,
      current: 1650,
      unit: '',
      icon: 'Phone',
      color: 'warning',
      deadline: '2024-12-31',
      category: 'Activity'
    },
    {
      id: 6,
      title: 'Customer Retention',
      target: 95,
      current: 92.5,
      unit: '%',
      icon: 'Heart',
      color: 'error',
      deadline: '2024-12-31',
      category: 'Retention'
    }
  ];

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 70) return 'warning';
    return 'error';
  };

  const getStatusIcon = (percentage) => {
    if (percentage >= 100) return 'CheckCircle';
    if (percentage >= 90) return 'Clock';
    if (percentage >= 70) return 'AlertTriangle';
    return 'AlertCircle';
  };

  const getStatusColor = (percentage) => {
    if (percentage >= 100) return 'text-success';
    if (percentage >= 90) return 'text-primary';
    if (percentage >= 70) return 'text-warning';
    return 'text-error';
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const CircularProgress = ({ percentage, size = 80, strokeWidth = 8, color = 'primary' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    const colorMap = {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      accent: 'var(--color-accent)'
    };

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="var(--color-muted)"
            strokeWidth={strokeWidth}
            fill="transparent"
            opacity={0.2}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorMap?.[color]}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  const formatValue = (value, unit) => {
    if (unit === '$') {
      return `$${value?.toLocaleString()}`;
    }
    if (unit === '%') {
      return `${value}%`;
    }
    return value?.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Goal Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor progress towards quarterly objectives</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e?.target?.value)}
              className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Q4 2024">Q4 2024</option>
              <option value="Q3 2024">Q3 2024</option>
              <option value="Q2 2024">Q2 2024</option>
              <option value="Q1 2024">Q1 2024</option>
            </select>
            
            <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150">
              <Icon name="RefreshCw" size={16} />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="Target" size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">Total Goals</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{goals?.length}</p>
          </div>
          
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span className="text-xs text-muted-foreground">Completed</span>
            </div>
            <p className="text-2xl font-bold text-success">
              {goals?.filter(goal => getProgressPercentage(goal?.current, goal?.target) >= 100)?.length}
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="Clock" size={16} className="text-warning" />
              <span className="text-xs text-muted-foreground">In Progress</span>
            </div>
            <p className="text-2xl font-bold text-warning">
              {goals?.filter(goal => {
                const progress = getProgressPercentage(goal?.current, goal?.target);
                return progress >= 70 && progress < 100;
              })?.length}
            </p>
          </div>
          
          <div className="text-center p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-error" />
              <span className="text-xs text-muted-foreground">At Risk</span>
            </div>
            <p className="text-2xl font-bold text-error">
              {goals?.filter(goal => getProgressPercentage(goal?.current, goal?.target) < 70)?.length}
            </p>
          </div>
        </div>
      </div>
      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals?.map((goal) => {
          const percentage = getProgressPercentage(goal?.current, goal?.target);
          const daysRemaining = getDaysRemaining(goal?.deadline);
          
          return (
            <div key={goal?.id} className="glass-card p-6 space-y-4 hover-lift">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${goal?.color}/10 rounded-lg flex items-center justify-center`}>
                    <Icon name={goal?.icon} size={20} className={`text-${goal?.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{goal?.title}</h4>
                    <p className="text-xs text-muted-foreground">{goal?.category}</p>
                  </div>
                </div>
                
                <Icon 
                  name={getStatusIcon(percentage)} 
                  size={16} 
                  className={getStatusColor(percentage)}
                />
              </div>
              {/* Progress Circle */}
              <div className="flex items-center justify-center">
                <CircularProgress 
                  percentage={percentage} 
                  color={getProgressColor(percentage)}
                  size={100}
                />
              </div>
              {/* Values */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current:</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatValue(goal?.current, goal?.unit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Target:</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatValue(goal?.target, goal?.unit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Remaining:</span>
                  <span className="text-sm font-semibold text-foreground">
                    {formatValue(goal?.target - goal?.current, goal?.unit)}
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ease-out bg-${getProgressColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">
                    {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                  </span>
                  <span className={`font-medium ${getStatusColor(percentage)}`}>
                    {percentage >= 100 ? 'Completed' : `${Math.round(percentage)}%`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalTracking;