import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityTimeline = ({ activities, isVisible, onClose }) => {
  const [filter, setFilter] = useState('all');

  const getActivityIcon = (type) => {
    const icons = {
      'call': 'Phone',
      'email': 'Mail',
      'meeting': 'Calendar',
      'note': 'FileText',
      'task': 'CheckSquare',
      'stage_change': 'ArrowRight'
    };
    return icons?.[type] || 'Circle';
  };

  const getActivityColor = (type) => {
    const colors = {
      'call': 'text-green-600 bg-green-50',
      'email': 'text-blue-600 bg-blue-50',
      'meeting': 'text-purple-600 bg-purple-50',
      'note': 'text-yellow-600 bg-yellow-50',
      'task': 'text-orange-600 bg-orange-50',
      'stage_change': 'text-primary bg-primary/10'
    };
    return colors?.[type] || 'text-muted-foreground bg-muted/50';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities?.filter(activity => activity?.type === filter);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-card/95 backdrop-blur-glass border-l border-border shadow-glass z-300 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Activity Timeline</h2>
          <p className="text-sm text-muted-foreground">Recent lead interactions</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150"
        >
          <Icon name="X" size={20} />
        </button>
      </div>
      {/* Filter Tabs */}
      <div className="p-6 border-b border-border/50">
        <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', icon: 'List' },
            { key: 'call', label: 'Calls', icon: 'Phone' },
            { key: 'email', label: 'Emails', icon: 'Mail' },
            { key: 'meeting', label: 'Meetings', icon: 'Calendar' }
          ]?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setFilter(tab?.key)}
              className={`
                flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150
                ${filter === tab?.key 
                  ? 'bg-background text-foreground shadow-elevated' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {filteredActivities?.map((activity, index) => (
            <div key={activity?.id} className="relative">
              {/* Timeline Line */}
              {index !== filteredActivities?.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-6 bg-border/50" />
              )}
              
              <div className="flex space-x-4">
                {/* Activity Icon */}
                <div className={`w-12 h-12 rounded-full ${getActivityColor(activity?.type)} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={getActivityIcon(activity?.type)} size={20} />
                </div>

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-sm text-foreground">{activity?.title}</h4>
                      {activity?.user && (
                        <Image
                          src={activity?.user?.avatar}
                          alt={activity?.user?.avatarAlt}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity?.timestamp)}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{activity?.description}</p>

                  {/* Activity Details */}
                  {activity?.details && (
                    <div className="bg-muted/20 rounded-lg p-3 mb-2">
                      <p className="text-xs text-muted-foreground">{activity?.details}</p>
                    </div>
                  )}

                  {/* Activity Meta */}
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    {activity?.lead && (
                      <span className="flex items-center space-x-1">
                        <Icon name="User" size={12} />
                        <span>{activity?.lead}</span>
                      </span>
                    )}
                    {activity?.duration && (
                      <span className="flex items-center space-x-1">
                        <Icon name="Clock" size={12} />
                        <span>{activity?.duration}</span>
                      </span>
                    )}
                    {activity?.outcome && (
                      <span className={`px-2 py-1 rounded-full ${
                        activity?.outcome === 'positive' ? 'bg-green-50 text-green-600' :
                        activity?.outcome === 'negative'? 'bg-red-50 text-red-600' : 'bg-yellow-50 text-yellow-600'
                      }`}>
                        {activity?.outcome}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredActivities?.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Activity" size={24} className="text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No activities found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;