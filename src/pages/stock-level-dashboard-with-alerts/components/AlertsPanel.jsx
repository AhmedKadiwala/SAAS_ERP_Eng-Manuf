import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { inventoryService } from '../../../services/inventoryService';

const AlertsPanel = ({ alerts, onRefresh }) => {
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [sortBy, setSortBy] = useState('severity');
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  useEffect(() => {
    let filtered = alerts?.filter(alert => !dismissedAlerts?.has(alert?.id)) || [];

    // Filter by severity
    if (filterSeverity !== 'all') {
      filtered = filtered?.filter(alert => alert?.severity === filterSeverity);
    }

    // Sort alerts
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'severity':
          const severityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
          return severityOrder?.[a?.severity] - severityOrder?.[b?.severity];
        case 'stock':
          return a?.stock_quantity - b?.stock_quantity;
        case 'name':
          return a?.name?.localeCompare(b?.name);
        default:
          return 0;
      }
    });

    setFilteredAlerts(filtered);
  }, [alerts, filterSeverity, sortBy, dismissedAlerts]);

  const handleDismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const handleResolveAlert = async (product) => {
    try {
      // Update stock to minimum level + buffer
      const newQuantity = product?.min_stock_level + Math?.ceil(product?.min_stock_level * 0.5);
      
      const result = await inventoryService?.updateStock(
        product?.id, 
        newQuantity, 
        'alert_resolution'
      );
      
      if (result?.error) {
        throw result?.error;
      }

      // Refresh data
      onRefresh?.();
      handleDismissAlert(product?.id);
      
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          text: 'text-red-600',
          icon: 'text-red-500',
          dot: 'bg-red-500'
        };
      case 'high':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/20',
          text: 'text-orange-600',
          icon: 'text-orange-500',
          dot: 'bg-orange-500'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20',
          text: 'text-yellow-600',
          icon: 'text-yellow-500',
          dot: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          text: 'text-blue-600',
          icon: 'text-blue-500',
          dot: 'bg-blue-500'
        };
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return 'AlertCircle';
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertTriangle';
      default:
        return 'Info';
    }
  };

  const severityOptions = [
    { value: 'all', label: 'All Alerts', count: alerts?.length || 0 },
    { 
      value: 'critical', 
      label: 'Critical', 
      count: alerts?.filter(a => a?.severity === 'critical')?.length || 0 
    },
    { 
      value: 'high', 
      label: 'High', 
      count: alerts?.filter(a => a?.severity === 'high')?.length || 0 
    },
    { 
      value: 'medium', 
      label: 'Medium', 
      count: alerts?.filter(a => a?.severity === 'medium')?.length || 0 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {severityOptions?.map((option, index) => (
          <motion.div
            key={option?.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 cursor-pointer hover:shadow-elevated transition-all"
            onClick={() => setFilterSeverity(option?.value)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{option?.label}</p>
                <p className="text-2xl font-bold text-foreground">{option?.count}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                option?.value === 'all' ?'bg-primary/10' 
                  : getSeverityColor(option?.value)?.bg
              }`}>
                <Icon 
                  name={option?.value === 'all' ? 'Bell' : getSeverityIcon(option?.value)} 
                  size={24}
                  className={option?.value === 'all' ? 'text-primary' : getSeverityColor(option?.value)?.icon}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Filters and Controls */}
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {severityOptions?.map((option) => (
                <option key={option?.value} value={option?.value}>
                  {option?.label} ({option?.count})
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="severity">Sort by Severity</option>
              <option value="stock">Sort by Stock Level</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setDismissedAlerts(new Set())}
              className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center space-x-2"
            >
              <Icon name="RefreshCw" size={16} />
              <span>Show All</span>
            </button>
            
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
            >
              <Icon name="RefreshCw" size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts?.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Icon name="CheckCircle" className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">All Clear!</h3>
            <p className="text-muted-foreground">
              {filterSeverity === 'all' ?'No stock alerts at this time' 
                : `No ${filterSeverity} priority alerts`
              }
            </p>
          </div>
        ) : (
          filteredAlerts?.map((alert, index) => {
            const colorClasses = getSeverityColor(alert?.severity);
            
            return (
              <motion.div
                key={alert?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`glass-card border-l-4 ${colorClasses?.border} ${colorClasses?.bg} hover:shadow-elevated transition-all duration-300`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Alert Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses?.bg} border ${colorClasses?.border}`}>
                        <Icon 
                          name={getSeverityIcon(alert?.severity)} 
                          className={colorClasses?.icon} 
                          size={20} 
                        />
                      </div>
                      
                      {/* Alert Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{alert?.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses?.bg} ${colorClasses?.text}`}>
                            {alert?.severity?.toUpperCase()}
                          </span>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{alert?.message}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Current Stock:</span>
                            <span className={`ml-2 font-medium ${colorClasses?.text}`}>
                              {alert?.stock_quantity?.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Min Level:</span>
                            <span className="ml-2 font-medium text-foreground">
                              {alert?.min_stock_level?.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <span className="ml-2 font-medium text-foreground">
                              {alert?.category?.charAt(0)?.toUpperCase() + alert?.category?.slice(1)}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">SKU:</span>
                            <span className="ml-2 font-medium text-foreground">
                              {alert?.sku || 'N/A'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Stock Progress Bar */}
                        <div className="mt-4">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                alert?.stock_quantity === 0 
                                  ? 'bg-red-500' 
                                  : alert?.severity === 'critical' ?'bg-red-500'
                                    : alert?.severity === 'high' ?'bg-orange-500' :'bg-yellow-500'
                              }`}
                              style={{
                                width: `${Math?.max(5, Math?.min(100, (alert?.stock_quantity / alert?.min_stock_level) * 100))}%`
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0</span>
                            <span>Target: {alert?.min_stock_level}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {alert?.severity === 'critical' && (
                        <button
                          onClick={() => handleResolveAlert(alert)}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm flex items-center space-x-1"
                        >
                          <Icon name="Zap" size={14} />
                          <span>Quick Fix</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDismissAlert(alert?.id)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="Dismiss Alert"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
      {/* Alert Actions Footer */}
      {filteredAlerts?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              {filteredAlerts?.length} active alert{filteredAlerts?.length !== 1 ? 's' : ''} 
              {dismissedAlerts?.size > 0 && ` (${dismissedAlerts?.size} dismissed)`}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  // Bulk resolve critical alerts
                  const criticalAlerts = filteredAlerts?.filter(alert => alert?.severity === 'critical');
                  criticalAlerts?.forEach(alert => handleResolveAlert(alert));
                }}
                disabled={!filteredAlerts?.some(alert => alert?.severity === 'critical')}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Icon name="Zap" size={16} />
                <span>Resolve Critical</span>
              </button>
              
              <button
                onClick={() => {
                  filteredAlerts?.forEach(alert => handleDismissAlert(alert?.id));
                }}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center space-x-2"
              >
                <Icon name="EyeOff" size={16} />
                <span>Dismiss All</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AlertsPanel;