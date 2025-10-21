import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LeadCard = ({ lead, index, onClick, onQuickAction }) => {
  const getPriorityColor = (priority) => {
    const colors = {
      'High': 'text-red-500 bg-red-50',
      'Medium': 'text-yellow-500 bg-yellow-50',
      'Low': 'text-green-500 bg-green-50'
    };
    return colors?.[priority] || 'text-gray-500 bg-gray-50';
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'bg-green-500';
    if (probability >= 60) return 'bg-yellow-500';
    if (probability >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - new Date(date)) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Draggable draggableId={lead?.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided?.innerRef}
          {...provided?.draggableProps}
          {...provided?.dragHandleProps}
          className={`
            glass-card p-4 cursor-pointer hover-lift transition-all duration-150
            ${snapshot?.isDragging ? 'rotate-3 shadow-glass scale-105' : ''}
          `}
          onClick={onClick}
        >
          {/* Lead Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Image
                src={lead?.avatar}
                alt={lead?.avatarAlt}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-elevated"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-foreground truncate">{lead?.name}</h4>
                <p className="text-xs text-muted-foreground truncate">{lead?.company}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(lead?.priority)}`}>
              {lead?.priority}
            </span>
          </div>

          {/* Deal Value & Probability */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-foreground">${lead?.dealValue?.toLocaleString()}</span>
              <span className="text-sm font-medium text-muted-foreground">{lead?.probability}%</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProbabilityColor(lead?.probability)}`}
                style={{ width: `${lead?.probability}%` }}
              />
            </div>
          </div>

          {/* Lead Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Mail" size={12} />
              <span className="truncate">{lead?.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Phone" size={12} />
              <span>{lead?.phone}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="MapPin" size={12} />
              <span className="truncate">{lead?.location}</span>
            </div>
          </div>

          {/* Last Activity */}
          <div className="flex items-center space-x-2 mb-3 p-2 bg-muted/20 rounded-lg">
            <Icon name="Clock" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground flex-1 truncate">
              {lead?.lastActivity}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatTimeAgo(lead?.lastActivityDate)}
            </span>
          </div>

          {/* Tags */}
          {lead?.tags && lead?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {lead?.tags?.slice(0, 2)?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
              {lead?.tags?.length > 2 && (
                <span className="px-2 py-1 bg-muted/30 text-muted-foreground text-xs rounded-full">
                  +{lead?.tags?.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-border/30">
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  onQuickAction('call', lead);
                }}
                className="p-2 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors duration-150 ripple"
                title="Call"
              >
                <Icon name="Phone" size={14} />
              </button>
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  onQuickAction('email', lead);
                }}
                className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-150 ripple"
                title="Email"
              >
                <Icon name="Mail" size={14} />
              </button>
              <button
                onClick={(e) => {
                  e?.stopPropagation();
                  onQuickAction('schedule', lead);
                }}
                className="p-2 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors duration-150 ripple"
                title="Schedule Meeting"
              >
                <Icon name="Calendar" size={14} />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Score:</span>
              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={12}
                    className={i < lead?.score ? 'text-yellow-400 fill-current' : 'text-muted-foreground'}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default LeadCard;