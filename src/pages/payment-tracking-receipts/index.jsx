import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, TrendingUp, Filter, Plus, Download, Receipt, AlertCircle, CheckCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';

const PaymentTrackingReceipts = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [overduePayments, setOverduePayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    customerId: ''
  });
  
  // Modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Form states
  const [transactionForm, setTransactionForm] = useState({
    invoice_id: '',
    payment_method_id: '',
    customer_id: '',
    amount: '',
    currency_code: 'USD',
    status: 'pending',
    payment_date: '',
    notes: ''
  });

  const [paymentMethodForm, setPaymentMethodForm] = useState({
    customer_id: '',
    method_type: 'credit_card',
    method_name: '',
    account_number: '',
    is_default: false
  });

  useEffect(() => {
    if (user) {
      loadPaymentData();
    }
  }, [user, filters]);

  const loadPaymentData = async () => {
    setLoading(true);
    try {
      const [transactionData, paymentMethodData, overdueData, analyticsData] = await Promise.all([
        paymentService?.getPaymentTransactions(filters),
        paymentService?.getPaymentMethods(),
        paymentService?.getOverduePayments(),
        paymentService?.getPaymentAnalytics(
          filters?.dateFrom || new Date(new Date().getFullYear(), 0, 1)?.toISOString(),
          filters?.dateTo || new Date()?.toISOString()
        )
      ]);

      setTransactions(transactionData || []);
      setPaymentMethods(paymentMethodData || []);
      setOverduePayments(overdueData || []);
      setAnalytics(analyticsData || {});
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (e) => {
    e?.preventDefault();
    try {
      await paymentService?.createPaymentTransaction(transactionForm);
      setShowTransactionModal(false);
      setTransactionForm({
        invoice_id: '',
        payment_method_id: '',
        customer_id: '',
        amount: '',
        currency_code: 'USD',
        status: 'pending',
        payment_date: '',
        notes: ''
      });
      loadPaymentData();
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  const handleCreatePaymentMethod = async (e) => {
    e?.preventDefault();
    try {
      await paymentService?.createPaymentMethod(paymentMethodForm);
      setShowPaymentMethodModal(false);
      setPaymentMethodForm({
        customer_id: '',
        method_type: 'credit_card',
        method_name: '',
        account_number: '',
        is_default: false
      });
      loadPaymentData();
    } catch (error) {
      console.error('Error creating payment method:', error);
    }
  };

  const handleUpdatePaymentStatus = async (transactionId, status) => {
    try {
      await paymentService?.updatePaymentStatus(
        transactionId, 
        status, 
        status === 'completed' ? new Date()?.toISOString() : null
      );
      loadPaymentData();
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const handleRefund = async (transactionId, refundAmount) => {
    try {
      await paymentService?.processRefund(transactionId, refundAmount);
      loadPaymentData();
    } catch (error) {
      console.error('Error processing refund:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'refunded': return <RefreshCw className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'refunded': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Payment Tracking & Receipts
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage payment transactions, methods, and receipts
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPaymentMethodModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Add Payment Method
                </button>
                <button
                  onClick={() => setShowTransactionModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Revenue
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    ${analytics?.totalRevenue?.toLocaleString() || '0'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Total Transactions
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {analytics?.totalTransactions || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Overdue Payments
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {overduePayments?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="w-8 h-8 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Payment Methods
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {paymentMethods?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters?.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e?.target?.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters?.dateFrom || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e?.target?.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters?.dateTo || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e?.target?.value }))}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={loadPaymentData}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Payment Transactions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Payment Transactions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions?.map((transaction) => (
                  <tr key={transaction?.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Receipt className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction?.transaction_reference}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Invoice: {transaction?.invoice?.invoice_number}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction?.customer?.company_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction?.customer?.contact_person}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {transaction?.currency_code} ${Math.abs(parseFloat(transaction?.amount || 0))?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(transaction?.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction?.status)}`}>
                          {transaction?.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction?.payment_date ? 
                        new Date(transaction.payment_date)?.toLocaleDateString() : 
                        'Pending'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {transaction?.status === 'pending' && (
                          <button
                            onClick={() => handleUpdatePaymentStatus(transaction?.id, 'completed')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {transaction?.status === 'completed' && parseFloat(transaction?.amount) > 0 && (
                          <button
                            onClick={() => handleRefund(transaction?.id, parseFloat(transaction?.amount))}
                            className="text-blue-600 hover:text-blue-900"
                            title="Process Refund"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          className="text-gray-600 hover:text-gray-900"
                          title="Download Receipt"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  New Payment Transaction
                </h3>
                <button
                  onClick={() => setShowTransactionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateTransaction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={transactionForm?.amount}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={transactionForm?.status}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, status: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    rows={3}
                    value={transactionForm?.notes}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, notes: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowTransactionModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Payment Method Modal */}
      {showPaymentMethodModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Add Payment Method
                </h3>
                <button
                  onClick={() => setShowPaymentMethodModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreatePaymentMethod} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Method Type
                  </label>
                  <select
                    value={paymentMethodForm?.method_type}
                    onChange={(e) => setPaymentMethodForm(prev => ({ ...prev, method_type: e?.target?.value }))}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Method Name
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentMethodForm?.method_name}
                    onChange={(e) => setPaymentMethodForm(prev => ({ ...prev, method_name: e?.target?.value }))}
                    placeholder="e.g., Visa ending 4242"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Account Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={paymentMethodForm?.account_number}
                    onChange={(e) => setPaymentMethodForm(prev => ({ ...prev, account_number: e?.target?.value }))}
                    placeholder="**** **** **** 4242"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_default"
                    checked={paymentMethodForm?.is_default}
                    onChange={(e) => setPaymentMethodForm(prev => ({ ...prev, is_default: e?.target?.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Set as default payment method
                  </label>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPaymentMethodModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Payment Method
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTrackingReceipts;