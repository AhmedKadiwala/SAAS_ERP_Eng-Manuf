import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, Truck, CheckCircle, Clock, AlertTriangle, DollarSign, FileText } from 'lucide-react';
import OrderCard from './components/OrderCard';
import OrderFilters from './components/OrderFilters';
import OrderBuilder from './components/OrderBuilder';
import OrderDetails from './components/OrderDetails';
import OrderStatusPipeline from './components/OrderStatusPipeline';
import InventoryChecks from './components/InventoryChecks';
import { salesOrderService, salesOrderLineItemService } from '../../services/salesOrderService';
import { useToast } from '../../components/ui/NotificationToast';

const SalesOrderProcessingSystem = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    customer: 'all'
  });
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('darkMode') === 'true'
  );
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    totalValue: 0
  });

  const { showToast } = useToast();

  useEffect(() => {
    loadSalesOrders();
    
    // Set up real-time subscription
    const unsubscribe = salesOrderService?.subscribeToSalesOrders ? 
      salesOrderService.subscribeToSalesOrders((payload) => {
        if (payload?.eventType === 'INSERT') {
          setOrders(prev => [payload?.new, ...prev]);
        } else if (payload?.eventType === 'UPDATE') {
          setOrders(prev => prev?.map(o => 
            o?.id === payload?.new?.id ? { ...o, ...payload?.new } : o
          ));
        } else if (payload?.eventType === 'DELETE') {
          setOrders(prev => prev?.filter(o => o?.id !== payload?.old?.id));
        }
      }) : null;

    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
    calculateStats();
  }, [orders, searchTerm, filters]);

  useEffect(() => {
    document.documentElement?.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode?.toString());
  }, [darkMode]);

  const loadSalesOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await salesOrderService?.getSalesOrders();
      if (error) {
        showToast(error, 'error');
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      showToast('Failed to load sales orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const stats = {
      total: orders?.length || 0,
      pending: orders?.filter(o => o?.status === 'pending')?.length || 0,
      processing: orders?.filter(o => o?.status === 'processing')?.length || 0,
      shipped: orders?.filter(o => o?.status === 'shipped')?.length || 0,
      delivered: orders?.filter(o => o?.status === 'delivered')?.length || 0,
      totalValue: orders?.reduce((sum, o) => sum + (o?.total_amount || 0), 0) || 0
    };
    setStats(stats);
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...orders];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm?.toLowerCase();
      filtered = filtered?.filter(order =>
        order?.order_number?.toLowerCase()?.includes(searchLower) ||
        order?.customer?.company_name?.toLowerCase()?.includes(searchLower) ||
        order?.customer?.contact_person?.toLowerCase()?.includes(searchLower) ||
        order?.tracking_number?.toLowerCase()?.includes(searchLower)
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(order => order?.status === filters?.status);
    }

    // Apply payment status filter
    if (filters?.paymentStatus !== 'all') {
      filtered = filtered?.filter(order => order?.payment_status === filters?.paymentStatus);
    }

    // Apply date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters?.dateRange) {
        case 'today':
          filterDate?.setHours(0, 0, 0, 0);
          filtered = filtered?.filter(order => 
            new Date(order.created_at) >= filterDate
          );
          break;
        case 'week':
          filterDate?.setDate(now?.getDate() - 7);
          filtered = filtered?.filter(order => 
            new Date(order.created_at) >= filterDate
          );
          break;
        case 'month':
          filterDate?.setMonth(now?.getMonth() - 1);
          filtered = filtered?.filter(order => 
            new Date(order.created_at) >= filterDate
          );
          break;
      }
    }

    setFilteredOrders(filtered);
  };

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setShowBuilder(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowBuilder(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this sales order?')) {
      return;
    }

    try {
      const { error } = await salesOrderService?.deleteSalesOrder(orderId);
      if (error) {
        showToast(error, 'error');
      } else {
        showToast('Sales order deleted successfully', 'success');
        setOrders(prev => prev?.filter(o => o?.id !== orderId));
      }
    } catch (error) {
      showToast('Failed to delete sales order', 'error');
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const { error } = await salesOrderService?.updateOrderStatus(orderId, status);
      if (error) {
        showToast(error, 'error');
      } else {
        showToast(`Order ${status} successfully`, 'success');
        loadSalesOrders();
      }
    } catch (error) {
      showToast(`Failed to update order status`, 'error');
    }
  };

  const handlePaymentStatusUpdate = async (orderId, paymentStatus) => {
    try {
      const { error } = await salesOrderService?.updatePaymentStatus(orderId, paymentStatus);
      if (error) {
        showToast(error, 'error');
      } else {
        showToast(`Payment status updated successfully`, 'success');
        loadSalesOrders();
      }
    } catch (error) {
      showToast(`Failed to update payment status`, 'error');
    }
  };

  const handleInventoryAllocation = async (orderId) => {
    try {
      const { success, allocated, total, error } = await salesOrderLineItemService?.allocateInventory(orderId);
      if (error) {
        showToast(error, 'error');
      } else {
        showToast(`Inventory allocated: ${allocated}/${total} items`, success ? 'success' : 'warning');
        loadSalesOrders();
      }
    } catch (error) {
      showToast('Failed to allocate inventory', 'error');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'confirmed': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'processing': return 'text-purple-600 bg-purple-100 dark:bg-purple-900';
      case 'shipped': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900';
      case 'delivered': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'cancelled': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900';
      case 'partial': return 'text-orange-600 bg-orange-100 dark:bg-orange-900';
      case 'paid': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'refunded': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'failed': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  if (showBuilder) {
    return (
      <OrderBuilder
        order={selectedOrder}
        onClose={() => {
          setShowBuilder(false);
          setSelectedOrder(null);
        }}
        onSave={() => {
          setShowBuilder(false);
          setSelectedOrder(null);
          loadSalesOrders();
        }}
        darkMode={darkMode}
      />
    );
  }

  if (showDetails) {
    return (
      <OrderDetails
        order={selectedOrder}
        onClose={() => {
          setShowDetails(false);
          setSelectedOrder(null);
        }}
        onEdit={() => {
          setShowDetails(false);
          setShowBuilder(true);
        }}
        onStatusUpdate={handleStatusUpdate}
        onPaymentStatusUpdate={handlePaymentStatusUpdate}
        onInventoryAllocation={handleInventoryAllocation}
        getStatusIcon={getStatusIcon}
        getStatusColor={getStatusColor}
        getPaymentStatusColor={getPaymentStatusColor}
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
              Sales Order Processing System
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage complete order lifecycle from creation to fulfillment
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
              onClick={handleCreateOrder}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Order
            </button>
          </div>
        </div>

        {/* Status Pipeline */}
        <OrderStatusPipeline
          orders={orders}
          onStatusClick={(status) => setFilters(prev => ({ ...prev, status }))}
          getStatusIcon={getStatusIcon}
          getStatusColor={getStatusColor}
          darkMode={darkMode}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.pending}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.processing}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Shipped</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.shipped}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.delivered}</p>
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
                  ${stats?.totalValue?.toLocaleString() || '0'}
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
                  placeholder="Search orders by number, customer, or tracking number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e?.target?.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filters */}
              <OrderFilters
                filters={filters}
                onFiltersChange={setFilters}
                orders={orders}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>

        {/* Inventory Checks Alert */}
        <InventoryChecks
          orders={filteredOrders?.filter(o => ['pending', 'confirmed']?.includes(o?.status))}
          onInventoryAllocation={handleInventoryAllocation}
          darkMode={darkMode}
        />

        {/* Orders Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredOrders?.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {orders?.length === 0 ? 'No sales orders yet' : 'No orders match your search'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {orders?.length === 0 
                ? 'Create your first sales order to get started' 
                : 'Try adjusting your search criteria or filters'
              }
            </p>
            {orders?.length === 0 && (
              <button
                onClick={handleCreateOrder}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create First Order
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders?.map((order) => (
              <OrderCard
                key={order?.id}
                order={order}
                onView={() => handleViewOrder(order)}
                onEdit={() => handleEditOrder(order)}
                onDelete={() => handleDeleteOrder(order?.id)}
                onStatusUpdate={handleStatusUpdate}
                onPaymentStatusUpdate={handlePaymentStatusUpdate}
                onInventoryAllocation={() => handleInventoryAllocation(order?.id)}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                getPaymentStatusColor={getPaymentStatusColor}
                darkMode={darkMode}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesOrderProcessingSystem;