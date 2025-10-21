import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';



const UsageAnalytics = () => {
  const featureUsageData = [
  { feature: 'Dashboard', usage: 95, users: 38 },
  { feature: 'Customers', usage: 87, users: 35 },
  { feature: 'Pipeline', usage: 78, users: 31 },
  { feature: 'Invoices', usage: 65, users: 26 },
  { feature: 'Analytics', usage: 52, users: 21 },
  { feature: 'Inventory', usage: 43, users: 17 },
  { feature: 'Reports', usage: 38, users: 15 },
  { feature: 'Settings', usage: 25, users: 10 }];


  const roleDistributionData = [
  { name: 'Sales Rep', value: 45, count: 18, color: '#667eea' },
  { name: 'Support', value: 25, count: 10, color: '#764ba2' },
  { name: 'Manager', value: 15, count: 6, color: '#f093fb' },
  { name: 'Admin', value: 10, count: 4, color: '#f5576c' },
  { name: 'Viewer', value: 5, count: 2, color: '#4facfe' }];


  const activityTrendData = [
  { day: 'Mon', logins: 32, actions: 156 },
  { day: 'Tue', logins: 28, actions: 142 },
  { day: 'Wed', logins: 35, actions: 178 },
  { day: 'Thu', logins: 31, actions: 165 },
  { day: 'Fri', logins: 29, actions: 149 },
  { day: 'Sat', logins: 12, actions: 67 },
  { day: 'Sun', logins: 8, actions: 45 }];


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 shadow-floating">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry, index) =>
          <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.dataKey === 'usage' && '%'}
            </p>
          )}
        </div>);

    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Usage Analytics</h2>
          <p className="text-sm text-muted-foreground">Team activity and feature adoption insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-success">
            <Icon name="TrendingUp" size={16} />
            <span className="text-sm font-medium">+12% this week</span>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Users" size={20} className="text-primary" />
            <span className="text-xs text-success font-medium">+5.2%</span>
          </div>
          <p className="text-2xl font-bold text-foreground">40</p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Activity" size={20} className="text-success" />
            <span className="text-xs text-success font-medium">+8.1%</span>
          </div>
          <p className="text-2xl font-bold text-foreground">87%</p>
          <p className="text-sm text-muted-foreground">Active Rate</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="Clock" size={20} className="text-warning" />
            <span className="text-xs text-warning font-medium">-2.3%</span>
          </div>
          <p className="text-2xl font-bold text-foreground">4.2h</p>
          <p className="text-sm text-muted-foreground">Avg Session</p>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <Icon name="MousePointer" size={20} className="text-accent" />
            <span className="text-xs text-success font-medium">+15.7%</span>
          </div>
          <p className="text-2xl font-bold text-foreground">1,247</p>
          <p className="text-sm text-muted-foreground">Actions/Day</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Usage Chart */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Feature Adoption</h3>
            <Button variant="ghost" size="sm" iconName="Download">
              Export
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={featureUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="feature"
                  stroke="var(--color-muted-foreground)"
                  fontSize={12} />

                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12} />

                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="usage"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]} />

              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Role Distribution</h3>
            <Button variant="ghost" size="sm" iconName="Users">
              Manage
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value">

                  {roleDistributionData.map((entry, index) =>
                  <Cell key={`cell-${index}`} fill={entry.color} />
                  )}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                  `${props.payload.count} users (${value}%)`,
                  props.payload.name]
                  } />

              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {roleDistributionData.map((role, index) =>
            <div key={index} className="flex items-center space-x-2">
                <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: role.color }} />

                <span className="text-sm text-muted-foreground">
                  {role.name} ({role.count})
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Trend */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Weekly Activity Trend</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">Logins</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-sm text-muted-foreground">Actions</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="day"
                stroke="var(--color-muted-foreground)"
                fontSize={12} />

              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12} />

              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="logins"
                fill="var(--color-primary)"
                radius={[2, 2, 0, 0]} />

              <Bar
                dataKey="actions"
                fill="var(--color-accent)"
                radius={[2, 2, 0, 0]} />

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Most Active Users</h3>
        <div className="space-y-3">
          {[
          { name: 'Sarah Johnson', role: 'Sales Manager', actions: 156, avatar: "https://images.unsplash.com/photo-1683203438694-b428d712b8da", avatarAlt: 'Professional woman with blonde hair in business attire smiling at camera' },
          { name: 'Michael Chen', role: 'Sales Rep', actions: 142, avatar: "https://images.unsplash.com/photo-1621313212177-5ed735a8d521", avatarAlt: 'Asian man in dark suit with confident smile in office setting' },
          { name: 'Emily Rodriguez', role: 'Support Agent', actions: 128, avatar: "https://images.unsplash.com/photo-1706565029539-d09af5896340", avatarAlt: 'Hispanic woman with dark hair in professional blazer with warm smile' },
          { name: 'David Thompson', role: 'Manager', actions: 115, avatar: "https://images.unsplash.com/photo-1688012162633-91b2f48c7edb", avatarAlt: 'Caucasian man with beard in navy shirt looking professional' }].
          map((user, index) =>
          <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-primary">
                  <Image
                  src={user.avatar}
                  alt={user.avatarAlt}
                  className="w-full h-full object-cover" />

                </div>
                <div>
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{user.actions}</p>
                <p className="text-sm text-muted-foreground">actions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};

export default UsageAnalytics;