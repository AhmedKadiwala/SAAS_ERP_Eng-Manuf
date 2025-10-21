import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { inventoryService } from '../../../services/inventoryService';

const ReorderSuggestions = ({ onRefresh }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [sortBy, setSortBy] = useState('priority');

  useEffect(() => {
    loadReorderSuggestions();
  }, []);

  const loadReorderSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await inventoryService?.getReorderSuggestions();
      if (result?.error) {
        throw result?.error;
      }

      let sortedSuggestions = result?.data || [];
      
      // Sort suggestions
      switch (sortBy) {
        case 'priority':
          sortedSuggestions?.sort((a, b) => {
            const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
            return priorityOrder?.[a?.priority] - priorityOrder?.[b?.priority];
          });
          break;
        case 'cost':
          sortedSuggestions?.sort((a, b) => (b?.reorderCost || 0) - (a?.reorderCost || 0));
          break;
        case 'stock':
          sortedSuggestions?.sort((a, b) => a?.stock_quantity - b?.stock_quantity);
          break;
        case 'name':
          sortedSuggestions?.sort((a, b) => a?.name?.localeCompare(b?.name));
          break;
      }

      setSuggestions(sortedSuggestions);

    } catch (err) {
      console.error('Error loading reorder suggestions:', err);
      setError(err?.message || 'Failed to load reorder suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestionId, selected) => {
    if (selected) {
      setSelectedSuggestions(prev => [...prev, suggestionId]);
    } else {
      setSelectedSuggestions(prev => prev?.filter(id => id !== suggestionId));
    }
  };

  const handleSelectAll = () => {
    if (selectedSuggestions?.length === suggestions?.length) {
      setSelectedSuggestions([]);
    } else {
      setSelectedSuggestions(suggestions?.map(s => s?.id));
    }
  };

  const handleBulkReorder = async () => {
    const selectedItems = suggestions?.filter(s => selectedSuggestions?.includes(s?.id));
    const totalCost = selectedItems?.reduce((sum, item) => sum + (item?.reorderCost || 0), 0);
    
    if (window?.confirm(`Reorder ${selectedItems?.length} products for $${totalCost?.toLocaleString()}?`)) {
      // Implementation would handle actual reorder process
      console.log('Bulk reorder:', selectedItems);
      
      // Reset selections
      setSelectedSuggestions([]);
      onRefresh?.();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return 'AlertCircle';
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'Clock';
      default:
        return 'Info';
    }
  };

  const totalReorderCost = selectedSuggestions?.reduce((sum, id) => {
    const suggestion = suggestions?.find(s => s?.id === id);
    return sum + (suggestion?.reorderCost || 0);
  }, 0);

  if (loading) {
    return (
      <div className="glass-card p-12 text-center">
        <Icon name="Loader2" className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Loading reorder suggestions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-12 text-center">
        <Icon name="AlertCircle" className="h-8 w-8 text-destructive mx-auto mb-4" />
        <p className="text-destructive mb-4">{error}</p>
        <button
          onClick={loadReorderSuggestions}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Reorder Suggestions</h2>
          <p className="text-muted-foreground">
            {suggestions?.length} products need reordering
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e?.target?.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="priority">Sort by Priority</option>
            <option value="cost">Sort by Cost</option>
            <option value="stock">Sort by Stock Level</option>
            <option value="name">Sort by Name</option>
          </select>
          
          <button
            onClick={loadReorderSuggestions}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center space-x-2"
          >
            <Icon name="RefreshCw" size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertCircle" className="text-red-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {suggestions?.filter(s => s?.priority === 'critical')?.length}
              </p>
              <p className="text-sm text-muted-foreground">Critical</p>
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
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <Icon name="AlertTriangle" className="text-orange-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {suggestions?.filter(s => s?.priority === 'high')?.length}
              </p>
              <p className="text-sm text-muted-foreground">High Priority</p>
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
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                ${suggestions?.reduce((sum, s) => sum + (s?.reorderCost || 0), 0)?.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Cost</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Icon name="ShoppingCart" className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{selectedSuggestions?.length}</p>
              <p className="text-sm text-muted-foreground">Selected</p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Bulk Actions */}
      {selectedSuggestions?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {selectedSuggestions?.length} items selected
              </span>
              <span className="text-sm font-medium text-foreground">
                Total cost: ${totalReorderCost?.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedSuggestions([])}
                className="px-3 py-1.5 text-sm bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Clear Selection
              </button>
              
              <button
                onClick={handleBulkReorder}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <Icon name="ShoppingCart" size={16} />
                <span>Bulk Reorder</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
      {/* Suggestions List */}
      {suggestions?.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Icon name="CheckCircle" className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">All Stock Levels Good!</h3>
          <p className="text-muted-foreground">No products need reordering at this time</p>
        </div>
      ) : (
        <div className="glass-card">
          {/* Table Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedSuggestions?.length === suggestions?.length}
                onChange={handleSelectAll}
                className="rounded border-border focus:ring-primary"
              />
              <span className="text-sm font-medium text-foreground">Select All</span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="divide-y divide-border">
            {suggestions?.map((suggestion, index) => (
              <motion.div
                key={suggestion?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedSuggestions?.includes(suggestion?.id)}
                    onChange={(e) => handleSelectSuggestion(suggestion?.id, e?.target?.checked)}
                    className="mt-1 rounded border-border focus:ring-primary"
                  />

                  {/* Priority */}
                  <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getPriorityColor(suggestion?.priority)}`}>
                    <div className="flex items-center space-x-1">
                      <Icon name={getPriorityIcon(suggestion?.priority)} size={12} />
                      <span>{suggestion?.priority?.toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{suggestion?.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>SKU: {suggestion?.sku || 'N/A'}</span>
                          <span>Category: {suggestion?.category?.charAt(0)?.toUpperCase() + suggestion?.category?.slice(1)}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          ${suggestion?.reorderCost?.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Reorder cost</p>
                      </div>
                    </div>

                    {/* Stock Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current Stock:</span>
                        <span className={`ml-2 font-medium ${
                          suggestion?.stock_quantity === 0 ? 'text-red-500' : 'text-orange-500'
                        }`}>
                          {suggestion?.stock_quantity?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Min Level:</span>
                        <span className="ml-2 font-medium text-foreground">
                          {suggestion?.min_stock_level?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Suggested Qty:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {suggestion?.suggestedQuantity?.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Unit Cost:</span>
                        <span className="ml-2 font-medium text-foreground">
                          ${(suggestion?.reorderCost / suggestion?.suggestedQuantity)?.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Stock Progress */}
                    <div className="mb-4">
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            suggestion?.stock_quantity === 0 
                              ? 'bg-red-500' :'bg-orange-500'
                          }`}
                          style={{
                            width: `${Math?.max(5, Math?.min(100, (suggestion?.stock_quantity / suggestion?.min_stock_level) * 100))}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0</span>
                        <span>Target: {suggestion?.min_stock_level}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          // Handle individual reorder
                          console.log('Reorder:', suggestion);
                        }}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
                      >
                        <Icon name="ShoppingCart" size={16} />
                        <span>Reorder Now</span>
                      </button>
                      
                      <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center space-x-2">
                        <Icon name="Edit" size={16} />
                        <span>Adjust Quantity</span>
                      </button>
                      
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                        <Icon name="MoreHorizontal" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReorderSuggestions;