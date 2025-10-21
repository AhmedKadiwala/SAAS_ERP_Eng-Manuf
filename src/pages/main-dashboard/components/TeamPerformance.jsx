import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TeamPerformance = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isLoading, setIsLoading] = useState(true);

  const mockTeamData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: "https://images.unsplash.com/photo-1684262855358-88f296a2cfc2",
    avatarAlt: 'Professional headshot of woman with brown hair in white blazer smiling',
    role: 'Sales Manager',
    sales: 125000,
    deals: 23,
    conversion: 78,
    growth: 12.5,
    rank: 1
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: "https://images.unsplash.com/photo-1687256457585-3608dfa736c5",
    avatarAlt: 'Professional headshot of Asian man with glasses in dark suit',
    role: 'Account Executive',
    sales: 98000,
    deals: 18,
    conversion: 72,
    growth: 8.3,
    rank: 2
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: "https://images.unsplash.com/photo-1510975866110-51c411b08b0b",
    avatarAlt: 'Professional headshot of Hispanic woman with long dark hair in blue shirt',
    role: 'Business Development',
    sales: 87500,
    deals: 16,
    conversion: 68,
    growth: 15.2,
    rank: 3
  },
  {
    id: 4,
    name: 'David Kim',
    avatar: "https://images.unsplash.com/photo-1588178457501-31b7688a41a0",
    avatarAlt: 'Professional headshot of Korean man with short black hair in navy blazer',
    role: 'Sales Representative',
    sales: 76000,
    deals: 14,
    conversion: 65,
    growth: 6.8,
    rank: 4
  }];


  const chartData = mockTeamData?.map((member) => ({
    name: member?.name?.split(' ')?.[0],
    sales: member?.sales / 1000,
    deals: member?.deals,
    conversion: member?.conversion
  }));

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearInterval(timer);
  }, [selectedPeriod]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:return { icon: 'Trophy', color: 'text-yellow-500' };
      case 2:return { icon: 'Medal', color: 'text-gray-400' };
      case 3:return { icon: 'Award', color: 'text-orange-500' };
      default:return { icon: 'User', color: 'text-muted-foreground' };
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card p-3 shadow-floating border border-border/50">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm text-muted-foreground">Sales:</span>
              <span className="text-sm font-semibold text-foreground">
                ${payload?.[0]?.value}K
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full" />
              <span className="text-sm text-muted-foreground">Deals:</span>
              <span className="text-sm font-semibold text-foreground">
                {payload?.[1]?.value || 0}
              </span>
            </div>
          </div>
        </div>);

    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Team Performance</h3>
          <p className="text-sm text-muted-foreground">Sales team leaderboard and metrics</p>
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e?.target?.value)}
          className="text-sm bg-muted/30 border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50">

          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Leaderboard */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Sales Leaderboard</h4>
          
          {isLoading ?
          <div className="space-y-3">
              {[...Array(4)]?.map((_, i) =>
            <div key={i} className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-muted/50 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted/50 rounded w-3/4" />
                    <div className="h-3 bg-muted/30 rounded w-1/2" />
                  </div>
                </div>
            )}
            </div> :

          <div className="space-y-3">
              {mockTeamData?.map((member, index) => {
              const rankInfo = getRankIcon(member?.rank);
              return (
                <motion.div
                  key={member?.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg hover:bg-muted/30 transition-colors duration-150 group">

                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-background shadow-elevated">
                        <Image
                        src={member?.avatar}
                        alt={member?.avatarAlt}
                        className="w-full h-full object-cover" />

                      </div>
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-background flex items-center justify-center ${rankInfo?.color}`}>
                        <Icon name={rankInfo?.icon} size={12} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-sm text-foreground">{member?.name}</h5>
                        <span className="text-xs text-muted-foreground">#{member?.rank}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{member?.role}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm font-semibold text-foreground">
                          ${(member?.sales / 1000)?.toFixed(0)}K
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {member?.deals} deals
                        </span>
                        <div className={`flex items-center space-x-1 text-xs ${
                      member?.growth >= 0 ? 'text-success' : 'text-error'}`
                      }>
                          <Icon name={member?.growth >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                          <span>{Math.abs(member?.growth)}%</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>);

            })}
            </div>
          }
        </div>

        {/* Performance Chart */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Sales Comparison</h4>
          
          <div className="h-64">
            {isLoading ?
            <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-3">
                  <Icon name="Loader2" size={20} className="animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Loading chart...</span>
                </div>
              </div> :

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                  <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }} />

                  <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                  tickFormatter={(value) => `$${value}K`} />

                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                  dataKey="sales"
                  fill="var(--color-primary)"
                  radius={[4, 4, 0, 0]}
                  opacity={0.8} />

                </BarChart>
              </ResponsiveContainer>
            }
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Team Size: 4</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Target" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Avg. Conversion: 71%</span>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
            <span>View Team Details</span>
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      </div>
    </motion.div>);

};

export default TeamPerformance;