import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const mockActivities = [
  {
    id: 1,
    type: 'customer_added',
    user: 'Sarah Johnson',
    userAvatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    userAvatarAlt: 'Professional headshot of woman with brown hair in white blazer smiling',
    action: 'added new customer',
    target: 'Acme Corporation',
    timestamp: new Date(Date.now() - 300000),
    icon: 'UserPlus',
    color: 'text-success'
  },
  {
    id: 2,
    type: 'invoice_generated',
    user: 'Michael Chen',
    userAvatar: "https://images.unsplash.com/photo-1687256457585-3608dfa736c5",
    userAvatarAlt: 'Professional headshot of Asian man with glasses in dark suit',
    action: 'generated invoice',
    target: 'INV-2024-001',
    amount: '$2,500',
    timestamp: new Date(Date.now() - 600000),
    icon: 'FileText',
    color: 'text-primary'
  },
  {
    id: 3,
    type: 'lead_converted',
    user: 'Emily Rodriguez',
    userAvatar: "https://images.unsplash.com/photo-1510975866110-51c411b08b0b",
    userAvatarAlt: 'Professional headshot of Hispanic woman with long dark hair in blue shirt',
    action: 'converted lead to customer',
    target: 'Tech Solutions Inc',
    timestamp: new Date(Date.now() - 900000),
    icon: 'TrendingUp',
    color: 'text-accent'
  },
  {
    id: 4,
    type: 'product_updated',
    user: 'David Kim',
    userAvatar: "https://images.unsplash.com/photo-1588178457501-31b7688a41a0",
    userAvatarAlt: 'Professional headshot of Korean man with short black hair in navy blazer',
    action: 'updated product inventory',
    target: 'Premium Software License',
    quantity: '+50 units',
    timestamp: new Date(Date.now() - 1200000),
    icon: 'Package',
    color: 'text-warning'
  },
  {
    id: 5,
    type: 'payment_received',
    user: 'System',
    userAvatar: "https://images.unsplash.com/photo-1653506887702-5a73fa68bc54",
    userAvatarAlt: 'Professional headshot of man with beard in white shirt smiling',
    action: 'received payment for',
    target: 'INV-2024-002',
    amount: '$1,800',
    timestamp: new Date(Date.now() - 1500000),
    icon: 'CreditCard',
    color: 'text-success'
  },
  {
    id: 6,
    type: 'meeting_scheduled',
    user: 'Lisa Wang',
    userAvatar: "https://images.unsplash.com/photo-1597621969117-1a305d3e0c68",
    userAvatarAlt: 'Professional headshot of Asian woman with shoulder-length hair in black blazer',
    action: 'scheduled meeting with',
    target: 'Johnson Corp',
    timestamp: new Date(Date.now() - 1800000),
    icon: 'Calendar',
    color: 'text-primary'
  }];


  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filterOptions = [
  { value: 'all', label: 'All Activities', icon: 'Activity' },
  { value: 'customer_added', label: 'Customers', icon: 'Users' },
  { value: 'invoice_generated', label: 'Invoices', icon: 'FileText' },
  { value: 'lead_converted', label: 'Leads', icon: 'TrendingUp' }];


  const filteredActivities = filter === 'all' ?
  activities :
  activities?.filter((activity) => activity?.type === filter);

  const ActivityItem = ({ activity, index }) =>
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors duration-150 group">

      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-background shadow-elevated">
          <Image
          src={activity?.userAvatar}
          alt={activity?.userAvatarAlt}
          className="w-full h-full object-cover" />

        </div>
        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-background flex items-center justify-center ${activity?.color}`}>
          <Icon name={activity?.icon} size={12} />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-medium text-sm text-foreground">{activity?.user}</span>
          <span className="text-xs text-muted-foreground">{formatTimeAgo(activity?.timestamp)}</span>
        </div>
        
        <p className="text-sm text-muted-foreground">
          {activity?.action}{' '}
          <span className="font-medium text-foreground">{activity?.target}</span>
          {activity?.amount &&
        <span className="ml-1 font-semibold text-success">{activity?.amount}</span>
        }
          {activity?.quantity &&
        <span className="ml-1 font-medium text-warning">{activity?.quantity}</span>
        }
        </p>
      </div>

      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted/50 rounded-md transition-all duration-150">
        <Icon name="MoreHorizontal" size={16} />
      </button>
    </motion.div>;


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6 h-full flex flex-col">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest team actions and updates</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="text-sm bg-muted/30 border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50">

            {filterOptions?.map((option) =>
            <option key={option?.value} value={option?.value}>
                {option?.label}
              </option>
            )}
          </select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {isLoading ?
        <div className="space-y-3">
            {[...Array(5)]?.map((_, i) =>
          <div key={i} className="flex items-center space-x-3 p-3">
                <div className="w-10 h-10 bg-muted/50 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted/50 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-muted/30 rounded animate-pulse w-1/2" />
                </div>
              </div>
          )}
          </div> :

        <AnimatePresence mode="wait">
            <div className="space-y-1">
              {filteredActivities?.map((activity, index) =>
            <ActivityItem key={activity?.id} activity={activity} index={index} />
            )}
            </div>
          </AnimatePresence>
        }
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <button className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
          <span>View All Activities</span>
          <Icon name="ArrowRight" size={14} />
        </button>
      </div>
    </motion.div>);

};

export default ActivityFeed;