import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const UserFilters = ({ onFilterChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    department: '',
    status: '',
    lastActive: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const roleOptions = [
    { value: '', label: 'All Roles' },
    { value: 'admin', label: 'Administrator' },
    { value: 'manager', label: 'Manager' },
    { value: 'sales', label: 'Sales Representative' },
    { value: 'support', label: 'Support Agent' },
    { value: 'viewer', label: 'Viewer' }
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'support', label: 'Customer Support' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  const lastActiveOptions = [
    { value: '', label: 'Any Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: '3months', label: 'Last 3 Months' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      role: '',
      department: '',
      status: '',
      lastActive: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');
  const activeFilterCount = Object.values(filters)?.filter(value => value !== '')?.length;

  return (
    <div className="glass-card p-4 mb-6">
      {/* Search and Quick Filters */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users by name, email, or department..."
              value={filters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          iconPosition="right"
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear
          </Button>
        )}
      </div>
      {/* Advanced Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border/50 animate-fade-in">
          <Select
            label="Role"
            options={roleOptions}
            value={filters?.role}
            onChange={(value) => handleFilterChange('role', value)}
            placeholder="Filter by role"
          />

          <Select
            label="Department"
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => handleFilterChange('department', value)}
            placeholder="Filter by department"
          />

          <Select
            label="Status"
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Filter by status"
          />

          <Select
            label="Last Active"
            options={lastActiveOptions}
            value={filters?.lastActive}
            onChange={(value) => handleFilterChange('lastActive', value)}
            placeholder="Filter by activity"
          />
        </div>
      )}
      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
          {filters?.search && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              <Icon name="Search" size={12} />
              <span>Search: {filters?.search}</span>
              <button
                onClick={() => handleFilterChange('search', '')}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
          
          {filters?.role && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
              <Icon name="UserCog" size={12} />
              <span>Role: {roleOptions?.find(r => r?.value === filters?.role)?.label}</span>
              <button
                onClick={() => handleFilterChange('role', '')}
                className="hover:bg-secondary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {filters?.department && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
              <Icon name="Building" size={12} />
              <span>Dept: {departmentOptions?.find(d => d?.value === filters?.department)?.label}</span>
              <button
                onClick={() => handleFilterChange('department', '')}
                className="hover:bg-accent/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {filters?.status && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-success/10 text-success rounded-full text-sm">
              <Icon name="Activity" size={12} />
              <span>Status: {statusOptions?.find(s => s?.value === filters?.status)?.label}</span>
              <button
                onClick={() => handleFilterChange('status', '')}
                className="hover:bg-success/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}

          {filters?.lastActive && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">
              <Icon name="Clock" size={12} />
              <span>Active: {lastActiveOptions?.find(l => l?.value === filters?.lastActive)?.label}</span>
              <button
                onClick={() => handleFilterChange('lastActive', '')}
                className="hover:bg-warning/20 rounded-full p-0.5"
              >
                <Icon name="X" size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFilters;