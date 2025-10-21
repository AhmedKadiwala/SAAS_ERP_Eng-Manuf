import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ 
  searchQuery, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onClearFilters,
  isCollapsed,
  onToggleCollapse 
}) => {
  const [activeFilters, setActiveFilters] = useState(0);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'prospect', label: 'Prospect' },
    { value: 'churned', label: 'Churned' }
  ];

  const industryOptions = [
    { value: 'all', label: 'All Industries' },
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'education', label: 'Education' },
    { value: 'consulting', label: 'Consulting' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'north-america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia-pacific', label: 'Asia Pacific' },
    { value: 'latin-america', label: 'Latin America' },
    { value: 'middle-east', label: 'Middle East' },
    { value: 'africa', label: 'Africa' }
  ];

  const relationshipOptions = [
    { value: 'all', label: 'All Relationships' },
    { value: 'excellent', label: 'Excellent (80-100%)' },
    { value: 'good', label: 'Good (60-79%)' },
    { value: 'fair', label: 'Fair (40-59%)' },
    { value: 'poor', label: 'Poor (0-39%)' }
  ];

  const segmentTags = [
    { id: 'enterprise', label: 'Enterprise', color: 'bg-primary/10 text-primary' },
    { id: 'smb', label: 'SMB', color: 'bg-success/10 text-success' },
    { id: 'startup', label: 'Startup', color: 'bg-warning/10 text-warning' },
    { id: 'vip', label: 'VIP', color: 'bg-accent/10 text-accent-foreground' },
    { id: 'high-value', label: 'High Value', color: 'bg-secondary/10 text-secondary' },
    { id: 'at-risk', label: 'At Risk', color: 'bg-error/10 text-error' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
    
    // Count active filters
    const count = Object.values(newFilters)?.filter(v => v && v !== 'all')?.length;
    setActiveFilters(count);
  };

  const handleTagToggle = (tagId) => {
    const currentTags = filters?.tags || [];
    const newTags = currentTags?.includes(tagId)
      ? currentTags?.filter(id => id !== tagId)
      : [...currentTags, tagId];
    
    handleFilterChange('tags', newTags);
  };

  const handleClearAll = () => {
    onClearFilters();
    setActiveFilters(0);
  };

  return (
    <div className="glass-card mb-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Filters</h3>
          {activeFilters > 0 && (
            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {activeFilters} active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName={isCollapsed ? 'ChevronDown' : 'ChevronUp'}
            onClick={onToggleCollapse}
            className="md:hidden"
          />
        </div>
      </div>
      {/* Filter Content */}
      <div className={`
        transition-all duration-300 overflow-hidden
        ${isCollapsed ? 'max-h-0' : 'max-h-none'}
        md:max-h-none
      `}>
        <div className="p-4 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Input
              type="search"
              placeholder="Search customers, companies, contacts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
              />
            )}
          </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Status"
              options={statusOptions}
              value={filters?.status || 'all'}
              onChange={(value) => handleFilterChange('status', value)}
            />
            
            <Select
              label="Industry"
              options={industryOptions}
              value={filters?.industry || 'all'}
              onChange={(value) => handleFilterChange('industry', value)}
            />
            
            <Select
              label="Location"
              options={locationOptions}
              value={filters?.location || 'all'}
              onChange={(value) => handleFilterChange('location', value)}
            />
            
            <Select
              label="Relationship"
              options={relationshipOptions}
              value={filters?.relationship || 'all'}
              onChange={(value) => handleFilterChange('relationship', value)}
            />
          </div>

          {/* Segment Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Customer Segments
            </label>
            <div className="flex flex-wrap gap-2">
              {segmentTags?.map((tag) => {
                const isSelected = (filters?.tags || [])?.includes(tag?.id);
                return (
                  <button
                    key={tag?.id}
                    onClick={() => handleTagToggle(tag?.id)}
                    className={`
                      px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-150 hover:scale-105
                      ${isSelected 
                        ? `${tag?.color} ring-2 ring-current ring-opacity-30` 
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                      }
                    `}
                  >
                    {tag?.label}
                    {isSelected && (
                      <Icon name="Check" size={12} className="ml-1 inline" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="pt-4 border-t border-border/50">
            <Button
              variant="ghost"
              size="sm"
              iconName="Settings"
              iconPosition="left"
            >
              Advanced Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;