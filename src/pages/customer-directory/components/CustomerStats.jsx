import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Customers',
      value: stats?.totalCustomers,
      change: stats?.customerGrowth,
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Active Customers',
      value: stats?.activeCustomers,
      change: stats?.activeGrowth,
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'New This Month',
      value: stats?.newThisMonth,
      change: stats?.newGrowth,
      icon: 'UserPlus',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Avg. Relationship Score',
      value: `${stats?.avgRelationshipScore}%`,
      change: stats?.relationshipChange,
      icon: 'Heart',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const formatChange = (change) => {
    const isPositive = change > 0;
    return (
      <div className={`flex items-center space-x-1 ${isPositive ? 'text-success' : 'text-error'}`}>
        <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={12} />
        <span className="text-xs font-medium">
          {isPositive ? '+' : ''}{change}%
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards?.map((stat, index) => (
        <div
          key={stat?.title}
          className="glass-card p-6 hover-lift transition-all duration-300 group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 ${stat?.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-150`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
            {formatChange(stat?.change)}
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-150">
              {stat?.value?.toLocaleString()}
            </h3>
            <p className="text-sm text-muted-foreground">
              {stat?.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerStats;