import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../components/AppIcon';
import { inventoryService } from '../../services/inventoryService';
import StockLevelCards from './components/StockLevelCards';
import AlertsPanel from './components/AlertsPanel';
import BulkOperations from './components/BulkOperations';
import StockAdjustmentModal from './components/StockAdjustmentModal';
import ReorderSuggestions from './components/ReorderSuggestions';

const StockLevelDashboardWithAlerts = () => {
  const [inventory, setInventory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    stockStatus: 'all',
    search: '',
    sortBy: 'updated_at'
  });
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadInventoryData();
    
    // Set up real-time subscription
    const unsubscribe = inventoryService?.subscribeToInventoryUpdates(() => {
      loadInventoryData();
    });

    return () => unsubscribe?.();
  }, [filters]);

  const loadInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [inventoryResult, alertsResult, statsResult] = await Promise.all([
        inventoryService?.getInventoryOverview(filters),
        inventoryService?.getStockAlerts(),
        inventoryService?.getInventoryStats()
      ]);

      if (inventoryResult?.error) {
        throw inventoryResult?.error;
      }

      setInventory(inventoryResult?.data || []);
      setAlerts(alertsResult?.data || []);
      setStats(statsResult?.data);

    } catch (err) {
      console.error('Error loading inventory data:', err);
      setError(err?.message || 'Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async (productId, newQuantity, reason) => {
    try {
      let result = await inventoryService?.updateStock(productId, newQuantity, reason);
      if (result?.error) {
        throw result?.error;
      }

      // Refresh data
      loadInventoryData();
      setShowAdjustmentModal(false);
      setSelectedProduct(null);

    } catch (err) {
      console.error('Error adjusting stock:', err);
      setError(err?.message || 'Failed to adjust stock');
    }
  };

  const handleBulkOperation = async (operation, productIds, data) => {
    try {
      let result;
      switch (operation) {
        case 'updateMinStock':
          const updates = productIds?.map(id => ({
            productId: id,
            minStock: data?.minStock
          }));
          result = await inventoryService?.bulkUpdateMinStock(updates);
          break;
        default:
          throw new Error('Unknown bulk operation');
      }

      if (result?.error) {
        throw result?.error;
      }

      // Refresh data and clear selection
      loadInventoryData();
      setSelectedProducts([]);

    } catch (err) {
      console.error('Error performing bulk operation:', err);
      setError(err?.message || 'Failed to perform bulk operation');
    }
  };

  const handleExport = async () => {
    try {
      let result = await inventoryService?.exportInventoryData('json');
      if (result?.data) {
        // Create download link
        const blob = new Blob([result?.data], { type: 'application/json' });
        const url = URL?.createObjectURL(blob);
        const link = document?.createElement('a');
        link.href = url;
        link.download = result?.filename;
        document?.body?.appendChild(link);
        link?.click();
        document?.body?.removeChild(link);
        URL?.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error exporting inventory:', err);
      setError('Failed to export inventory data');
    }
  };

  const getStockStatusColor = (product) => {
    if (!product?.is_active) return 'text-gray-500';
    if (product?.stock_quantity === 0) return 'text-red-500';
    if (product?.stock_quantity <= product?.min_stock_level) return 'text-orange-500';
    return 'text-green-500';
  };

  const getStockStatusIcon = (product) => {
    if (!product?.is_active) return 'Pause';
    if (product?.stock_quantity === 0) return 'AlertCircle';
    if (product?.stock_quantity <= product?.min_stock_level) return 'AlertTriangle';
    return 'CheckCircle';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'alerts', label: 'Alerts', icon: 'AlertTriangle', badge: alerts?.length },
    { id: 'reorder', label: 'Reorder', icon: 'ShoppingCart' },
    { id: 'history', label: 'History', icon: 'Clock' }
  ];

  const categories = ['all', 'software', 'hardware', 'service', 'consulting', 'other'];

  if (loading && !inventory?.length) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading inventory data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-card/95">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Stock Level Dashboard</h1>
              <p className="text-muted-foreground">Real-time inventory monitoring with automated alerts</p>
            </div>

            <div className="flex items-center space-x-4">
              {selectedProducts?.length > 0 && (
                <BulkOperations 
                  selectedCount={selectedProducts?.length}
                  onBulkOperation={handleBulkOperation}
                  selectedProducts={selectedProducts}
                />
              )}
              
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center space-x-2"
              >
                <Icon name="Download" size={16} />
                <span>Export</span>
              </button>
              
              <button
                onClick={loadInventoryData}
                disabled={loading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <Icon name={loading ? "Loader2" : "RefreshCw"} size={16} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mt-4">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
                {tab?.badge > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {tab?.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Error Display */}
      {error && (
        <div className="container mx-auto px-6 py-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center space-x-3">
            <Icon name="AlertCircle" className="text-destructive" size={20} />
            <p className="text-destructive">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-destructive hover:text-destructive/80"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
      {/* Content Area */}
      <div className="container mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            {stats && (
              <StockLevelCards 
                stats={stats}
                alerts={alerts}
              />
            )}

            {/* Filters */}
            <div className="glass-card p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="relative">
                    <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={filters?.search}
                      onChange={(e) => setFilters(prev => ({ ...prev, search: e?.target?.value }))}
                      className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filters?.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e?.target?.value }))}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {categories?.slice(1)?.map(category => (
                      <option key={category} value={category}>
                        {category?.charAt(0)?.toUpperCase() + category?.slice(1)}
                      </option>
                    ))}
                  </select>
                  
                  <select
                    value={filters?.stockStatus}
                    onChange={(e) => setFilters(prev => ({ ...prev, stockStatus: e?.target?.value }))}
                    className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="all">All Stock Levels</option>
                    <option value="normal">Normal Stock</option>
                    <option value="low">Low Stock</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {inventory?.length} products
                  </span>
                </div>
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inventory?.map((product, index) => (
                <motion.div
                  key={product?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card group hover:shadow-elevated transition-all duration-300"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts?.includes(product?.id)}
                          onChange={(e) => {
                            if (e?.target?.checked) {
                              setSelectedProducts(prev => [...prev, product?.id]);
                            } else {
                              setSelectedProducts(prev => prev?.filter(id => id !== product?.id));
                            }
                          }}
                          className="rounded border-border focus:ring-primary"
                        />
                        <Icon 
                          name={getStockStatusIcon(product)} 
                          className={getStockStatusColor(product)} 
                          size={20} 
                        />
                      </div>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowAdjustmentModal(true);
                        }}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Icon name="Edit" size={16} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-foreground mb-1 line-clamp-2">
                        {product?.name}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>SKU: {product?.sku || 'N/A'}</span>
                        <span className="px-2 py-1 bg-muted rounded-md">
                          {product?.category?.charAt(0)?.toUpperCase() + product?.category?.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Stock Level */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Current Stock</span>
                        <span className={`text-lg font-bold ${getStockStatusColor(product)}`}>
                          {product?.stock_quantity?.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            product?.stock_quantity === 0 
                              ? 'bg-red-500' 
                              : product?.stock_quantity <= product?.min_stock_level
                                ? 'bg-orange-500' :'bg-green-500'
                          }`}
                          style={{
                            width: `${Math?.min(100, (product?.stock_quantity / (product?.min_stock_level * 2)) * 100)}%`
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Min: {product?.min_stock_level}</span>
                        <span>
                          {product?.stock_quantity === 0 
                            ? 'Out of Stock'
                            : product?.stock_quantity <= product?.min_stock_level
                              ? 'Low Stock' :'Normal'
                          }
                        </span>
                      </div>
                    </div>

                    {/* Value */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Value</span>
                      <span className="font-medium text-foreground">
                        ${(parseFloat(product?.price || 0) * parseInt(product?.stock_quantity || 0))?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {inventory?.length === 0 && !loading && (
              <div className="text-center py-12">
                <Icon name="Package" className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  {filters?.search || filters?.category !== 'all' || filters?.stockStatus !== 'all' ?'Try adjusting your filters' :'No inventory items available'
                  }
                </p>
              </div>
            )}

            {/* Analytics Charts */}
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-6">Category Breakdown</h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats?.categoryBreakdown?.map(([category, count]) => ({
                            name: category?.charAt(0)?.toUpperCase() + category?.slice(1),
                            value: count,
                            alt: `${category} category: ${count} products`
                          })) || []}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {(stats?.categoryBreakdown || [])?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Stock Value Trend */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-6">Stock Value Trend</h3>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats?.stockValueTrend || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                          tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}K`}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload?.[0]) {
                              return (
                                <div className="glass-card p-3 shadow-floating border border-border/50">
                                  <p className="text-sm font-medium text-foreground">{label}</p>
                                  <p className="text-sm text-primary">
                                    Value: ${payload?.[0]?.value?.toLocaleString()}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <AlertsPanel 
            alerts={alerts}
            onRefresh={loadInventoryData}
          />
        )}

        {activeTab === 'reorder' && (
          <ReorderSuggestions 
            onRefresh={loadInventoryData}
          />
        )}

        {activeTab === 'history' && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Stock Movement History</h3>
            <p className="text-muted-foreground">Stock movement history will be displayed here.</p>
          </div>
        )}
      </div>
      {/* Stock Adjustment Modal */}
      {showAdjustmentModal && selectedProduct && (
        <StockAdjustmentModal
          product={selectedProduct}
          onAdjust={handleStockAdjustment}
          onClose={() => {
            setShowAdjustmentModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default StockLevelDashboardWithAlerts;