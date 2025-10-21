import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserProfileModal = ({ user, isOpen, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(user || {});

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'permissions', label: 'Permissions', icon: 'Shield' },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'security', label: 'Security', icon: 'Lock' }
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'sales', label: 'Sales Representative' },
    { value: 'support', label: 'Support Agent' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const departmentOptions = [
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Customer Support' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const permissions = [
    { id: 'dashboard', label: 'Dashboard Access', description: 'View main dashboard and analytics' },
    { id: 'customers', label: 'Customer Management', description: 'Create, edit, and delete customers' },
    { id: 'leads', label: 'Lead Management', description: 'Manage sales pipeline and leads' },
    { id: 'invoices', label: 'Invoice Management', description: 'Create and manage invoices' },
    { id: 'reports', label: 'Reports & Analytics', description: 'Access reports and analytics' },
    { id: 'inventory', label: 'Inventory Management', description: 'Manage products and inventory' },
    { id: 'users', label: 'User Management', description: 'Manage team members and permissions' },
    { id: 'settings', label: 'System Settings', description: 'Configure system settings' }
  ];

  const recentActivity = [
    { action: 'Logged in', timestamp: '2 hours ago', ip: '192.168.1.100' },
    { action: 'Updated customer profile', timestamp: '4 hours ago', ip: '192.168.1.100' },
    { action: 'Generated invoice #INV-001', timestamp: '1 day ago', ip: '192.168.1.100' },
    { action: 'Exported customer data', timestamp: '2 days ago', ip: '192.168.1.100' }
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  if (!isOpen || !user) return null;

  const ProfileTab = () => (
    <div className="space-y-6">
      {/* Avatar and Basic Info */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-primary">
            <Image
              src={user?.avatar}
              alt={user?.avatarAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className={`
            absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-card
            ${user?.isActive ? 'bg-success' : 'bg-muted-foreground'}
          `}>
            <Icon 
              name={user?.isActive ? 'Check' : 'X'} 
              size={12} 
              color="white" 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={formData?.firstName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e?.target?.value }))}
              />
              <Input
                label="Last Name"
                value={formData?.lastName || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e?.target?.value }))}
              />
            </div>
          ) : (
            <>
              <h3 className="text-xl font-semibold text-foreground">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
            </>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isEditing ? (
          <>
            <Input
              label="Email"
              type="email"
              value={formData?.email || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e?.target?.value }))}
            />
            <Input
              label="Phone"
              value={formData?.phone || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e?.target?.value }))}
            />
            <Select
              label="Role"
              options={roleOptions}
              value={formData?.role || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            />
            <Select
              label="Department"
              options={departmentOptions}
              value={formData?.department || ''}
              onChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
            />
          </>
        ) : (
          <>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <p className="text-foreground">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Role</label>
              <p className="text-foreground capitalize">{user?.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Department</label>
              <p className="text-foreground">{user?.department}</p>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold text-foreground">{user?.loginCount}</p>
          <p className="text-sm text-muted-foreground">Total Logins</p>
        </div>
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold text-foreground">{user?.lastActive}</p>
          <p className="text-sm text-muted-foreground">Last Active</p>
        </div>
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold text-foreground">{user?.joinDate}</p>
          <p className="text-sm text-muted-foreground">Member Since</p>
        </div>
      </div>
    </div>
  );

  const PermissionsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-foreground">Access Permissions</h3>
          <p className="text-sm text-muted-foreground">Manage what this user can access</p>
        </div>
        <span className={`
          px-3 py-1 rounded-full text-xs font-medium
          ${user?.role === 'admin' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'}
        `}>
          {user?.role?.charAt(0)?.toUpperCase() + user?.role?.slice(1)} Role
        </span>
      </div>

      {permissions?.map((permission) => (
        <div key={permission?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">{permission?.label}</h4>
            <p className="text-sm text-muted-foreground">{permission?.description}</p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              defaultChecked={user?.role === 'admin' || Math.random() > 0.3}
              disabled={user?.role === 'admin'}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const ActivityTab = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
      {recentActivity?.map((activity, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <p className="font-medium text-foreground">{activity?.action}</p>
            <p className="text-sm text-muted-foreground">IP: {activity?.ip}</p>
          </div>
          <span className="text-sm text-muted-foreground">{activity?.timestamp}</span>
        </div>
      ))}
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Security Settings</h3>
        
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Two-Factor Authentication</h4>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
          <div className="flex items-center space-x-2">
            {user?.twoFactorEnabled ? (
              <span className="text-success text-sm font-medium">Enabled</span>
            ) : (
              <span className="text-muted-foreground text-sm">Disabled</span>
            )}
            <Icon 
              name={user?.twoFactorEnabled ? 'Shield' : 'ShieldOff'} 
              size={16} 
              className={user?.twoFactorEnabled ? 'text-success' : 'text-muted-foreground'}
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Password Policy</h4>
            <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
          </div>
          <Button variant="outline" size="sm">
            Reset Password
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h4 className="font-medium text-foreground">Active Sessions</h4>
            <p className="text-sm text-muted-foreground">2 active sessions</p>
          </div>
          <Button variant="outline" size="sm">
            View Sessions
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-400 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div>
            <h2 className="text-xl font-semibold text-foreground">User Profile</h2>
            <p className="text-sm text-muted-foreground">{user?.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                iconName="Edit"
                iconPosition="left"
              >
                Edit
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/50">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors duration-150
                ${activeTab === tab?.id 
                  ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'permissions' && <PermissionsTab />}
          {activeTab === 'activity' && <ActivityTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border/50">
            <Button
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={isLoading}
              iconName="Save"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;