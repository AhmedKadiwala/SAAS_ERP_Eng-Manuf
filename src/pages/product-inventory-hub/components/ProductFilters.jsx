import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ProductFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [priceRange, setPriceRange] = useState([filters?.minPrice || 0, filters?.maxPrice || 10000]);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Apparel' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books & Media' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'toys', label: 'Toys & Games' }
  ];

  const stockStatusOptions = [
    { value: '', label: 'All Stock Status' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'low_stock', label: 'Low Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' }
  ];

  const sortOptions = [
    { value: 'name_asc', label: 'Name (A-Z)' },
    { value: 'name_desc', label: 'Name (Z-A)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
    { value: 'stock_asc', label: 'Stock (Low to High)' },
    { value: 'stock_desc', label: 'Stock (High to Low)' },
    { value: 'created_desc', label: 'Newest First' },
    { value: 'created_asc', label: 'Oldest First' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value) || 0;
    setPriceRange(newRange);
    
    onFiltersChange({
      ...filters,
      minPrice: newRange?.[0],
      maxPrice: newRange?.[1]
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters?.search) count++;
    if (filters?.category) count++;
    if (filters?.stockStatus) count++;
    if (filters?.minPrice > 0 || filters?.maxPrice < 10000) count++;
    return count;
  };

  return (
    <div className="glass-card p-4 mb-6">
      {/* Quick Filters Row */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products, SKU, or description..."
              value={filters?.search || ''}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="min-w-48">
          <Select
            options={categoryOptions}
            value={filters?.category || ''}
            onChange={(value) => handleFilterChange('category', value)}
            placeholder="Category"
          />
        </div>

        {/* Stock Status Filter */}
        <div className="min-w-40">
          <Select
            options={stockStatusOptions}
            value={filters?.stockStatus || ''}
            onChange={(value) => handleFilterChange('stockStatus', value)}
            placeholder="Stock Status"
          />
        </div>

        {/* Sort */}
        <div className="min-w-48">
          <Select
            options={sortOptions}
            value={filters?.sortBy || 'name_asc'}
            onChange={(value) => handleFilterChange('sortBy', value)}
            placeholder="Sort by"
          />
        </div>

        {/* Advanced Filters Toggle */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
        >
          Advanced
          {getActiveFiltersCount() > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>

        {/* Clear Filters */}
        {getActiveFiltersCount() > 0 && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear
          </Button>
        )}
      </div>
      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/50 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Price Range</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange?.[0]}
                    onChange={(e) => handlePriceRangeChange(0, e?.target?.value)}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange?.[1]}
                    onChange={(e) => handlePriceRangeChange(1, e?.target?.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* SKU Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">SKU Pattern</label>
                <Input
                  type="text"
                  placeholder="e.g., PSL-*, CS-001"
                  value={filters?.skuPattern || ''}
                  onChange={(e) => handleFilterChange('skuPattern', e?.target?.value)}
                />
              </div>

              {/* Stock Quantity Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Stock Quantity</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters?.minStock || ''}
                    onChange={(e) => handleFilterChange('minStock', e?.target?.value)}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters?.maxStock || ''}
                    onChange={(e) => handleFilterChange('maxStock', e?.target?.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Created Date</label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="date"
                    value={filters?.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e?.target?.value)}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="date"
                    value={filters?.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e?.target?.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Has Variants */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product Type</label>
                <Select
                  options={[
                    { value: '', label: 'All Products' },
                    { value: 'with_variants', label: 'With Variants' },
                    { value: 'without_variants', label: 'Simple Products' }
                  ]}
                  value={filters?.hasVariants || ''}
                  onChange={(value) => handleFilterChange('hasVariants', value)}
                  placeholder="Product Type"
                />
              </div>

              {/* Low Stock Alert */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Alert Status</label>
                <Select
                  options={[
                    { value: '', label: 'All Products' },
                    { value: 'below_reorder', label: 'Below Reorder Point' },
                    { value: 'above_reorder', label: 'Above Reorder Point' }
                  ]}
                  value={filters?.alertStatus || ''}
                  onChange={(value) => handleFilterChange('alertStatus', value)}
                  placeholder="Alert Status"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductFilters;