import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Send, FileText, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import QuotationBuilder from './components/QuotationBuilder';
import QuotationPreview from './components/QuotationPreview';
import QuotationFilters from './components/QuotationFilters';
import QuotationCard from './components/QuotationCard';
import { quotationService } from '../../services/quotationService';
import { useToast } from '../../components/ui/NotificationToast';

const QuotationCreatorManager = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    customer: 'all'
  });
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('darkMode') === 'true'
  );

  const { showToast } = useToast();

  useEffect(() => {
    loadQuotations();
    
    // Set up real-time subscription - only if quotationSubscriptions is available
    let unsubscribe;
    if (typeof quotationSubscriptions !== 'undefined' && quotationSubscriptions?.subscribeToQuotations) {
      unsubscribe = quotationSubscriptions.subscribeToQuotations((payload) => {
        if (payload?.eventType === 'INSERT') {
          setQuotations(prev => [payload?.new, ...prev]);
        } else if (payload?.eventType === 'UPDATE') {
          setQuotations(prev => prev?.map(q => 
            q?.id === payload?.new?.id ? { ...q, ...payload?.new } : q
          ));
        } else if (payload?.eventType === 'DELETE') {
          setQuotations(prev => prev?.filter(q => q?.id !== payload?.old?.id));
        }
      });
    }

    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [quotations, searchTerm, filters]);

  useEffect(() => {
    document.documentElement?.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode?.toString());
  }, [darkMode]);

  const loadQuotations = async () => {
    setLoading(true);
    try {
      const { data, error } = await quotationService?.getQuotations();
      if (error) {
        showToast(error, 'error');
      } else {
        setQuotations(data || []);
      }
    } catch (error) {
      showToast('Failed to load quotations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...quotations];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm?.toLowerCase();
      filtered = filtered?.filter(quotation =>
        quotation?.quotation_number?.toLowerCase()?.includes(searchLower) ||
        quotation?.title?.toLowerCase()?.includes(searchLower) ||
        quotation?.customer?.company_name?.toLowerCase()?.includes(searchLower) ||
        quotation?.customer?.contact_person?.toLowerCase()?.includes(searchLower)
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(quotation => quotation?.status === filters?.status);
    }

    // Apply date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters?.dateRange) {
        case 'today':
          filterDate?.setHours(0, 0, 0, 0);
          filtered = filtered?.filter(quotation => 
            new Date(quotation.created_at) >= filterDate
          );
          break;
        case 'week':
          filterDate?.setDate(now?.getDate() - 7);
          filtered = filtered?.filter(quotation => 
            new Date(quotation.created_at) >= filterDate
          );
          break;
        case 'month':
          filterDate?.setMonth(now?.getMonth() - 1);
          filtered = filtered?.filter(quotation => 
            new Date(quotation.created_at) >= filterDate
          );
          break;
      }
    }

    setFilteredQuotations(filtered);
  };

  const handleCreateQuotation = () => {
    setSelectedQuotation(null);
    setShowBuilder(true);
  };

  const handleEditQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setShowBuilder(true);
  };

  const handleViewQuotation = (quotation) => {
    setSelectedQuotation(quotation);
    setShowPreview(true);
  };

  const handleDeleteQuotation = async (quotationId) => {
    if (!window.confirm('Are you sure you want to delete this quotation?')) {
      return;
    }

    try {
      const { error } = await quotationService?.deleteQuotation(quotationId);
      if (error) {
        showToast(error, 'error');
      } else {
        showToast('Quotation deleted successfully', 'success');
        setQuotations(prev => prev?.filter(q => q?.id !== quotationId));
      }
    } catch (error) {
      showToast('Failed to delete quotation', 'error');
    }
  };

  const handleSendQuotation = async (quotationId) => {
    try {
      const { error } = await quotationService?.updateQuotationStatus(quotationId, 'sent');
      if (error) {
        showToast(error, 'error');
      } else {
        showToast('Quotation sent successfully', 'success');
        loadQuotations();
      }
    } catch (error) {
      showToast('Failed to send quotation', 'error');
    }
  };

  const handleStatusUpdate = async (quotationId, status) => {
    try {
      const { error } = await quotationService?.updateQuotationStatus(quotationId, status);
      if (error) {
        showToast(error, 'error');
      } else {
        showToast(`Quotation ${status} successfully`, 'success');
        loadQuotations();
      }
    } catch (error) {
      showToast(`Failed to update quotation status`, 'error');
    }
  };

  const handleConvertToOrder = async (quotationId) => {
    try {
      const { data, error } = await quotationService?.convertToSalesOrder(quotationId);
      if (error) {
        showToast(error, 'error');
      } else {
        showToast('Quotation converted to sales order successfully', 'success');
        loadQuotations();
      }
    } catch (error) {
      showToast('Failed to convert quotation to order', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return <Edit3 className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
      case 'sent': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'accepted': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900';
      case 'expired': return 'text-orange-600 bg-orange-100 dark:bg-orange-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  if (showBuilder) {
    return (
      <QuotationBuilder
        quotation={selectedQuotation}
        onClose={() => {
          setShowBuilder(false);
          setSelectedQuotation(null);
        }}
        onSave={() => {
          setShowBuilder(false);
          setSelectedQuotation(null);
          loadQuotations();
        }}
        darkMode={darkMode}
      />
    );
  }

  if (showPreview) {
    return (
      <QuotationPreview
        quotation={selectedQuotation}
        onClose={() => {
          setShowPreview(false);
          setSelectedQuotation(null);
        }}
        onEdit={() => {
          setShowPreview(false);
          setShowBuilder(true);
        }}
        onStatusUpdate={handleStatusUpdate}
        onConvertToOrder={handleConvertToOrder}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Quotation Creator & Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create, manage, and track your quotations with real-time updates
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            
            <button
              onClick={handleCreateQuotation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Quotation
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quotations</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quotations?.length || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quotations?.filter(q => q?.status === 'sent')?.length || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accepted</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {quotations?.filter(q => q?.status === 'accepted')?.length || 0}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${quotations?.reduce((sum, q) => sum + (q?.total_amount || 0), 0)?.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search quotations by number, title, or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filters */}
              <QuotationFilters
                filters={filters}
                onFiltersChange={setFilters}
                quotations={quotations}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>

        {/* Quotations Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredQuotations?.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {quotations?.length === 0 ? 'No quotations yet' : 'No quotations match your search'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {quotations?.length === 0 
                ? 'Create your first quotation to get started' 
                : 'Try adjusting your search criteria or filters'
              }
            </p>
            {quotations?.length === 0 && (
              <button
                onClick={handleCreateQuotation}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Quotation
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredQuotations?.map((quotation) => (
              <QuotationCard
                key={quotation?.id}
                quotation={quotation}
                onView={() => handleViewQuotation(quotation)}
                onEdit={() => handleEditQuotation(quotation)}
                onDelete={() => handleDeleteQuotation(quotation?.id)}
                onSend={() => handleSendQuotation(quotation?.id)}
                onStatusUpdate={handleStatusUpdate}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationCreatorManager;