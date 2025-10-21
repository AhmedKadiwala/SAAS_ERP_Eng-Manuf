import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CommissionCalculator = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedRep, setSelectedRep] = useState('all');

  const commissionData = [
    {
      id: 1,
      name: 'Sarah Johnson',
      baseSalary: 60000,
      salesRevenue: 125000,
      commissionRate: 0.10,
      bonusEarned: 2500,
      totalCommission: 15000,
      deals: [
        { id: 'D001', client: 'Acme Corp', amount: 45000, commission: 4500, date: '2024-10-15' },
        { id: 'D002', client: 'Tech Solutions', amount: 32000, commission: 3200, date: '2024-10-08' },
        { id: 'D003', client: 'Global Industries', amount: 48000, commission: 4800, date: '2024-09-28' }
      ]
    },
    {
      id: 2,
      name: 'Michael Chen',
      baseSalary: 58000,
      salesRevenue: 118000,
      commissionRate: 0.10,
      bonusEarned: 1800,
      totalCommission: 13600,
      deals: [
        { id: 'D004', client: 'StartupXYZ', amount: 28000, commission: 2800, date: '2024-10-12' },
        { id: 'D005', client: 'Enterprise Co', amount: 55000, commission: 5500, date: '2024-10-05' },
        { id: 'D006', client: 'Innovation Labs', amount: 35000, commission: 3500, date: '2024-09-22' }
      ]
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      baseSalary: 55000,
      salesRevenue: 98000,
      commissionRate: 0.12,
      bonusEarned: 1200,
      totalCommission: 12960,
      deals: [
        { id: 'D007', client: 'Future Tech', amount: 42000, commission: 5040, date: '2024-10-18' },
        { id: 'D008', client: 'Digital Corp', amount: 31000, commission: 3720, date: '2024-10-01' },
        { id: 'D009', client: 'Smart Systems', amount: 25000, commission: 3000, date: '2024-09-15' }
      ]
    }
  ];

  const getCommissionTier = (revenue) => {
    if (revenue >= 120000) return { tier: 'Platinum', rate: 0.12, color: 'text-purple-500' };
    if (revenue >= 100000) return { tier: 'Gold', rate: 0.10, color: 'text-yellow-500' };
    if (revenue >= 75000) return { tier: 'Silver', rate: 0.08, color: 'text-gray-400' };
    return { tier: 'Bronze', rate: 0.06, color: 'text-amber-600' };
  };

  const calculateMonthlyEarnings = (rep) => {
    const monthlyBase = rep?.baseSalary / 12;
    const monthlyCommission = rep?.totalCommission / 3; // Quarterly data
    const monthlyBonus = rep?.bonusEarned / 3;
    return monthlyBase + monthlyCommission + monthlyBonus;
  };

  const AnimatedCounter = ({ value, prefix = '', suffix = '', duration = 1000 }) => {
    const [count, setCount] = useState(0);

    React.useEffect(() => {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setCount(Math.floor(progress * value));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    }, [value, duration]);

    return (
      <span>
        {prefix}{count?.toLocaleString()}{suffix}
      </span>
    );
  };

  const selectedRepData = selectedRep === 'all' ? null : commissionData?.find(rep => rep?.id === parseInt(selectedRep));

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Commission Calculator</h3>
            <p className="text-sm text-muted-foreground">Track earnings and commission breakdown</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="current">Current Quarter</option>
              <option value="previous">Previous Quarter</option>
              <option value="ytd">Year to Date</option>
            </select>
            
            <select
              value={selectedRep}
              onChange={(e) => setSelectedRep(e?.target?.value)}
              className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Representatives</option>
              {commissionData?.map(rep => (
                <option key={rep?.id} value={rep?.id}>{rep?.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-primary rounded-lg text-white">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="DollarSign" size={16} />
              <span className="text-xs opacity-90">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold">
              <AnimatedCounter value={341000} prefix="$" />
            </p>
          </div>
          
          <div className="text-center p-4 bg-gradient-accent rounded-lg text-white">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="Percent" size={16} />
              <span className="text-xs opacity-90">Total Commission</span>
            </div>
            <p className="text-2xl font-bold">
              <AnimatedCounter value={41560} prefix="$" />
            </p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-success to-primary rounded-lg text-white">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="Gift" size={16} />
              <span className="text-xs opacity-90">Bonuses</span>
            </div>
            <p className="text-2xl font-bold">
              <AnimatedCounter value={5500} prefix="$" />
            </p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-warning to-accent rounded-lg text-white">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="TrendingUp" size={16} />
              <span className="text-xs opacity-90">Avg Rate</span>
            </div>
            <p className="text-2xl font-bold">
              <AnimatedCounter value={10.4} suffix="%" />
            </p>
          </div>
        </div>
      </div>
      {selectedRepData ? (
        /* Individual Rep Details */
        (<div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {selectedRepData?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{selectedRepData?.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getCommissionTier(selectedRepData?.salesRevenue)?.color}`}>
                      {getCommissionTier(selectedRepData?.salesRevenue)?.tier} Tier
                    </span>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">
                      {getCommissionTier(selectedRepData?.salesRevenue)?.rate * 100}% Commission Rate
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  ${calculateMonthlyEarnings(selectedRepData)?.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Monthly Earnings</p>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Icon name="Briefcase" size={20} className="mx-auto mb-2 text-primary" />
                <p className="text-lg font-semibold text-foreground">
                  ${(selectedRepData?.baseSalary / 12)?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Base Salary</p>
              </div>
              
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Icon name="Percent" size={20} className="mx-auto mb-2 text-secondary" />
                <p className="text-lg font-semibold text-foreground">
                  ${(selectedRepData?.totalCommission / 3)?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Monthly Commission</p>
              </div>
              
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Icon name="Gift" size={20} className="mx-auto mb-2 text-success" />
                <p className="text-lg font-semibold text-foreground">
                  ${(selectedRepData?.bonusEarned / 3)?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Monthly Bonus</p>
              </div>
              
              <div className="text-center p-4 bg-muted/20 rounded-lg">
                <Icon name="BarChart3" size={20} className="mx-auto mb-2 text-accent" />
                <p className="text-lg font-semibold text-foreground">
                  ${(selectedRepData?.salesRevenue / 3)?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Monthly Sales</p>
              </div>
            </div>

            {/* Recent Deals */}
            <div>
              <h5 className="font-semibold text-foreground mb-4">Recent Deals</h5>
              <div className="space-y-3">
                {selectedRepData?.deals?.map((deal) => (
                  <div key={deal?.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="FileText" size={16} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{deal?.client}</p>
                        <p className="text-xs text-muted-foreground">Deal #{deal?.id} • {deal?.date}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${deal?.amount?.toLocaleString()}</p>
                      <p className="text-xs text-success">+${deal?.commission?.toLocaleString()} commission</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>)
      ) : (
        /* Team Overview */
        (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {commissionData?.map((rep) => {
            const tier = getCommissionTier(rep?.salesRevenue);
            const monthlyEarnings = calculateMonthlyEarnings(rep);
            
            return (
              <div key={rep?.id} className="glass-card p-6 space-y-4 hover-lift">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                      {rep?.name?.split(' ')?.map(n => n?.[0])?.join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{rep?.name}</h4>
                      <span className={`text-xs font-medium ${tier?.color}`}>{tier?.tier} Tier</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedRep(rep?.id?.toString())}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150"
                  >
                    <Icon name="ChevronRight" size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-lg font-bold text-foreground">${rep?.salesRevenue?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Sales Revenue</p>
                  </div>
                  <div className="text-center p-3 bg-muted/20 rounded-lg">
                    <p className="text-lg font-bold text-success">${rep?.totalCommission?.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Commission</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Earnings:</span>
                    <span className="text-sm font-semibold text-foreground">
                      ${monthlyEarnings?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>)
      )}
    </div>
  );
};

export default CommissionCalculator;