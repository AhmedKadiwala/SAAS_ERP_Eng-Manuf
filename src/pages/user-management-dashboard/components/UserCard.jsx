import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserCard = ({ user, onRoleChange, onStatusChange, onViewProfile }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleToggle = async (newRole) => {
    setIsUpdating(true);
    await onRoleChange(user?.id, newRole);
    setIsUpdating(false);
  };

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    await onStatusChange(user?.id, !user?.isActive);
    setIsUpdating(false);
  };

  const getRoleColor = (role) => {
    const colors = {
      'admin': 'bg-error/10 text-error border-error/20',
      'manager': 'bg-warning/10 text-warning border-warning/20',
      'sales': 'bg-primary/10 text-primary border-primary/20',
      'support': 'bg-success/10 text-success border-success/20',
      'viewer': 'bg-muted/50 text-muted-foreground border-border'
    };
    return colors?.[role] || colors?.viewer;
  };

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-success/10 text-success border-success/20' :'bg-muted/50 text-muted-foreground border-border';
  };

  return (
    <div className="glass-card p-6 hover-lift transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-primary">
              <Image
                src={user?.avatar}
                alt={user?.avatarAlt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`
              absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card
              ${user?.isActive ? 'bg-success' : 'bg-muted-foreground'}
            `} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
              {user?.name}
            </h3>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewProfile(user)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        >
          <Icon name="MoreVertical" size={16} />
        </Button>
      </div>
      {/* Role and Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium border
            ${getRoleColor(user?.role)}
          `}>
            {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)}
          </span>
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium border
            ${getStatusColor(user?.isActive)}
          `}>
            {user?.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        {user?.twoFactorEnabled && (
          <div className="flex items-center space-x-1 text-success">
            <Icon name="Shield" size={14} />
            <span className="text-xs font-medium">2FA</span>
          </div>
        )}
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">{user?.loginCount}</p>
          <p className="text-xs text-muted-foreground">Logins</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">{user?.lastActive}</p>
          <p className="text-xs text-muted-foreground">Last Active</p>
        </div>
      </div>
      {/* Department and Join Date */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Building" size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">{user?.department}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Calendar" size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground">Joined {user?.joinDate}</span>
        </div>
      </div>
      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewProfile(user)}
          className="flex-1"
          iconName="User"
          iconPosition="left"
        >
          Profile
        </Button>
        <Button
          variant={user?.isActive ? "destructive" : "success"}
          size="sm"
          onClick={handleStatusToggle}
          loading={isUpdating}
          className="flex-1"
          iconName={user?.isActive ? "UserX" : "UserCheck"}
          iconPosition="left"
        >
          {user?.isActive ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </div>
  );
};

export default UserCard;