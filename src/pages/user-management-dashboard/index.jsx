import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import UserCard from './components/UserCard';
import ActivityTimeline from './components/ActivityTimeline';
import InviteUserModal from './components/InviteUserModal';
import UserProfileModal from './components/UserProfileModal';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import UserFilters from './components/UserFilters';
import UsageAnalytics from './components/UsageAnalytics';

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState([]);

  // Mock user data
  const mockUsers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@modernerp.com',
    phone: '+1 (555) 123-4567',
    role: 'admin',
    department: 'Operations',
    isActive: true,
    twoFactorEnabled: true,
    avatar: "https://images.unsplash.com/photo-1683203438694-b428d712b8da",
    avatarAlt: 'Professional woman with blonde hair in business attire smiling at camera',
    loginCount: 247,
    lastActive: '2 hours ago',
    joinDate: 'Jan 2023'
  },
  {
    id: 2,
    name: 'Michael Chen',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@modernerp.com',
    phone: '+1 (555) 234-5678',
    role: 'sales',
    department: 'Sales',
    isActive: true,
    twoFactorEnabled: false,
    avatar: "https://images.unsplash.com/photo-1621313212177-5ed735a8d521",
    avatarAlt: 'Asian man in dark suit with confident smile in office setting',
    loginCount: 189,
    lastActive: '1 day ago',
    joinDate: 'Mar 2023'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@modernerp.com',
    phone: '+1 (555) 345-6789',
    role: 'support',
    department: 'Customer Support',
    isActive: true,
    twoFactorEnabled: true,
    avatar: "https://images.unsplash.com/photo-1706565029539-d09af5896340",
    avatarAlt: 'Hispanic woman with dark hair in professional blazer with warm smile',
    loginCount: 156,
    lastActive: '3 hours ago',
    joinDate: 'Feb 2023'
  },
  {
    id: 4,
    name: 'David Thompson',
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@modernerp.com',
    phone: '+1 (555) 456-7890',
    role: 'manager',
    department: 'Sales',
    isActive: false,
    twoFactorEnabled: false,
    avatar: "https://images.unsplash.com/photo-1688012162633-91b2f48c7edb",
    avatarAlt: 'Caucasian man with beard in navy shirt looking professional',
    loginCount: 98,
    lastActive: '1 week ago',
    joinDate: 'Apr 2023'
  },
  {
    id: 5,
    name: 'Lisa Wang',
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lisa.wang@modernerp.com',
    phone: '+1 (555) 567-8901',
    role: 'sales',
    department: 'Sales',
    isActive: true,
    twoFactorEnabled: true,
    avatar: "https://images.unsplash.com/photo-1668049221564-862149a48e10",
    avatarAlt: 'Asian woman with long black hair in white blouse with professional smile',
    loginCount: 203,
    lastActive: '30 minutes ago',
    joinDate: 'Jan 2023'
  },
  {
    id: 6,
    name: 'James Wilson',
    firstName: 'James',
    lastName: 'Wilson',
    email: 'james.wilson@modernerp.com',
    phone: '+1 (555) 678-9012',
    role: 'viewer',
    department: 'Finance',
    isActive: true,
    twoFactorEnabled: false,
    avatar: "https://images.unsplash.com/photo-1600552366358-db69f6d7e625",
    avatarAlt: 'African American man in gray sweater with friendly expression',
    loginCount: 67,
    lastActive: '2 days ago',
    joinDate: 'May 2023'
  }];


  // Mock activity data
  const mockActivities = [
  {
    id: 1,
    type: 'login',
    description: 'Logged into the system',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: {
      name: 'Sarah Johnson',
      avatar: "https://images.unsplash.com/photo-1683203438694-b428d712b8da",
      avatarAlt: 'Professional woman with blonde hair in business attire smiling at camera'
    },
    ipAddress: '192.168.1.100'
  },
  {
    id: 2,
    type: 'role_change',
    description: 'Role changed from Sales Rep to Manager',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: {
      name: 'Michael Chen',
      avatar: "https://images.unsplash.com/photo-1621313212177-5ed735a8d521",
      avatarAlt: 'Asian man in dark suit with confident smile in office setting'
    },
    details: 'Role updated by Sarah Johnson (Admin)',
    ipAddress: '192.168.1.101'
  },
  {
    id: 3,
    type: 'profile_update',
    description: 'Updated profile information',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    user: {
      name: 'Emily Rodriguez',
      avatar: "https://images.unsplash.com/photo-1706565029539-d09af5896340",
      avatarAlt: 'Hispanic woman with dark hair in professional blazer with warm smile'
    },
    ipAddress: '192.168.1.102'
  },
  {
    id: 4,
    type: 'password_change',
    description: 'Changed account password',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    user: {
      name: 'Lisa Wang',
      avatar: "https://images.unsplash.com/photo-1668049221564-862149a48e10",
      avatarAlt: 'Asian woman with long black hair in white blouse with professional smile'
    },
    ipAddress: '192.168.1.103'
  },
  {
    id: 5,
    type: 'logout',
    description: 'Logged out of the system',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    user: {
      name: 'David Thompson',
      avatar: "https://images.unsplash.com/photo-1688012162633-91b2f48c7edb",
      avatarAlt: 'Caucasian man with beard in navy shirt looking professional'
    },
    ipAddress: '192.168.1.104'
  }];


  const tabs = [
  { id: 'users', label: 'Team Members', icon: 'Users', count: mockUsers?.length },
  { id: 'activity', label: 'Activity Log', icon: 'Activity', count: mockActivities?.length },
  { id: 'analytics', label: 'Usage Analytics', icon: 'BarChart3', count: null }];


  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleUserSelection = (userId, isSelected) => {
    if (isSelected) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev?.filter((id) => id !== userId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedUsers(filteredUsers?.map((user) => user?.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers((prev) => prev?.map((user) =>
    user?.id === userId ? { ...user, role: newRole } : user
    ));
    setFilteredUsers((prev) => prev?.map((user) =>
    user?.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusChange = async (userId, isActive) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers((prev) => prev?.map((user) =>
    user?.id === userId ? { ...user, isActive } : user
    ));
    setFilteredUsers((prev) => prev?.map((user) =>
    user?.id === userId ? { ...user, isActive } : user
    ));
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setIsProfileModalOpen(true);
  };

  const handleUpdateUser = async (updatedUser) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUsers((prev) => prev?.map((user) =>
    user?.id === updatedUser?.id ? { ...user, ...updatedUser } : user
    ));
    setFilteredUsers((prev) => prev?.map((user) =>
    user?.id === updatedUser?.id ? { ...user, ...updatedUser } : user
    ));
  };

  const handleInviteUser = async (userData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newUser = {
      id: Date.now(),
      name: `${userData?.firstName} ${userData?.lastName}`,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      email: userData?.email,
      role: userData?.role,
      department: userData?.department,
      isActive: true,
      twoFactorEnabled: false,
      avatar: "https://images.unsplash.com/photo-1592520112754-6d74d747ef89",
      avatarAlt: 'Default user avatar with neutral expression',
      loginCount: 0,
      lastActive: 'Never',
      joinDate: new Date()?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    setUsers((prev) => [...prev, newUser]);
    setFilteredUsers((prev) => [...prev, newUser]);
  };

  const handleBulkAction = async (action, userIds) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    switch (action) {
      case 'activate':
        setUsers((prev) => prev?.map((user) =>
        userIds?.includes(user?.id) ? { ...user, isActive: true } : user
        ));
        setFilteredUsers((prev) => prev?.map((user) =>
        userIds?.includes(user?.id) ? { ...user, isActive: true } : user
        ));
        break;
      case 'deactivate':
        setUsers((prev) => prev?.map((user) =>
        userIds?.includes(user?.id) ? { ...user, isActive: false } : user
        ));
        setFilteredUsers((prev) => prev?.map((user) =>
        userIds?.includes(user?.id) ? { ...user, isActive: false } : user
        ));
        break;
      case 'delete':
        setUsers((prev) => prev?.filter((user) => !userIds?.includes(user?.id)));
        setFilteredUsers((prev) => prev?.filter((user) => !userIds?.includes(user?.id)));
        break;
      default:
        break;
    }

    setSelectedUsers([]);
  };

  const handleFilterChange = (filters) => {
    let filtered = [...users];

    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter((user) =>
      user?.name?.toLowerCase()?.includes(searchTerm) ||
      user?.email?.toLowerCase()?.includes(searchTerm) ||
      user?.department?.toLowerCase()?.includes(searchTerm)
      );
    }

    if (filters?.role) {
      filtered = filtered?.filter((user) => user?.role === filters?.role);
    }

    if (filters?.department) {
      filtered = filtered?.filter((user) => user?.department?.toLowerCase() === filters?.department);
    }

    if (filters?.status) {
      filtered = filtered?.filter((user) =>
      filters?.status === 'active' ? user?.isActive : !user?.isActive
      );
    }

    setFilteredUsers(filtered);
    setSelectedUsers([]);
  };

  const handleClearFilters = () => {
    setFilteredUsers(users);
    setSelectedUsers([]);
  };

  const stats = {
    totalUsers: users?.length,
    activeUsers: users?.filter((u) => u?.isActive)?.length,
    adminUsers: users?.filter((u) => u?.role === 'admin')?.length,
    twoFactorEnabled: users?.filter((u) => u?.twoFactorEnabled)?.length
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <NavigationBreadcrumbs />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">User Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage team members, roles, and permissions
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left">

              Export Users
            </Button>
            <Button
              onClick={() => setIsInviteModalOpen(true)}
              iconName="UserPlus"
              iconPosition="left">

              Invite User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 hover-lift">

            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="Users" size={24} className="text-primary" />
              </div>
              <span className="text-xs text-success font-medium">+12%</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.totalUsers}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 hover-lift">

            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Icon name="UserCheck" size={24} className="text-success" />
              </div>
              <span className="text-xs text-success font-medium">+8%</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.activeUsers}</p>
            <p className="text-sm text-muted-foreground">Active Users</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 hover-lift">

            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
                <Icon name="Shield" size={24} className="text-error" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">—</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.adminUsers}</p>
            <p className="text-sm text-muted-foreground">Administrators</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 hover-lift">

            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <Icon name="Lock" size={24} className="text-warning" />
              </div>
              <span className="text-xs text-success font-medium">+25%</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats?.twoFactorEnabled}</p>
            <p className="text-sm text-muted-foreground">2FA Enabled</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-muted/30 p-1 rounded-lg w-fit">
          {tabs?.map((tab) =>
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
                ${activeTab === tab?.id ?
            'bg-card text-primary shadow-elevated' :
            'text-muted-foreground hover:text-foreground'}
              `
            }>

              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.count !== null &&
            <span className={`
                  px-2 py-0.5 rounded-full text-xs
                  ${activeTab === tab?.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                `}>
                  {tab?.count}
                </span>
            }
            </button>
          )}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}>

          {activeTab === 'users' &&
          <>
              <UserFilters
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters} />

              
              <BulkActionsToolbar
              selectedUsers={selectedUsers}
              onBulkAction={handleBulkAction}
              onClearSelection={() => setSelectedUsers([])} />


              {/* Users Grid */}
              {isLoading ?
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)]?.map((_, index) =>
              <div key={index} className="glass-card p-6 animate-pulse">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-muted/50 rounded-xl" />
                        <div className="space-y-2">
                          <div className="h-4 bg-muted/50 rounded w-24" />
                          <div className="h-3 bg-muted/30 rounded w-32" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 bg-muted/30 rounded" />
                        <div className="h-3 bg-muted/30 rounded w-3/4" />
                      </div>
                    </div>
              )}
                </div> :

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers?.map((user, index) =>
              <motion.div
                key={user?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}>

                      <div className="relative">
                        <input
                    type="checkbox"
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={(e) => handleUserSelection(user?.id, e?.target?.checked)}
                    className="absolute top-4 right-4 w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50 z-10" />

                        <UserCard
                    user={user}
                    onRoleChange={handleRoleChange}
                    onStatusChange={handleStatusChange}
                    onViewProfile={handleViewProfile} />

                      </div>
                    </motion.div>
              )}
                </div>
            }

              {filteredUsers?.length === 0 && !isLoading &&
            <div className="text-center py-12">
                  <Icon name="Users" size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">No users found matching your criteria</p>
                </div>
            }
            </>
          }

          {activeTab === 'activity' &&
          <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Activity Timeline</h2>
                  <p className="text-sm text-muted-foreground">Recent user activities and system events</p>
                </div>
                <Button variant="outline" iconName="Filter">
                  Filter
                </Button>
              </div>
              <ActivityTimeline activities={activities} isLoading={isLoading} />
            </div>
          }

          {activeTab === 'analytics' &&
          <UsageAnalytics />
          }
        </motion.div>

        {/* Modals */}
        <InviteUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onInvite={handleInviteUser} />


        <UserProfileModal
          user={selectedUser}
          isOpen={isProfileModalOpen}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser} />

      </div>
    </div>);

};

export default UserManagementDashboard;