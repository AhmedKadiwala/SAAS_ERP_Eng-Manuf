import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const StockAdjustmentModal = ({ product, onAdjust, onClose }) => {
  const [adjustmentType, setAdjustmentType] = useState('set'); // 'set', 'increase', 'decrease'
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Manual count adjustment',
    'Damaged inventory',
    'Received new stock',
    'Sales adjustment',
    'Transfer to location',
    'Promotional usage',
    'Quality control',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!quantity || isNaN(quantity)) return;

    setIsSubmitting(true);

    try {
      let finalQuantity = parseInt(quantity);
      
      // Calculate final quantity based on adjustment type
      switch (adjustmentType) {
        case 'increase':
          finalQuantity = product?.stock_quantity + finalQuantity;
          break;
        case 'decrease':
          finalQuantity = Math?.max(0, product?.stock_quantity - finalQuantity);
          break;
        case 'set':
        default:
          // finalQuantity is already correct
          break;
      }

      await onAdjust?.(product?.id, finalQuantity, reason || 'Manual adjustment');
    } catch (error) {
      console.error('Error adjusting stock:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNewQuantity = () => {
    if (!quantity || isNaN(quantity)) return product?.stock_quantity;
    
    const qty = parseInt(quantity);
    switch (adjustmentType) {
      case 'increase':
        return product?.stock_quantity + qty;
      case 'decrease':
        return Math?.max(0, product?.stock_quantity - qty);
      case 'set':
      default:
        return qty;
    }
  };

  const getStockStatus = (newQty) => {
    if (newQty === 0) return { label: 'Out of Stock', color: 'text-red-500', icon: 'AlertCircle' };
    if (newQty <= product?.min_stock_level) return { label: 'Low Stock', color: 'text-orange-500', icon: 'AlertTriangle' };
    return { label: 'Normal', color: 'text-green-500', icon: 'CheckCircle' };
  };

  const newQuantity = getNewQuantity();
  const newStatus = getStockStatus(newQuantity);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="glass-card max-w-lg w-full"
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Adjust Stock Level</h2>
              <p className="text-sm text-muted-foreground">{product?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Current Stock Info */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Current Stock:</span>
                <span className="ml-2 font-medium text-foreground">
                  {product?.stock_quantity?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Min Level:</span>
                <span className="ml-2 font-medium text-foreground">
                  {product?.min_stock_level?.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <span className="ml-2 font-medium text-foreground">
                  {product?.sku || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Category:</span>
                <span className="ml-2 font-medium text-foreground">
                  {product?.category?.charAt(0)?.toUpperCase() + product?.category?.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Adjustment Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Adjustment Type</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setAdjustmentType('set')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  adjustmentType === 'set' ?'border-primary bg-primary/10 text-primary' :'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
                }`}
              >
                <Icon name="Target" size={20} className="mx-auto mb-1" />
                <div className="text-xs font-medium">Set To</div>
              </button>
              
              <button
                type="button"
                onClick={() => setAdjustmentType('increase')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  adjustmentType === 'increase' ?'border-green-500 bg-green-500/10 text-green-600' :'border-border text-muted-foreground hover:text-foreground hover:border-green-500/50'
                }`}
              >
                <Icon name="Plus" size={20} className="mx-auto mb-1" />
                <div className="text-xs font-medium">Increase</div>
              </button>
              
              <button
                type="button"
                onClick={() => setAdjustmentType('decrease')}
                className={`p-3 rounded-lg border text-center transition-colors ${
                  adjustmentType === 'decrease' ?'border-red-500 bg-red-500/10 text-red-600' :'border-border text-muted-foreground hover:text-foreground hover:border-red-500/50'
                }`}
              >
                <Icon name="Minus" size={20} className="mx-auto mb-1" />
                <div className="text-xs font-medium">Decrease</div>
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              {adjustmentType === 'set' ? 'New Quantity' : 'Adjustment Quantity'}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e?.target?.value)}
              min="0"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder={`Enter ${adjustmentType === 'set' ? 'new quantity' : 'amount to ' + adjustmentType}`}
              required
            />
          </div>

          {/* Preview */}
          {quantity && !isNaN(quantity) && (
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Eye" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Preview Changes</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Current:</span>
                  <span className="ml-2 font-medium text-foreground">
                    {product?.stock_quantity?.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">New:</span>
                  <span className={`ml-2 font-medium ${newStatus?.color}`}>
                    {newQuantity?.toLocaleString()}
                  </span>
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <Icon name={newStatus?.icon} size={16} className={newStatus?.color} />
                  <span className={`text-sm font-medium ${newStatus?.color}`}>
                    {newStatus?.label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e?.target?.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select reason...</option>
              {reasons?.map((reasonOption) => (
                <option key={reasonOption} value={reasonOption}>
                  {reasonOption}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Quick Actions</label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType('set');
                  setQuantity(product?.min_stock_level?.toString());
                  setReason('Restock to minimum level');
                }}
                className="px-3 py-1.5 text-sm bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Set to Min Level
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType('set');
                  setQuantity((product?.min_stock_level * 2)?.toString());
                  setReason('Restock to optimal level');
                }}
                className="px-3 py-1.5 text-sm bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
              >
                Set to 2x Min
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType('set');
                  setQuantity('0');
                  setReason('Mark as out of stock');
                }}
                className="px-3 py-1.5 text-sm bg-red-500/10 text-red-600 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Set to Zero
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!quantity || isNaN(quantity) || isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin" />
                  <span>Adjusting...</span>
                </>
              ) : (
                <>
                  <Icon name="Check" size={16} />
                  <span>Adjust Stock</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StockAdjustmentModal;