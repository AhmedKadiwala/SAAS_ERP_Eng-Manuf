import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const BulkOperations = ({ selectedCount, onBulkOperation, selectedProducts }) => {
  const [showOperations, setShowOperations] = useState(false);
  const [activeOperation, setActiveOperation] = useState(null);
  const [operationData, setOperationData] = useState({});

  const operations = [
    {
      id: 'updateMinStock',
      label: 'Update Min Stock Level',
      description: 'Set minimum stock level for selected products',
      icon: 'BarChart3',
      color: 'blue',
      requiresInput: true,
      inputType: 'number',
      inputLabel: 'Minimum Stock Level',
      inputPlaceholder: 'Enter minimum stock level'
    },
    {
      id: 'adjustStock',
      label: 'Adjust Stock Quantity',
      description: 'Increase or decrease stock for selected products',
      icon: 'Package',
      color: 'green',
      requiresInput: true,
      inputType: 'number',
      inputLabel: 'Stock Adjustment',
      inputPlaceholder: 'Enter quantity (+/-)'
    },
    {
      id: 'changeCategory',
      label: 'Change Category',
      description: 'Update category for selected products',
      icon: 'Tag',
      color: 'purple',
      requiresInput: true,
      inputType: 'select',
      inputLabel: 'Category',
      options: ['software', 'hardware', 'service', 'consulting', 'other']
    },
    {
      id: 'toggleActive',
      label: 'Toggle Active Status',
      description: 'Enable or disable selected products',
      icon: 'ToggleLeft',
      color: 'orange',
      requiresInput: false
    },
    {
      id: 'export',
      label: 'Export Selected',
      description: 'Export data for selected products',
      icon: 'Download',
      color: 'indigo',
      requiresInput: false
    }
  ];

  const handleOperationSelect = (operation) => {
    if (operation?.requiresInput) {
      setActiveOperation(operation);
    } else {
      executeOperation(operation?.id, {});
    }
  };

  const executeOperation = (operationId, data) => {
    onBulkOperation?.(operationId, selectedProducts, data);
    setActiveOperation(null);
    setOperationData({});
    setShowOperations(false);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      green: 'bg-green-500/10 text-green-600 border-green-500/20',
      purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      orange: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      indigo: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20'
    };
    return colors?.[color] || colors?.blue;
  };

  return (
    <div className="relative">
      {/* Bulk Operations Trigger */}
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={() => setShowOperations(!showOperations)}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
      >
        <Icon name="Settings" size={16} />
        <span>Bulk Actions</span>
        <span className="ml-2 px-2 py-0.5 bg-primary-foreground/20 rounded-full text-xs">
          {selectedCount}
        </span>
      </motion.button>
      {/* Operations Dropdown */}
      <AnimatePresence>
        {showOperations && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-80 glass-card shadow-floating border border-border/50 z-50"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Bulk Operations</h3>
                <button
                  onClick={() => setShowOperations(false)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>

              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{selectedCount}</span> products selected
                </p>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {operations?.map((operation) => (
                  <button
                    key={operation?.id}
                    onClick={() => handleOperationSelect(operation)}
                    className={`w-full p-3 rounded-lg border text-left hover:shadow-sm transition-all ${getColorClasses(operation?.color)}`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon name={operation?.icon} size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{operation?.label}</p>
                        <p className="text-xs opacity-80">{operation?.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Operation Input Modal */}
      <AnimatePresence>
        {activeOperation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setActiveOperation(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="glass-card max-w-md w-full p-6"
              onClick={(e) => e?.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(activeOperation?.color)}`}>
                  <Icon name={activeOperation?.icon} size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{activeOperation?.label}</h3>
                  <p className="text-sm text-muted-foreground">{activeOperation?.description}</p>
                </div>
              </div>

              <div className="mb-6 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This will affect <span className="font-medium text-foreground">{selectedCount}</span> selected products
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {activeOperation?.inputLabel}
                  </label>
                  
                  {activeOperation?.inputType === 'select' ? (
                    <select
                      value={operationData?.value || ''}
                      onChange={(e) => setOperationData({ ...operationData, value: e?.target?.value })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select category...</option>
                      {activeOperation?.options?.map((option) => (
                        <option key={option} value={option}>
                          {option?.charAt(0)?.toUpperCase() + option?.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={activeOperation?.inputType}
                      value={operationData?.value || ''}
                      onChange={(e) => setOperationData({ ...operationData, value: e?.target?.value })}
                      placeholder={activeOperation?.inputPlaceholder}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  )}
                </div>

                {activeOperation?.id === 'updateMinStock' && (
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Icon name="Info" size={16} />
                      <p className="text-sm">
                        This will update the minimum stock level threshold for alerts
                      </p>
                    </div>
                  </div>
                )}

                {activeOperation?.id === 'adjustStock' && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-600">
                      <Icon name="Info" size={16} />
                      <p className="text-sm">
                        Use positive numbers to increase stock, negative to decrease
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Reason (Optional)
                  </label>
                  <input
                    type="text"
                    value={operationData?.reason || ''}
                    onChange={(e) => setOperationData({ ...operationData, reason: e?.target?.value })}
                    placeholder="Enter reason for this change..."
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setActiveOperation(null)}
                  className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeOperation(activeOperation?.id, operationData)}
                  disabled={activeOperation?.inputType === 'select' ? !operationData?.value : activeOperation?.requiresInput && !operationData?.value}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BulkOperations;