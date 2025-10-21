import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PipelineFilters = ({ onFilterChange, onBulkAction, selectedLeads }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    dealSize: '',
    probability: '',
    source: '',
    assignee: '',
    priority: ''
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const dealSizeOptions = [
    { value: '', label: 'All Deal Sizes' },
    { value: 'small', label: 'Small ($0 - $10K)' },
    { value: 'medium', label: 'Medium ($10K - $50K)' },
    { value: 'large', label: 'Large ($50K - $100K)' },
    { value: 'enterprise', label: 'Enterprise ($100K+)' }
  ];

  const probabilityOptions = [
    { value: '', label: 'All Probabilities' },
    { value: 'low', label: 'Low (0-40%)' },
    { value: 'medium', label: 'Medium (40-70%)' },
    { value: 'high', label: 'High (70-100%)' }
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'social', label: 'Social Media' },
    { value: 'email', label: 'Email Campaign' },
    { value: 'cold-call', label: 'Cold Call' },
    { value: 'trade-show', label: 'Trade Show' }
  ];

  const assigneeOptions = [
    { value: '', label: 'All Assignees' },
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'sarah-wilson', label: 'Sarah Wilson' },
    { value: 'unassigned', label: 'Unassigned' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const bulkActions = [
    { value: 'assign', label: 'Assign to Team Member', icon: 'UserPlus' },
    { value: 'stage', label: 'Move to Stage', icon: 'ArrowRight' },
    { value: 'priority', label: 'Change Priority', icon: 'Flag' },
    { value: 'tag', label: 'Add Tags', icon: 'Tag' },
    { value: 'delete', label: 'Delete Leads', icon: 'Trash2' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...selectedFilters, [key]: value };
    setSelectedFilters(newFilters);
    onFilterChange({ ...newFilters, search: searchQuery });
  };

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchQuery(value);
    onFilterChange({ ...selectedFilters, search: value });
  };

  const clearFilters = () => {
    setSelectedFilters({
      dealSize: '',
      probability: '',
      source: '',
      assignee: '',
      priority: ''
    });
    setSearchQuery('');
    onFilterChange({ search: '' });
  };

  const hasActiveFilters = Object.values(selectedFilters)?.some(value => value !== '') || searchQuery !== '';

  return (
    <div className="bg-card/50 backdrop-blur-glass rounded-xl border border-border/50 shadow-glass p-6 mb-6">
      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search leads by name, company, or email..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full"
          />
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center space-x-2 flex-wrap">
          <Select
            options={dealSizeOptions}
            value={selectedFilters?.dealSize}
            onChange={(value) => handleFilterChange('dealSize', value)}
            placeholder="Deal Size"
            className="min-w-32"
          />
          
          <Select
            options={probabilityOptions}
            value={selectedFilters?.probability}
            onChange={(value) => handleFilterChange('probability', value)}
            placeholder="Probability"
            className="min-w-32"
          />

          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? 'ChevronUp' : 'ChevronDown'}
            iconPosition="right"
          >
            Advanced
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/30">
          <Select
            label="Source"
            options={sourceOptions}
            value={selectedFilters?.source}
            onChange={(value) => handleFilterChange('source', value)}
          />
          
          <Select
            label="Assignee"
            options={assigneeOptions}
            value={selectedFilters?.assignee}
            onChange={(value) => handleFilterChange('assignee', value)}
          />
          
          <Select
            label="Priority"
            options={priorityOptions}
            value={selectedFilters?.priority}
            onChange={(value) => handleFilterChange('priority', value)}
          />
        </div>
      )}
      {/* Bulk Actions */}
      {selectedLeads?.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/30 mt-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">{selectedLeads?.length}</span>
            </div>
            <span className="text-sm font-medium">
              {selectedLeads?.length} lead{selectedLeads?.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {bulkActions?.map((action) => (
              <Button
                key={action?.value}
                variant="outline"
                size="sm"
                onClick={() => onBulkAction(action?.value, selectedLeads)}
                iconName={action?.icon}
                iconPosition="left"
              >
                {action?.label}
              </Button>
            ))}
          </div>
        </div>
      )}
      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/30 mt-4">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(selectedFilters)?.map(([key, value]) => {
            if (!value) return null;
            const option = {
              dealSize: dealSizeOptions,
              probability: probabilityOptions,
              source: sourceOptions,
              assignee: assigneeOptions,
              priority: priorityOptions
            }?.[key]?.find(opt => opt?.value === value);
            
            return (
              <span
                key={key}
                className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                <span>{option?.label}</span>
                <button
                  onClick={() => handleFilterChange(key, '')}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors duration-150"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            );
          })}
          {searchQuery && (
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <span>Search: "{searchQuery}"</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  onFilterChange({ ...selectedFilters, search: '' });
                }}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors duration-150"
              >
                <Icon name="X" size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PipelineFilters;