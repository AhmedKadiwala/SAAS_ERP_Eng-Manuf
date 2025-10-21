import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const StockLevelCards = ({ stats, alerts }) => {
  const cards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toLocaleString() || '0',
      change: '+12 this month',
      changeType: 'positive',
      icon: 'Package',
      color: 'blue',
      alt: `Total products: ${stats?.totalProducts || 0}`
    },
    {
      title: 'Total Stock Value',
      value: `$${stats?.totalValue?.toLocaleString() || '0'}`,
      change: '+8.3% vs last month',
      changeType: 'positive',
      icon: 'DollarSign',
      color: 'green',
      alt: `Total stock value: $${stats?.totalValue?.toLocaleString() || 0}`
    },
    {
      title: 'Low Stock Items',
      value: stats?.lowStockItems?.toLocaleString() || '0',
      change: alerts?.filter(a => a?.severity === 'medium')?.length + ' warnings',
      changeType: 'warning',
      icon: 'AlertTriangle',
      color: 'orange',
      alt: `Low stock items: ${stats?.lowStockItems || 0}`
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStockItems?.toLocaleString() || '0',
      change: alerts?.filter(a => a?.severity === 'critical')?.length + ' critical',
      changeType: 'negative',
      icon: 'AlertCircle',
      color: 'red',
      alt: `Out of stock items: ${stats?.outOfStockItems || 0}`
    },
    {
      title: 'Turnover Rate',
      value: `${stats?.turnoverRate?.toFixed(1) || '0'}x`,
      change: '+0.3 vs last quarter',
      changeType: 'positive',
      icon: 'RotateCcw',
      color: 'purple',
      alt: `Inventory turnover rate: ${stats?.turnoverRate?.toFixed(1) || 0} times per period`
    },
    {
      title: 'Avg Stock Level',
      value: Math?.round(stats?.averageStockLevel || 0)?.toLocaleString(),
      change: 'Across all products',
      changeType: 'neutral',
      icon: 'BarChart3',
      color: 'indigo',
      alt: `Average stock level: ${Math?.round(stats?.averageStockLevel || 0)} units`
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500/10',
        icon: 'text-blue-500',
        accent: 'border-l-blue-500'
      },
      green: {
        bg: 'bg-green-500/10',
        icon: 'text-green-500',
        accent: 'border-l-green-500'
      },
      orange: {
        bg: 'bg-orange-500/10',
        icon: 'text-orange-500',
        accent: 'border-l-orange-500'
      },
      red: {
        bg: 'bg-red-500/10',
        icon: 'text-red-500',
        accent: 'border-l-red-500'
      },
      purple: {
        bg: 'bg-purple-500/10',
        icon: 'text-purple-500',
        accent: 'border-l-purple-500'
      },
      indigo: {
        bg: 'bg-indigo-500/10',
        icon: 'text-indigo-500',
        accent: 'border-l-indigo-500'
      }
    };
    return colors?.[color] || colors?.blue;
  };

  const getChangeColorClass = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'positive':
        return 'TrendingUp';
      case 'negative':
        return 'TrendingDown';
      case 'warning':
        return 'AlertTriangle';
      default:
        return 'Minus';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {cards?.map((card, index) => {
        const colorClasses = getColorClasses(card?.color);
        
        return (
          <motion.div
            key={card?.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card border-l-4 ${colorClasses?.accent} hover:shadow-elevated transition-all duration-300`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${colorClasses?.bg} rounded-lg flex items-center justify-center`}>
                  <Icon name={card?.icon} className={colorClasses?.icon} size={24} />
                </div>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                  <Icon name="MoreHorizontal" size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">{card?.title}</p>
                <p className="text-2xl font-bold text-foreground">{card?.value}</p>
                
                <div className={`flex items-center space-x-1 text-sm ${getChangeColorClass(card?.changeType)}`}>
                  <Icon name={getChangeIcon(card?.changeType)} size={14} />
                  <span>{card?.change}</span>
                </div>
              </div>

              {/* Progress indicator for items with thresholds */}
              {(card?.title?.includes('Stock') || card?.title?.includes('Out of')) && (
                <div className="mt-4">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        card?.changeType === 'negative' || card?.changeType === 'warning'
                          ? card?.changeType === 'negative'? 'bg-red-500' : 'bg-orange-500' :'bg-green-500'
                      }`}
                      style={{
                        width: card?.title?.includes('Out of') 
                          ? `${Math?.min(100, (parseInt(card?.value) / Math?.max(1, stats?.totalProducts || 1)) * 100)}%`
                          : card?.title?.includes('Low Stock')
                            ? `${Math?.min(100, (parseInt(card?.value) / Math?.max(1, stats?.totalProducts || 1)) * 100)}%`
                            : '100%'
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>{stats?.totalProducts || 0}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StockLevelCards;