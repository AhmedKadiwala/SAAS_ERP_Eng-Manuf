import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityTimeline = ({ activities, isLoading }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'login': 'LogIn',
      'logout': 'LogOut',
      'role_change': 'UserCog',
      'password_change': 'Key',
      'profile_update': 'User',
      'feature_access': 'MousePointer',
      'data_export': 'Download',
      'settings_change': 'Settings'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      'login': 'text-success bg-success/10',
      'logout': 'text-muted-foreground bg-muted/10',
      'role_change': 'text-warning bg-warning/10',
      'password_change': 'text-primary bg-primary/10',
      'profile_update': 'text-accent bg-accent/10',
      'feature_access': 'text-foreground bg-muted/10',
      'data_export': 'text-secondary bg-secondary/10',
      'settings_change': 'text-error bg-error/10'
    };
    return colors?.[type] || 'text-muted-foreground bg-muted/10';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)]?.map((_, index) => (
          <div key={index} className="flex items-start space-x-4 animate-pulse">
            <div className="w-10 h-10 bg-muted/50 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted/50 rounded w-3/4" />
              <div className="h-3 bg-muted/30 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities?.map((activity, index) => (
        <div key={activity?.id} className="flex items-start space-x-4 group">
          {/* Timeline Line */}
          {index < activities?.length - 1 && (
            <div className="absolute left-5 mt-10 w-px h-8 bg-border" />
          )}
          
          {/* Activity Icon */}
          <div className={`
            relative w-10 h-10 rounded-full flex items-center justify-center border-2 border-card
            ${getActivityColor(activity?.type)}
          `}>
            <Icon name={getActivityIcon(activity?.type)} size={16} />
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={activity?.user?.avatar}
                      alt={activity?.user?.avatarAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-sm text-foreground">
                    {activity?.user?.name}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-1">
                  {activity?.description}
                </p>
                
                {activity?.details && (
                  <div className="bg-muted/30 rounded-lg p-3 mt-2">
                    <p className="text-xs text-muted-foreground">{activity?.details}</p>
                  </div>
                )}
              </div>
              
              <div className="text-right ml-4">
                <p className="text-xs text-muted-foreground">
                  {formatTimeAgo(activity?.timestamp)}
                </p>
                {activity?.ipAddress && (
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {activity?.ipAddress}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {activities?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Activity" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;