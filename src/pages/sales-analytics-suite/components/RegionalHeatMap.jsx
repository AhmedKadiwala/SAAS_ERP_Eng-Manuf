import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RegionalHeatMap = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const regionalData = [
    {
      region: 'North America',
      country: 'United States',
      revenue: 1250000,
      deals: 145,
      customers: 89,
      growth: 18.5,
      coordinates: { lat: 39.8283, lng: -98.5795 },
      cities: [
        { name: 'New York', revenue: 450000, deals: 52 },
        { name: 'Los Angeles', revenue: 320000, deals: 38 },
        { name: 'Chicago', revenue: 280000, deals: 32 },
        { name: 'Houston', revenue: 200000, deals: 23 }
      ]
    },
    {
      region: 'Europe',
      country: 'United Kingdom',
      revenue: 850000,
      deals: 98,
      customers: 67,
      growth: 12.3,
      coordinates: { lat: 55.3781, lng: -3.4360 },
      cities: [
        { name: 'London', revenue: 380000, deals: 44 },
        { name: 'Manchester', revenue: 220000, deals: 25 },
        { name: 'Birmingham', revenue: 150000, deals: 18 },
        { name: 'Edinburgh', revenue: 100000, deals: 11 }
      ]
    },
    {
      region: 'Europe',
      country: 'Germany',
      revenue: 720000,
      deals: 82,
      customers: 54,
      growth: 15.7,
      coordinates: { lat: 51.1657, lng: 10.4515 },
      cities: [
        { name: 'Berlin', revenue: 280000, deals: 32 },
        { name: 'Munich', revenue: 200000, deals: 23 },
        { name: 'Hamburg', revenue: 140000, deals: 16 },
        { name: 'Frankfurt', revenue: 100000, deals: 11 }
      ]
    },
    {
      region: 'Asia Pacific',
      country: 'Australia',
      revenue: 480000,
      deals: 56,
      customers: 38,
      growth: 22.1,
      coordinates: { lat: -25.2744, lng: 133.7751 },
      cities: [
        { name: 'Sydney', revenue: 220000, deals: 26 },
        { name: 'Melbourne', revenue: 160000, deals: 18 },
        { name: 'Brisbane', revenue: 70000, deals: 8 },
        { name: 'Perth', revenue: 30000, deals: 4 }
      ]
    },
    {
      region: 'Asia Pacific',
      country: 'Japan',
      revenue: 650000,
      deals: 74,
      customers: 45,
      growth: 8.9,
      coordinates: { lat: 36.2048, lng: 138.2529 },
      cities: [
        { name: 'Tokyo', revenue: 350000, deals: 40 },
        { name: 'Osaka', revenue: 180000, deals: 21 },
        { name: 'Nagoya', revenue: 80000, deals: 9 },
        { name: 'Yokohama', revenue: 40000, deals: 4 }
      ]
    },
    {
      region: 'South America',
      country: 'Brazil',
      revenue: 320000,
      deals: 42,
      customers: 28,
      growth: 28.4,
      coordinates: { lat: -14.2350, lng: -51.9253 },
      cities: [
        { name: 'São Paulo', revenue: 180000, deals: 24 },
        { name: 'Rio de Janeiro', revenue: 90000, deals: 12 },
        { name: 'Brasília', revenue: 35000, deals: 4 },
        { name: 'Salvador', revenue: 15000, deals: 2 }
      ]
    }
  ];

  const [selectedRegion, setSelectedRegion] = useState(null);

  const getMetricValue = (region, metric) => {
    switch (metric) {
      case 'revenue':
        return region?.revenue;
      case 'deals':
        return region?.deals;
      case 'customers':
        return region?.customers;
      case 'growth':
        return region?.growth;
      default:
        return region?.revenue;
    }
  };

  const getMaxValue = (metric) => {
    return Math.max(...regionalData?.map(region => getMetricValue(region, metric)));
  };

  const getHeatIntensity = (region, metric) => {
    const value = getMetricValue(region, metric);
    const maxValue = getMaxValue(metric);
    return (value / maxValue) * 100;
  };

  const getHeatColor = (intensity) => {
    if (intensity >= 80) return 'bg-red-500';
    if (intensity >= 60) return 'bg-orange-500';
    if (intensity >= 40) return 'bg-yellow-500';
    if (intensity >= 20) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const formatMetricValue = (value, metric) => {
    switch (metric) {
      case 'revenue':
        return `$${(value / 1000)?.toFixed(0)}k`;
      case 'growth':
        return `${value}%`;
      default:
        return value?.toString();
    }
  };

  const getGrowthIcon = (growth) => {
    if (growth >= 20) return { icon: 'TrendingUp', color: 'text-success' };
    if (growth >= 10) return { icon: 'TrendingUp', color: 'text-warning' };
    if (growth >= 0) return { icon: 'Minus', color: 'text-muted-foreground' };
    return { icon: 'TrendingDown', color: 'text-error' };
  };

  const totalRevenue = regionalData?.reduce((sum, region) => sum + region?.revenue, 0);
  const totalDeals = regionalData?.reduce((sum, region) => sum + region?.deals, 0);
  const totalCustomers = regionalData?.reduce((sum, region) => sum + region?.customers, 0);
  const avgGrowth = regionalData?.reduce((sum, region) => sum + region?.growth, 0) / regionalData?.length;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Regional Performance</h3>
            <p className="text-sm text-muted-foreground">Geographic sales distribution and heat map</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex bg-muted/30 rounded-lg p-1">
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                  selectedMetric === 'revenue' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setSelectedMetric('deals')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                  selectedMetric === 'deals' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Deals
              </button>
              <button
                onClick={() => setSelectedMetric('growth')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
                  selectedMetric === 'growth' ?'bg-primary text-primary-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
                }`}
              >
                Growth
              </button>
            </div>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e?.target?.value)}
              className="px-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="current">Current Quarter</option>
              <option value="previous">Previous Quarter</option>
              <option value="ytd">Year to Date</option>
            </select>
          </div>
        </div>

        {/* Global Summary */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-primary rounded-lg text-white">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="Globe" size={16} />
              <span className="text-xs opacity-90">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold">${(totalRevenue / 1000000)?.toFixed(1)}M</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-secondary rounded-lg text-white">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="Handshake" size={16} />
              <span className="text-xs opacity-90">Total Deals</span>
            </div>
            <p className="text-2xl font-bold">{totalDeals}</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-accent rounded-lg text-white">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="Users" size={16} />
              <span className="text-xs opacity-90">Total Customers</span>
            </div>
            <p className="text-2xl font-bold">{totalCustomers}</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-success to-primary rounded-lg text-white">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Icon name="TrendingUp" size={16} />
              <span className="text-xs opacity-90">Avg Growth</span>
            </div>
            <p className="text-2xl font-bold">{avgGrowth?.toFixed(1)}%</p>
          </div>
        </div>
      </div>
      {/* Interactive Map */}
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-foreground">Interactive Heat Map</h4>
            <p className="text-sm text-muted-foreground">Click on regions for detailed breakdown</p>
          </div>
          
          {/* Heat Map Legend */}
          <div className="flex items-center space-x-4">
            <span className="text-xs text-muted-foreground">Low</span>
            <div className="flex space-x-1">
              <div className="w-4 h-4 bg-blue-500 rounded-sm" />
              <div className="w-4 h-4 bg-green-500 rounded-sm" />
              <div className="w-4 h-4 bg-yellow-500 rounded-sm" />
              <div className="w-4 h-4 bg-orange-500 rounded-sm" />
              <div className="w-4 h-4 bg-red-500 rounded-sm" />
            </div>
            <span className="text-xs text-muted-foreground">High</span>
          </div>
        </div>

        {/* Simplified World Map Representation */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {regionalData?.map((region, index) => {
            const intensity = getHeatIntensity(region, selectedMetric);
            const heatColor = getHeatColor(intensity);
            const growthInfo = getGrowthIcon(region?.growth);
            
            return (
              <button
                key={index}
                onClick={() => setSelectedRegion(selectedRegion === index ? null : index)}
                className={`p-4 rounded-lg border-2 transition-all duration-150 hover-lift text-left ${
                  selectedRegion === index 
                    ? 'border-primary bg-primary/5' :'border-border bg-muted/20 hover:border-border/80'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 ${heatColor} rounded-full`} />
                    <span className="font-medium text-foreground">{region?.country}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Icon name={growthInfo?.icon} size={14} className={growthInfo?.color} />
                    <span className={`text-xs ${growthInfo?.color}`}>{region?.growth}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Revenue:</span>
                    <span className="text-sm font-semibold text-foreground">
                      ${(region?.revenue / 1000)?.toLocaleString()}k
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Deals:</span>
                    <span className="text-sm font-semibold text-foreground">{region?.deals}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Customers:</span>
                    <span className="text-sm font-semibold text-foreground">{region?.customers}</span>
                  </div>
                </div>
                <div className="mt-3 w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${heatColor} transition-all duration-500`}
                    style={{ width: `${intensity}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {/* Detailed Regional Breakdown */}
      {selectedRegion !== null && (
        <div className="glass-card p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-foreground">
                {regionalData?.[selectedRegion]?.country} - Detailed Breakdown
              </h4>
              <p className="text-sm text-muted-foreground">City-level performance metrics</p>
            </div>
            
            <button
              onClick={() => setSelectedRegion(null)}
              className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150"
            >
              <Icon name="X" size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalData?.[selectedRegion]?.cities?.map((city, index) => (
              <div key={index} className="p-4 bg-muted/20 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-foreground">{city?.name}</h5>
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="MapPin" size={16} className="text-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Revenue:</span>
                    <span className="text-sm font-semibold text-foreground">
                      ${(city?.revenue / 1000)?.toLocaleString()}k
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Deals:</span>
                    <span className="text-sm font-semibold text-foreground">{city?.deals}</span>
                  </div>
                </div>
                
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-primary transition-all duration-500"
                    style={{ 
                      width: `${(city?.revenue / regionalData?.[selectedRegion]?.cities?.[0]?.revenue) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Google Maps Integration */}
          <div className="h-64 rounded-lg overflow-hidden border border-border">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title={`${regionalData?.[selectedRegion]?.country} Sales Map`}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${regionalData?.[selectedRegion]?.coordinates?.lat},${regionalData?.[selectedRegion]?.coordinates?.lng}&z=6&output=embed`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalHeatMap;