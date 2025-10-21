import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const StockMovementHistory = () => {
  const [filters, setFilters] = useState({
    dateRange: '7d',
    movementType: '',
    product: '',
    reason: ''
  });

  const [selectedMovement, setSelectedMovement] = useState(null);

  const movementData = [
  {
    id: 1,
    productName: "Premium Software License",
    sku: "PSL-001",
    type: "in",
    quantity: 50,
    previousStock: 100,
    newStock: 150,
    reason: "purchase_order",
    reasonDetails: "PO-2024-001 - Quarterly stock replenishment",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: "Sarah Johnson",
    userAvatar: "https://images.unsplash.com/photo-1734456611474-13245d164868",
    userAvatarAlt: "Professional headshot of woman with brown hair in business attire",
    reference: "PO-2024-001",
    cost: 7500.00
  },
  {
    id: 2,
    productName: "Wireless Bluetooth Headphones",
    sku: "ELE-WBH-001",
    type: "out",
    quantity: 3,
    previousStock: 25,
    newStock: 22,
    reason: "sale",
    reasonDetails: "Order #ORD-2024-156 - Customer purchase",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    user: "Michael Chen",
    userAvatar: "https://images.unsplash.com/photo-1687256457585-3608dfa736c5",
    userAvatarAlt: "Professional headshot of Asian man in navy suit with glasses",
    reference: "ORD-2024-156",
    cost: null
  },
  {
    id: 3,
    productName: "Organic Cotton T-Shirt",
    sku: "CLO-OCT-002",
    type: "adjustment",
    quantity: -2,
    previousStock: 45,
    newStock: 43,
    reason: "damaged",
    reasonDetails: "Damaged during warehouse inspection - Quality control",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    user: "Emily Rodriguez",
    userAvatar: "https://images.unsplash.com/photo-1719515862094-c6e9354ee7f8",
    userAvatarAlt: "Professional headshot of Hispanic woman with long dark hair in white blouse",
    reference: "QC-2024-089",
    cost: null
  },
  {
    id: 4,
    productName: "Smart Home Security Camera",
    sku: "ELE-SHS-003",
    type: "in",
    quantity: 20,
    previousStock: 8,
    newStock: 28,
    reason: "return",
    reasonDetails: "Customer return - Unopened items restocked",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    user: "David Kim",
    userAvatar: "https://images.unsplash.com/photo-1605980776566-0486c3ac7617",
    userAvatarAlt: "Professional headshot of man with short black hair in gray suit",
    reference: "RET-2024-045",
    cost: null
  },
  {
    id: 5,
    productName: "Yoga Exercise Mat",
    sku: "SPO-YEM-001",
    type: "out",
    quantity: 15,
    previousStock: 60,
    newStock: 45,
    reason: "transfer",
    reasonDetails: "Stock transfer to warehouse B - Regional distribution",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    user: "Lisa Wang",
    userAvatar: "https://images.unsplash.com/photo-1700560970703-82fd3150d5ac",
    userAvatarAlt: "Professional headshot of Asian woman with shoulder-length black hair in blue blazer",
    reference: "TRF-2024-012",
    cost: null
  }];


  const dateRangeOptions = [
  { value: '1d', label: 'Last 24 Hours' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: 'custom', label: 'Custom Range' }];


  const movementTypeOptions = [
  { value: '', label: 'All Movements' },
  { value: 'in', label: 'Stock In' },
  { value: 'out', label: 'Stock Out' },
  { value: 'adjustment', label: 'Adjustments' }];


  const reasonOptions = [
  { value: '', label: 'All Reasons' },
  { value: 'purchase_order', label: 'Purchase Order' },
  { value: 'sale', label: 'Sale' },
  { value: 'return', label: 'Return' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'damaged', label: 'Damaged' },
  { value: 'expired', label: 'Expired' }];


  const getMovementIcon = (type) => {
    switch (type) {
      case 'in':
        return { icon: 'TrendingUp', color: 'text-success' };
      case 'out':
        return { icon: 'TrendingDown', color: 'text-error' };
      case 'adjustment':
        return { icon: 'RotateCcw', color: 'text-warning' };
      default:
        return { icon: 'Package', color: 'text-muted-foreground' };
    }
  };

  const getMovementTypeLabel = (type) => {
    switch (type) {
      case 'in':
        return 'Stock In';
      case 'out':
        return 'Stock Out';
      case 'adjustment':
        return 'Adjustment';
      default:
        return 'Unknown';
    }
  };

  const getReasonLabel = (reason) => {
    const reasonMap = {
      purchase_order: 'Purchase Order',
      sale: 'Sale',
      return: 'Return',
      transfer: 'Transfer',
      adjustment: 'Manual Adjustment',
      damaged: 'Damaged Goods',
      expired: 'Expired Items'
    };
    return reasonMap?.[reason] || reason;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)} />

          
          <Select
            label="Movement Type"
            options={movementTypeOptions}
            value={filters?.movementType}
            onChange={(value) => handleFilterChange('movementType', value)} />

          
          <Input
            label="Product Search"
            type="search"
            placeholder="Search by name or SKU..."
            value={filters?.product}
            onChange={(e) => handleFilterChange('product', e?.target?.value)} />

          
          <Select
            label="Reason"
            options={reasonOptions}
            value={filters?.reason}
            onChange={(value) => handleFilterChange('reason', value)} />

        </div>
      </div>
      {/* Movement Timeline */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Stock Movement History</h3>
            <p className="text-sm text-muted-foreground">
              Track all inventory changes and transactions
            </p>
          </div>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left">

            Export History
          </Button>
        </div>

        <div className="space-y-4">
          {movementData?.map((movement, index) => {
            const movementStyle = getMovementIcon(movement?.type);

            return (
              <motion.div
                key={movement?.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors duration-150 cursor-pointer"
                onClick={() => setSelectedMovement(movement)}>

                {/* Movement Icon */}
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${movement?.type === 'in' ? 'bg-success/10' :
                movement?.type === 'out' ? 'bg-error/10' : 'bg-warning/10'}
                `}>
                  <Icon name={movementStyle?.icon} size={20} className={movementStyle?.color} />
                </div>
                {/* Movement Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">
                        {movement?.productName}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        SKU: {movement?.sku} • {getReasonLabel(movement?.reason)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {movement?.reasonDetails}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`
                          text-lg font-bold
                          ${movement?.type === 'in' ? 'text-success' :
                        movement?.type === 'out' ? 'text-error' : 'text-warning'}
                        `}>
                          {movement?.type === 'in' ? '+' : movement?.type === 'out' ? '-' : ''}
                          {Math.abs(movement?.quantity)}
                        </span>
                        <span className="text-sm text-muted-foreground">units</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {movement?.previousStock} → {movement?.newStock}
                      </p>
                    </div>
                  </div>

                  {/* User and Timestamp */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center space-x-2">
                      <img
                        src={movement?.userAvatar}
                        alt={movement?.userAvatarAlt}
                        className="w-6 h-6 rounded-full object-cover" />

                      <span className="text-sm text-muted-foreground">{movement?.user}</span>
                      {movement?.reference &&
                      <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-primary">{movement?.reference}</span>
                        </>
                      }
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatTimeAgo(movement?.timestamp)}
                    </span>
                  </div>
                </div>
                {/* Chevron */}
                <Icon name="ChevronRight" size={16} className="text-muted-foreground mt-2" />
              </motion.div>);

          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <Button variant="outline">
            Load More History
          </Button>
        </div>
      </div>
      {/* Movement Detail Modal */}
      {selectedMovement &&
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-400 flex items-center justify-center p-4">
          <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-2xl">

            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <h3 className="text-lg font-semibold text-foreground">Movement Details</h3>
              <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedMovement(null)}
              iconName="X" />

            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product</label>
                  <p className="text-foreground">{selectedMovement?.productName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SKU</label>
                  <p className="text-foreground">{selectedMovement?.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Movement Type</label>
                  <p className="text-foreground">{getMovementTypeLabel(selectedMovement?.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                  <p className="text-foreground">
                    {selectedMovement?.type === 'in' ? '+' : selectedMovement?.type === 'out' ? '-' : ''}
                    {Math.abs(selectedMovement?.quantity)} units
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Previous Stock</label>
                  <p className="text-foreground">{selectedMovement?.previousStock} units</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">New Stock</label>
                  <p className="text-foreground">{selectedMovement?.newStock} units</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reason</label>
                  <p className="text-foreground">{getReasonLabel(selectedMovement?.reason)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reference</label>
                  <p className="text-foreground">{selectedMovement?.reference || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Details</label>
                <p className="text-foreground">{selectedMovement?.reasonDetails}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <img
                src={selectedMovement?.userAvatar}
                alt={selectedMovement?.userAvatarAlt}
                className="w-8 h-8 rounded-full object-cover" />

                <div>
                  <p className="text-sm font-medium text-foreground">{selectedMovement?.user}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedMovement?.timestamp?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      }
    </div>);

};

export default StockMovementHistory;