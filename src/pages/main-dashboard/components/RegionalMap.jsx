import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const RegionalMap = () => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const mockRegionalData = [
    {
      id: 'north-america',
      name: 'North America',
      revenue: 450000,
      customers: 1250,
      growth: 15.2,
      color: 'bg-blue-500',
      coordinates: { lat: 39.8283, lng: -98.5795 }
    },
    {
      id: 'europe',
      name: 'Europe',
      revenue: 320000,
      customers: 890,
      growth: 12.8,
      color: 'bg-green-500',
      coordinates: { lat: 54.5260, lng: 15.2551 }
    },
    {
      id: 'asia-pacific',
      name: 'Asia Pacific',
      revenue: 280000,
      customers: 1580,
      growth: 22.5,
      color: 'bg-purple-500',
      coordinates: { lat: 34.0479, lng: 100.6197 }
    },
    {
      id: 'latin-america',
      name: 'Latin America',
      revenue: 150000,
      customers: 420,
      growth: 18.7,
      color: 'bg-orange-500',
      coordinates: { lat: -8.7832, lng: -55.4915 }
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const totalRevenue = mockRegionalData?.reduce((sum, region) => sum + region?.revenue, 0);
  const totalCustomers = mockRegionalData?.reduce((sum, region) => sum + region?.customers, 0);

  const RegionCard = ({ region, index }) => {
    const revenuePercentage = (region?.revenue / totalRevenue * 100)?.toFixed(1);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        onClick={() => setSelectedRegion(region?.id === selectedRegion ? null : region?.id)}
        className={`p-4 rounded-lg border cursor-pointer transition-all duration-150 hover:shadow-elevated ${
          selectedRegion === region?.id 
            ? 'border-primary/50 bg-primary/5 shadow-elevated' 
            : 'border-border hover:border-border/80 bg-muted/20'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${region?.color}`} />
            <h4 className="font-medium text-sm text-foreground">{region?.name}</h4>
          </div>
          <div className={`flex items-center space-x-1 text-xs ${
            region?.growth >= 0 ? 'text-success' : 'text-error'
          }`}>
            <Icon name={region?.growth >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
            <span>{region?.growth}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Revenue</span>
            <span className="text-sm font-semibold text-foreground">
              ${(region?.revenue / 1000)?.toFixed(0)}K
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Customers</span>
            <span className="text-sm font-medium text-foreground">
              {region?.customers?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Market Share</span>
            <span className="text-sm font-medium text-foreground">{revenuePercentage}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted/30 rounded-full h-2 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${revenuePercentage}%` }}
              transition={{ duration: 1, delay: index * 0.2 }}
              className={`h-2 rounded-full ${region?.color}`}
            />
          </div>
        </div>
        {selectedRegion === region?.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-3 border-t border-border/50"
          >
            <div className="w-full h-48 bg-muted/20 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                loading="lazy"
                title={`${region?.name} Regional Map`}
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${region?.coordinates?.lat},${region?.coordinates?.lng}&z=4&output=embed`}
                className="border-0"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Regional Performance</h3>
          <p className="text-sm text-muted-foreground">Revenue distribution across global markets</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-sm font-semibold text-foreground">
              ${(totalRevenue / 1000000)?.toFixed(1)}M
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Customers</p>
            <p className="text-sm font-semibold text-foreground">
              {totalCustomers?.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)]?.map((_, i) => (
            <div key={i} className="p-4 bg-muted/20 rounded-lg animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-4 h-4 bg-muted/50 rounded-full" />
                <div className="h-4 bg-muted/50 rounded w-24" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-muted/30 rounded" />
                <div className="h-3 bg-muted/30 rounded w-3/4" />
                <div className="h-2 bg-muted/30 rounded-full mt-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockRegionalData?.map((region, index) => (
            <RegionCard key={region?.id} region={region} index={index} />
          ))}
        </div>
      )}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Icon name="Globe" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">4 Active Regions</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-sm text-success">+17.3% Global Growth</span>
            </div>
          </div>
          
          <button className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
            <span>View Analytics</span>
            <Icon name="ArrowRight" size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RegionalMap;