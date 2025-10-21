import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TeamPerformance = () => {
  const [viewType, setViewType] = useState('revenue');
  const [sortBy, setSortBy] = useState('revenue');

  const teamData = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: "https://images.unsplash.com/photo-1665454043378-97c3964ff230",
    avatarAlt: 'Professional woman with shoulder-length brown hair in white blazer',
    revenue: 125000,
    deals: 18,
    conversion: 24.5,
    target: 120000,
    commission: 12500,
    rank: 1
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: "https://images.unsplash.com/photo-1629272039203-7d76fdaf1324",
    avatarAlt: 'Asian man with black hair in navy blue suit and tie',
    revenue: 118000,
    deals: 22,
    conversion: 19.8,
    target: 115000,
    commission: 11800,
    rank: 2
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    avatar: "https://images.unsplash.com/photo-1734521992144-5a4d0ea55952",
    avatarAlt: 'Hispanic woman with long dark hair in professional gray blazer',
    revenue: 98000,
    deals: 15,
    conversion: 28.2,
    target: 100000,
    commission: 9800,
    rank: 3
  },
  {
    id: 4,
    name: 'David Thompson',
    avatar: "https://images.unsplash.com/photo-1728072584773-81a2ea45a706",
    avatarAlt: 'Caucasian man with beard in dark suit jacket and white shirt',
    revenue: 87000,
    deals: 12,
    conversion: 22.1,
    target: 95000,
    commission: 8700,
    rank: 4
  },
  {
    id: 5,
    name: 'Lisa Park',
    avatar: "https://images.unsplash.com/photo-1576023614379-f47d12365b69",
    avatarAlt: 'Asian woman with short black hair in light blue business shirt',
    revenue: 76000,
    deals: 14,
    conversion: 18.9,
    target: 85000,
    commission: 7600,
    rank: 5
  }];


  const chartData = teamData?.map((member) => ({
    name: member?.name?.split(' ')?.[0],
    revenue: member?.revenue / 1000,
    target: member?.target / 1000,
    deals: member?.deals,
    conversion: member?.conversion
  }));

  const sortedTeamData = [...teamData]?.sort((a, b) => {
    switch (sortBy) {
      case 'deals':
        return b?.deals - a?.deals;
      case 'conversion':
        return b?.conversion - a?.conversion;
      case 'target':
        return b?.revenue / b?.target - a?.revenue / a?.target;
      default:
        return b?.revenue - a?.revenue;
    }
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card p-4 border border-border/50 shadow-floating">
          <p className="font-semibold text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) =>
          <div key={index} className="flex items-center space-x-2 mb-1">
              <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry?.color }} />

              <span className="text-sm text-muted-foreground capitalize">{entry?.dataKey}:</span>
              <span className="text-sm font-medium text-foreground">
                {entry?.dataKey === 'revenue' || entry?.dataKey === 'target' ?
              `$${entry?.value}k` :
              entry?.dataKey === 'conversion' ?
              `${entry?.value}%` :
              entry?.value
              }
              </span>
            </div>
          )}
        </div>);

    }
    return null;
  };

  const getRankBadge = (rank) => {
    const badges = {
      1: { icon: 'Trophy', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
      2: { icon: 'Medal', color: 'text-gray-400', bg: 'bg-gray-400/10' },
      3: { icon: 'Award', color: 'text-amber-600', bg: 'bg-amber-600/10' }
    };

    const badge = badges?.[rank];
    if (!badge) return null;

    return (
      <div className={`w-8 h-8 ${badge?.bg} rounded-full flex items-center justify-center`}>
        <Icon name={badge?.icon} size={16} className={badge?.color} />
      </div>);

  };

  const getPerformanceColor = (revenue, target) => {
    const percentage = revenue / target * 100;
    if (percentage >= 100) return 'text-success';
    if (percentage >= 80) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-6">
      {/* Performance Chart */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Team Performance</h3>
            <p className="text-sm text-muted-foreground">Individual sales metrics comparison</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex bg-muted/30 rounded-lg p-1">
              <button
                onClick={() => setViewType('revenue')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                viewType === 'revenue' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`
                }>

                Revenue
              </button>
              <button
                onClick={() => setViewType('deals')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                viewType === 'deals' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`
                }>

                Deals
              </button>
              <button
                onClick={() => setViewType('conversion')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                viewType === 'conversion' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`
                }>

                Conversion
              </button>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                fontSize={12} />

              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) =>
                viewType === 'revenue' ? `$${value}k` :
                viewType === 'conversion' ? `${value}%` : value
                } />

              <Tooltip content={<CustomTooltip />} />
              {viewType === 'revenue' &&
              <>
                  <Bar dataKey="revenue" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="var(--color-accent)" opacity={0.5} radius={[4, 4, 0, 0]} />
                </>
              }
              {viewType === 'deals' &&
              <Bar dataKey="deals" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} />
              }
              {viewType === 'conversion' &&
              <Bar dataKey="conversion" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
              }
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Leaderboard */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Sales Leaderboard</h3>
            <p className="text-sm text-muted-foreground">Top performers this month</p>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">

            <option value="revenue">Sort by Revenue</option>
            <option value="deals">Sort by Deals</option>
            <option value="conversion">Sort by Conversion</option>
            <option value="target">Sort by Target Achievement</option>
          </select>
        </div>

        <div className="space-y-3">
          {sortedTeamData?.map((member, index) =>
          <div key={member?.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/30 transition-all duration-150 hover-lift">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {getRankBadge(index + 1)}
                  <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                </div>
                
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted/50">
                  <Image
                  src={member?.avatar}
                  alt={member?.avatarAlt}
                  className="w-full h-full object-cover" />

                </div>
                
                <div>
                  <p className="font-medium text-foreground">{member?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member?.deals} deals • {member?.conversion}% conversion
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  ${member?.revenue?.toLocaleString()}
                </p>
                <div className="flex items-center space-x-2">
                  <p className={`text-xs ${getPerformanceColor(member?.revenue, member?.target)}`}>
                    {(member?.revenue / member?.target * 100)?.toFixed(1)}% of target
                  </p>
                  <Icon
                  name={member?.revenue >= member?.target ? "TrendingUp" : "TrendingDown"}
                  size={12}
                  className={getPerformanceColor(member?.revenue, member?.target)} />

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

};

export default TeamPerformance;