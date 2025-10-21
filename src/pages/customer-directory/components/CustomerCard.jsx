import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CustomerCard = ({ customer, isSelected, onSelect, onEdit, onCall, onEmail, onViewTimeline }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getRelationshipColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getRelationshipBg = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-success text-success-foreground',
      'inactive': 'bg-muted text-muted-foreground',
      'prospect': 'bg-primary text-primary-foreground',
      'churned': 'bg-error text-error-foreground'
    };
    return colors?.[status] || 'bg-muted text-muted-foreground';
  };

  const formatLastInteraction = (date) => {
    const now = new Date();
    const interactionDate = new Date(date);
    const diffTime = Math.abs(now - interactionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <div 
      className={`
        glass-card p-6 hover-lift cursor-pointer transition-all duration-300 group
        ${isSelected ? 'ring-2 ring-primary/50 bg-primary/5' : ''}
        ${isHovered ? 'shadow-glass' : 'shadow-elevated'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(customer?.id, e?.target?.checked)}
            className="w-4 h-4 text-primary bg-transparent border-2 border-border rounded focus:ring-primary/50 focus:ring-2"
          />
        </div>
        
        {/* Status Badge */}
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(customer?.status)}`}>
          {customer?.status}
        </span>
      </div>
      {/* Customer Info */}
      <div className="flex items-start space-x-4 mb-4">
        {/* Avatar with Gradient */}
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-gradient-primary p-0.5">
            <div className="w-full h-full rounded-xl overflow-hidden bg-card">
              {customer?.avatar ? (
                <Image
                  src={customer?.avatar}
                  alt={customer?.avatarAlt}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {customer?.company?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Online Status Indicator */}
          {customer?.isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card animate-pulse" />
          )}
        </div>

        {/* Company & Contact Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground mb-1 truncate group-hover:text-primary transition-colors duration-150">
            {customer?.company}
          </h3>
          <p className="text-sm text-muted-foreground mb-1 truncate">
            {customer?.contactPerson}
          </p>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Icon name="Mail" size={12} />
            <span className="truncate">{customer?.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            <Icon name="Phone" size={12} />
            <span>{customer?.phone}</span>
          </div>
        </div>
      </div>
      {/* Tags */}
      {customer?.tags && customer?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {customer?.tags?.slice(0, 3)?.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full"
            >
              {tag}
            </span>
          ))}
          {customer?.tags?.length > 3 && (
            <span className="px-2 py-1 text-xs font-medium bg-muted/50 text-muted-foreground rounded-full">
              +{customer?.tags?.length - 3}
            </span>
          )}
        </div>
      )}
      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Relationship Score */}
        <div className="text-center">
          <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg ${getRelationshipBg(customer?.relationshipScore)}`}>
            <Icon name="Heart" size={14} className={getRelationshipColor(customer?.relationshipScore)} />
            <span className={`text-sm font-semibold ${getRelationshipColor(customer?.relationshipScore)}`}>
              {customer?.relationshipScore}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Relationship</p>
        </div>

        {/* Total Value */}
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">{customer?.totalValue}</p>
          <p className="text-xs text-muted-foreground">Total Value</p>
        </div>
      </div>
      {/* Last Interaction */}
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <div className="flex items-center space-x-1">
          <Icon name="Clock" size={12} />
          <span>Last contact: {formatLastInteraction(customer?.lastInteraction)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="MapPin" size={12} />
          <span>{customer?.location}</span>
        </div>
      </div>
      {/* Quick Actions - Show on Hover */}
      <div className={`
        flex items-center justify-between transition-all duration-300
        ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Edit"
            onClick={(e) => {
              e?.stopPropagation();
              onEdit(customer);
            }}
            className="h-8 w-8 p-0"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Phone"
            onClick={(e) => {
              e?.stopPropagation();
              onCall(customer);
            }}
            className="h-8 w-8 p-0"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Mail"
            onClick={(e) => {
              e?.stopPropagation();
              onEmail(customer);
            }}
            className="h-8 w-8 p-0"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          iconName="Eye"
          onClick={(e) => {
            e?.stopPropagation();
            onViewTimeline(customer);
          }}
        >
          Timeline
        </Button>
      </div>
    </div>
  );
};

export default CustomerCard;