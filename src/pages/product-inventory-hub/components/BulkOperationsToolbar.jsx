import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const BulkOperationsToolbar = ({ selectedCount, onBulkAction, onClearSelection }) => {
  const [activeOperation, setActiveOperation] = useState(null);
  const [operationData, setOperationData] = useState({});

  const bulkOperations = [
    {
      id: 'update_price',
      label: 'Update Prices',
      icon: 'DollarSign',
      description: 'Bulk update product prices'
    },
    {
      id: 'update_category',
      label: 'Change Category',
      icon: 'Tag',
      description: 'Move products to different category'
    },
    {
      id: 'update_stock',
      label: 'Update Stock',
      icon: 'Package',
      description: 'Bulk update stock quantities'
    },
    {
      id: 'export',
      label: 'Export Data',
      icon: 'Download',
      description: 'Export selected products'
    },
    {
      id: 'delete',
      label: 'Delete Products',
      icon: 'Trash2',
      description: 'Remove selected products',
      variant: 'destructive'
    }
  ];

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Apparel' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books & Media' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'toys', label: 'Toys & Games' }
  ];

  const exportFormatOptions = [
    { value: 'csv', label: 'CSV Format' },
    { value: 'excel', label: 'Excel Format' },
    { value: 'json', label: 'JSON Format' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const priceUpdateOptions = [
    { value: 'increase_percent', label: 'Increase by %' },
    { value: 'decrease_percent', label: 'Decrease by %' },
    { value: 'increase_amount', label: 'Increase by Amount' },
    { value: 'decrease_amount', label: 'Decrease by Amount' },
    { value: 'set_price', label: 'Set Fixed Price' }
  ];

  const stockUpdateOptions = [
    { value: 'add', label: 'Add to Current Stock' },
    { value: 'subtract', label: 'Subtract from Stock' },
    { value: 'set', label: 'Set Stock Quantity' }
  ];

  const handleOperationSelect = (operation) => {
    setActiveOperation(operation);
    setOperationData({});
  };

  const handleExecuteOperation = () => {
    if (!activeOperation) return;

    onBulkAction(activeOperation?.id, operationData);
    setActiveOperation(null);
    setOperationData({});
  };

  const renderOperationForm = () => {
    if (!activeOperation) return null;

    switch (activeOperation?.id) {
      case 'update_price':
        return (
          <div className="flex items-center space-x-3">
            <Select
              options={priceUpdateOptions}
              value={operationData?.type || ''}
              onChange={(value) => setOperationData({ ...operationData, type: value })}
              placeholder="Select action"
              className="min-w-48"
            />
            <Input
              type="number"
              placeholder="Value"
              value={operationData?.value || ''}
              onChange={(e) => setOperationData({ ...operationData, value: e?.target?.value })}
              className="w-32"
            />
            {operationData?.type?.includes('percent') && (
              <span className="text-sm text-muted-foreground">%</span>
            )}
            {operationData?.type?.includes('amount') && (
              <span className="text-sm text-muted-foreground">$</span>
            )}
          </div>
        );

      case 'update_category':
        return (
          <Select
            options={categoryOptions}
            value={operationData?.category || ''}
            onChange={(value) => setOperationData({ ...operationData, category: value })}
            placeholder="Select new category"
            className="min-w-48"
          />
        );

      case 'update_stock':
        return (
          <div className="flex items-center space-x-3">
            <Select
              options={stockUpdateOptions}
              value={operationData?.type || ''}
              onChange={(value) => setOperationData({ ...operationData, type: value })}
              placeholder="Select action"
              className="min-w-48"
            />
            <Input
              type="number"
              placeholder="Quantity"
              value={operationData?.quantity || ''}
              onChange={(e) => setOperationData({ ...operationData, quantity: e?.target?.value })}
              className="w-32"
            />
            <span className="text-sm text-muted-foreground">units</span>
          </div>
        );

      case 'export':
        return (
          <Select
            options={exportFormatOptions}
            value={operationData?.format || 'csv'}
            onChange={(value) => setOperationData({ ...operationData, format: value })}
            placeholder="Export format"
            className="min-w-48"
          />
        );

      case 'delete':
        return (
          <div className="flex items-center space-x-3">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm text-error">
              This action cannot be undone. {selectedCount} products will be permanently deleted.
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-4 mb-6 border-l-4 border-l-primary"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="CheckSquare" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose a bulk operation to apply to selected products
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          iconName="X"
          iconPosition="left"
        >
          Clear Selection
        </Button>
      </div>
      {/* Operation Selection */}
      {!activeOperation && (
        <div className="flex flex-wrap gap-2">
          {bulkOperations?.map((operation) => (
            <Button
              key={operation?.id}
              variant={operation?.variant || 'outline'}
              size="sm"
              onClick={() => handleOperationSelect(operation)}
              iconName={operation?.icon}
              iconPosition="left"
            >
              {operation?.label}
            </Button>
          ))}
        </div>
      )}
      {/* Operation Form */}
      <AnimatePresence>
        {activeOperation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border/50 pt-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Icon name={activeOperation?.icon} size={16} />
                  <span className="font-medium text-foreground">{activeOperation?.label}</span>
                </div>
                {renderOperationForm()}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveOperation(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant={activeOperation?.variant || 'default'}
                  size="sm"
                  onClick={handleExecuteOperation}
                  disabled={
                    (activeOperation?.id === 'update_price' && (!operationData?.type || !operationData?.value)) ||
                    (activeOperation?.id === 'update_category' && !operationData?.category) ||
                    (activeOperation?.id === 'update_stock' && (!operationData?.type || !operationData?.quantity))
                  }
                >
                  Apply to {selectedCount} Product{selectedCount !== 1 ? 's' : ''}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BulkOperationsToolbar;