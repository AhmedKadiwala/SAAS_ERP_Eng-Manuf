import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { customerService } from '../../services/customerService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import CustomerCard from './components/CustomerCard';
import FilterPanel from './components/FilterPanel';
import BulkActionToolbar from './components/BulkActionToolbar';
import CustomerStats from './components/CustomerStats';
import ImportExportModal from './components/ImportExportModal';

const CustomerDirectory = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Data states
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    status: 'all',
    industry: 'all',
    location: 'all',
    relationship: 'all',
    tags: []
  });

  // Load customers
  useEffect(() => {
    if (!authLoading && user) {
      loadCustomers();
      loadStats();
    }
  }, [user, authLoading, filters, searchQuery]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    const unsubscribe = customerService?.subscribeToCustomers((payload) => {
      console.log('Customer change detected:', payload);
      // Reload customers when changes occur
      loadCustomers();
      if (payload?.eventType !== 'DELETE') {
        loadStats();
      }
    });

    return unsubscribe;
  }, [user]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: customerError } = await customerService?.getCustomers({
        ...filters,
        search: searchQuery
      });

      if (customerError) {
        setError(customerError?.message || 'Failed to load customers');
        return;
      }

      setCustomers(data || []);
    } catch (err) {
      setError(err?.message || 'Failed to load customers');
      console.error('Error loading customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error: statsError } = await customerService?.getCustomerStats();
      
      if (statsError) {
        console.error('Error loading stats:', statsError);
        return;
      }

      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // Filter and sort customers
  const filteredCustomers = customers?.filter((customer) => {
    // Additional client-side filtering if needed
    return true;
  });

  // Sort customers
  const sortedCustomers = [...filteredCustomers]?.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a?.company_name?.toLowerCase();
        bValue = b?.company_name?.toLowerCase();
        break;
      case 'relationship':
        aValue = a?.relationship_score || 0;
        bValue = b?.relationship_score || 0;
        break;
      case 'value':
        aValue = parseFloat(a?.total_value || 0);
        bValue = parseFloat(b?.total_value || 0);
        break;
      case 'lastContact':
        aValue = new Date(a?.last_interaction);
        bValue = new Date(b?.last_interaction);
        break;
      default:
        aValue = a?.company_name?.toLowerCase();
        bValue = b?.company_name?.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleCustomerSelect = (customerId, isSelected) => {
    if (isSelected) {
      setSelectedCustomers((prev) => [...prev, customerId]);
    } else {
      setSelectedCustomers((prev) => prev?.filter((id) => id !== customerId));
    }
  };

  const handleSelectAll = () => {
    if (selectedCustomers?.length === sortedCustomers?.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(sortedCustomers?.map((c) => c?.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedCustomers([]);
  };

  const handleBulkExport = async (format) => {
    console.log(`Exporting ${selectedCustomers?.length} customers as ${format}`);
    // Simulate export process
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  const handleBulkEmail = () => {
    console.log(`Sending email campaign to ${selectedCustomers?.length} customers`);
    navigate('/email-campaign', { state: { customerIds: selectedCustomers } });
  };

  const handleBulkTag = async (tagAction) => {
    try {
      console.log(`Applying tag action "${tagAction}" to ${selectedCustomers?.length} customers`);
      
      // Here you would implement the actual tag update logic
      // For now, just clear selection
      setSelectedCustomers([]);
      
      // Reload customers to show updated data
      await loadCustomers();
    } catch (err) {
      console.error('Error applying bulk tag action:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedCustomers?.length} customers?`)) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await customerService?.bulkDeleteCustomers(selectedCustomers);
      
      if (error) {
        setError(error?.message || 'Failed to delete customers');
        return;
      }

      setSelectedCustomers([]);
      await loadCustomers();
      await loadStats();
    } catch (err) {
      setError(err?.message || 'Failed to delete customers');
      console.error('Error deleting customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerEdit = (customer) => {
    console.log('Editing customer:', customer?.company_name);
    // Navigate to edit page or open modal
    navigate(`/customer-edit/${customer?.id}`);
  };

  const handleCustomerCall = async (customer) => {
    console.log('Calling customer:', customer?.phone);
    
    // Update last interaction
    try {
      await customerService?.updateLastInteraction(customer?.id);
      await loadCustomers(); // Refresh to show updated interaction time
    } catch (err) {
      console.error('Error updating last interaction:', err);
    }
  };

  const handleCustomerEmail = async (customer) => {
    console.log('Emailing customer:', customer?.email);
    
    // Update last interaction
    try {
      await customerService?.updateLastInteraction(customer?.id);
      await loadCustomers(); // Refresh to show updated interaction time
    } catch (err) {
      console.error('Error updating last interaction:', err);
    }
  };

  const handleCustomerTimeline = (customer) => {
    console.log('Viewing timeline for:', customer?.company_name);
    navigate(`/customer-timeline/${customer?.id}`);
  };

  const handleClearFilters = () => {
    setFilters({
      status: 'all',
      industry: 'all',
      location: 'all',
      relationship: 'all',
      tags: []
    });
    setSearchQuery('');
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth requirement for preview mode
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-8">
          <NavigationBreadcrumbs />
          
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Authentication Required
            </h3>
            <p className="text-muted-foreground mb-6">
              Please sign in to access your customer directory
            </p>
            <div className="bg-muted/30 rounded-lg p-6 mb-6 text-left max-w-md mx-auto">
              <h4 className="text-sm font-semibold mb-3">Demo Credentials:</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Admin:</strong> admin@modernerp.com / ModernERP2024!</div>
                <div><strong>Manager:</strong> manager@modernerp.com / ModernERP2024!</div>
                <div><strong>User:</strong> user@modernerp.com / ModernERP2024!</div>
              </div>
            </div>
            <Button
              iconName="LogIn"
              iconPosition="left"
              onClick={() => navigate('/modern-login-screen')}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <NavigationBreadcrumbs />

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              Customer Directory
            </h1>
            <p className="text-muted-foreground">
              Manage your customer relationships and track engagement
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <Button
              variant="outline"
              iconName="Upload"
              iconPosition="left"
              onClick={() => setShowImportModal(true)}
            >
              Import
            </Button>
            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              onClick={() => setShowExportModal(true)}
            >
              Export
            </Button>
            <Button
              iconName="Plus"
              iconPosition="left"
              onClick={() => navigate('/customer-create')}
            >
              Add Customer
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-destructive" />
              <p className="text-destructive text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && <CustomerStats stats={stats} />}

        {/* Filters */}
        <FilterPanel
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
          isCollapsed={isFilterCollapsed}
          onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
        />

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <p className="text-sm text-muted-foreground">
              Showing {sortedCustomers?.length} customers
            </p>
            
            {selectedCustomers?.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedCustomers?.length === sortedCustomers?.length ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('name')}
                className={sortBy === 'name' ? 'text-primary' : ''}
              >
                Name
                {sortBy === 'name' && (
                  <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} className="ml-1" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('relationship')}
                className={sortBy === 'relationship' ? 'text-primary' : ''}
              >
                Score
                {sortBy === 'relationship' && (
                  <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} className="ml-1" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort('lastContact')}
                className={sortBy === 'lastContact' ? 'text-primary' : ''}
              >
                Recent
                {sortBy === 'lastContact' && (
                  <Icon name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={14} className="ml-1" />
                )}
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted/30 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                iconName="Grid3X3"
                onClick={() => setViewMode('grid')}
                className="h-8 w-8 p-0"
              />
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                iconName="List"
                onClick={() => setViewMode('list')}
                className="h-8 w-8 p-0"
              />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        )}

        {/* Customer Grid/List */}
        {!loading && sortedCustomers?.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
          `}>
            {sortedCustomers?.map((customer) => (
              <CustomerCard
                key={customer?.id}
                customer={customer}
                isSelected={selectedCustomers?.includes(customer?.id)}
                onSelect={handleCustomerSelect}
                onEdit={handleCustomerEdit}
                onCall={handleCustomerCall}
                onEmail={handleCustomerEmail}
                onViewTimeline={handleCustomerTimeline}
              />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No customers found
            </h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || Object.values(filters)?.some((f) => f !== 'all' && f?.length > 0) ?
                'Try adjusting your search or filters' : 'Get started by adding your first customer'
              }
            </p>
            <Button
              iconName="Plus"
              iconPosition="left"
              onClick={() => navigate('/customer-create')}
            >
              Add Customer
            </Button>
          </div>
        ) : null}

        {/* Bulk Action Toolbar */}
        <BulkActionToolbar
          selectedCount={selectedCustomers?.length}
          onClearSelection={handleClearSelection}
          onBulkExport={handleBulkExport}
          onBulkEmail={handleBulkEmail}
          onBulkTag={handleBulkTag}
          onBulkDelete={handleBulkDelete}
          isVisible={selectedCustomers?.length > 0}
        />

        {/* Import/Export Modals */}
        <ImportExportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          type="import"
        />
        
        <ImportExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          type="export"
        />
      </div>
    </div>
  );
};

export default CustomerDirectory;