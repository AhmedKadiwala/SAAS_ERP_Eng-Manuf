import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const DataSourcePanel = ({ analytics, onSourceSelect, onRefresh }) => {
  const [connectionStatus, setConnectionStatus] = useState({});
  const [refreshing, setRefreshing] = useState({});

  const dataSources = [
    {
      id: 'invoices',
      name: 'Invoice Data',
      description: 'Revenue, billing, and payment information',
      icon: 'Receipt',
      type: 'database',
      records: analytics?.revenue?.summary?.totalInvoices || 0,
      lastSync: '2 minutes ago',
      status: 'connected',
      fields: ['invoice_number', 'total_amount', 'status', 'issue_date', 'customer_id']
    },
    {
      id: 'customers',
      name: 'Customer Data', 
      description: 'Customer profiles, demographics, and relationships',
      icon: 'Users',
      type: 'database',
      records: analytics?.overview?.customers || 0,
      lastSync: '1 minute ago',
      status: 'connected',
      fields: ['company_name', 'industry', 'status', 'relationship_score', 'total_value']
    },
    {
      id: 'products',
      name: 'Product Data',
      description: 'Inventory, pricing, and product performance',
      icon: 'Package',
      type: 'database', 
      records: analytics?.overview?.products?.total || 0,
      lastSync: '3 minutes ago',
      status: 'connected',
      fields: ['name', 'category', 'price', 'stock_quantity', 'min_stock_level']
    },
    {
      id: 'activities',
      name: 'Activity Data',
      description: 'User actions, system events, and audit logs',
      icon: 'Activity',
      type: 'database',
      records: analytics?.overview?.activities?.length || 0,
      lastSync: '30 seconds ago',
      status: 'connected',
      fields: ['title', 'activity_type', 'user_id', 'related_type', 'created_at']
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Web traffic and user behavior data',
      icon: 'BarChart3',
      type: 'external',
      records: 0,
      lastSync: 'Never',
      status: 'disconnected',
      fields: ['sessions', 'pageviews', 'bounce_rate', 'conversion_rate']
    },
    {
      id: 'stripe',
      name: 'Stripe Payments',
      description: 'Payment transactions and subscription data',
      icon: 'CreditCard',
      type: 'external',
      records: 0,
      lastSync: 'Never', 
      status: 'disconnected',
      fields: ['amount', 'currency', 'status', 'customer_id', 'created']
    }
  ];

  useEffect(() => {
    // Initialize connection status
    const status = {};
    dataSources?.forEach(source => {
      status[source?.id] = source?.status;
    });
    setConnectionStatus(status);
  }, []);

  const handleRefreshSource = async (sourceId) => {
    setRefreshing(prev => ({ ...prev, [sourceId]: true }));
    
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update last sync time
      const sourceIndex = dataSources?.findIndex(s => s?.id === sourceId);
      if (sourceIndex !== -1) {
        dataSources[sourceIndex].lastSync = 'Just now';
      }
      
      onRefresh?.(sourceId);
    } catch (error) {
      console.error('Error refreshing source:', error);
    } finally {
      setRefreshing(prev => ({ ...prev, [sourceId]: false }));
    }
  };

  const handleToggleConnection = (sourceId) => {
    setConnectionStatus(prev => ({
      ...prev,
      [sourceId]: prev?.[sourceId] === 'connected' ? 'disconnected' : 'connected'
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-green-500';
      case 'disconnected':
        return 'text-gray-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'disconnected':
        return 'XCircle';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Clock';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Data Sources</h2>
          <p className="text-muted-foreground">Manage and monitor your data connections</p>
        </div>
        
        <button
          onClick={() => onRefresh?.('all')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <Icon name="RefreshCw" size={16} />
          <span>Refresh All</span>
        </button>
      </div>
      {/* Connection Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {Object?.values(connectionStatus)?.filter(status => status === 'connected')?.length}
              </p>
              <p className="text-sm text-muted-foreground">Connected Sources</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Icon name="Database" className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {dataSources?.reduce((sum, source) => sum + (source?.records || 0), 0)?.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Icon name="Clock" className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Real-time</p>
              <p className="text-sm text-muted-foreground">Sync Status</p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Data Sources List */}
      <div className="space-y-4">
        {dataSources?.map((source, index) => (
          <motion.div
            key={source?.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 hover:shadow-elevated transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Icon and Basic Info */}
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                  <Icon name={source?.icon} size={24} className="text-muted-foreground" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground">{source?.name}</h3>
                    <Icon 
                      name={getStatusIcon(connectionStatus?.[source?.id] || source?.status)} 
                      size={16} 
                      className={getStatusColor(connectionStatus?.[source?.id] || source?.status)}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{source?.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <Icon name="Database" size={14} />
                      <span>{source?.records?.toLocaleString()} records</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Clock" size={14} />
                      <span>Last sync: {source?.lastSync}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icon name="Layers" size={14} />
                      <span>{source?.fields?.length} fields</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onSourceSelect?.(source)}
                  className="px-3 py-1.5 text-sm bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  View Fields
                </button>
                
                <button
                  onClick={() => handleRefreshSource(source?.id)}
                  disabled={refreshing?.[source?.id]}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
                >
                  <Icon 
                    name="RefreshCw" 
                    size={16} 
                    className={refreshing?.[source?.id] ? 'animate-spin' : ''}
                  />
                </button>
                
                <button
                  onClick={() => handleToggleConnection(source?.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    connectionStatus?.[source?.id] === 'connected' ?'text-green-500 hover:bg-green-500/10' :'text-gray-500 hover:bg-gray-500/10'
                  }`}
                >
                  <Icon name="Power" size={16} />
                </button>
              </div>
            </div>

            {/* Field Preview */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex flex-wrap gap-2">
                {source?.fields?.slice(0, 5)?.map((field) => (
                  <span
                    key={field}
                    className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md border"
                  >
                    {field}
                  </span>
                ))}
                {source?.fields?.length > 5 && (
                  <span className="px-2 py-1 bg-muted/50 text-muted-foreground text-xs rounded-md border">
                    +{source?.fields?.length - 5} more
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Data Quality Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Data Quality Score</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completeness</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }} />
              </div>
              <span className="text-sm font-medium text-foreground">94%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Accuracy</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
              </div>
              <span className="text-sm font-medium text-foreground">87%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Freshness</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '98%' }} />
              </div>
              <span className="text-sm font-medium text-foreground">98%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DataSourcePanel;