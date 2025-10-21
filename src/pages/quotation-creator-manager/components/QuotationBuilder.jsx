import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Calculator, User, FileText, Package, Eye } from 'lucide-react';
import { quotationService, quotationLineItemService } from '../../../services/quotationService';
import { customerService } from '../../../services/customerService';
import ProductSelectionModal from './ProductSelectionModal';
import { useToast } from '../../../components/ui/NotificationToast';

const QuotationBuilder = ({ quotation, onClose, onSave, darkMode }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    customer_id: '',
    status: 'draft',
    valid_until: '',
    tax_rate: 10,
    discount_amount: 0,
    terms_and_conditions: 'Payment terms: Net 30 days. Valid for 30 days from issue date.',
    notes: ''
  });

  const [lineItems, setLineItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    taxAmount: 0,
    total: 0
  });

  const { showToast } = useToast();

  useEffect(() => {
    loadCustomers();
    
    if (quotation) {
      setFormData({
        title: quotation.title || '',
        description: quotation.description || '',
        customer_id: quotation.customer_id || '',
        status: quotation.status || 'draft',
        valid_until: quotation.valid_until || '',
        tax_rate: quotation.tax_rate || 10,
        discount_amount: quotation.discount_amount || 0,
        terms_and_conditions: quotation.terms_and_conditions || 'Payment terms: Net 30 days. Valid for 30 days from issue date.',
        notes: quotation.notes || ''
      });
      
      setLineItems(quotation.quotation_line_items || []);
      setSelectedCustomer(quotation.customer);
    }
  }, [quotation]);

  useEffect(() => {
    calculateTotals();
  }, [lineItems, formData.tax_rate, formData.discount_amount]);

  const loadCustomers = async () => {
    try {
      const { data, error } = await customerService.getCustomers();
      if (error) {
        showToast(error, 'error');
      } else {
        setCustomers(data || []);
      }
    } catch (error) {
      showToast('Failed to load customers', 'error');
    }
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.line_total || 0), 0);
    const taxAmount = (subtotal * (formData.tax_rate || 0)) / 100;
    const total = subtotal + taxAmount - (formData.discount_amount || 0);

    setCalculations({
      subtotal: subtotal,
      taxAmount: taxAmount,
      total: Math.max(0, total)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerChange = (e) => {
    const customerId = e.target.value;
    setFormData(prev => ({ ...prev, customer_id: customerId }));
    
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer);
  };

  const handleAddLineItem = (product) => {
    const newItem = {
      id: `temp_${Date.now()}`,
      product_id: product?.id || null,
      item_name: product?.name || 'Custom Item',
      description: product?.description || '',
      quantity: 1,
      unit_price: product?.price || 0,
      line_total: product?.price || 0,
      sort_order: lineItems.length
    };

    setLineItems(prev => [...prev, newItem]);
    setShowProductModal(false);
  };

  const handleLineItemChange = (index, field, value) => {
    setLineItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate line total when quantity or unit price changes
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.line_total = (updatedItem.quantity || 0) * (updatedItem.unit_price || 0);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const handleRemoveLineItem = (index) => {
    setLineItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.customer_id) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    if (lineItems.length === 0) {
      showToast('Please add at least one line item', 'error');
      return;
    }

    setLoading(true);
    try {
      const quotationData = {
        ...formData,
        subtotal: calculations.subtotal,
        tax_amount: calculations.taxAmount,
        total_amount: calculations.total,
        valid_until: formData.valid_until || null
      };

      let savedQuotation;
      
      if (quotation?.id) {
        // Update existing quotation
        const { data, error } = await quotationService.updateQuotation(quotation.id, quotationData);
        if (error) throw new Error(error);
        savedQuotation = data;
      } else {
        // Create new quotation
        const { data, error } = await quotationService.createQuotation(quotationData);
        if (error) throw new Error(error);
        savedQuotation = data;
      }

      // Save line items
      await saveLineItems(savedQuotation.id);
      
      showToast('Quotation saved successfully', 'success');
      onSave?.();
    } catch (error) {
      showToast(error.message || 'Failed to save quotation', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveLineItems = async (quotationId) => {
    // Remove existing line items if updating
    if (quotation?.id) {
      for (const existingItem of quotation.quotation_line_items || []) {
        const stillExists = lineItems.find(item => item.id === existingItem.id);
        if (!stillExists) {
          await quotationLineItemService.removeLineItem(existingItem.id);
        }
      }
    }

    // Save or update line items
    for (const item of lineItems) {
      if (item.id?.toString()?.startsWith('temp_')) {
        // Create new line item
        const { id, ...itemData } = item;
        await quotationLineItemService.addLineItem(quotationId, itemData);
      } else if (quotation?.id) {
        // Update existing line item
        const { id, ...itemData } = item;
        await quotationLineItemService.updateLineItem(id, itemData);
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {quotation ? 'Edit Quotation' : 'Create New Quotation'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {quotation ? `Editing ${quotation.quotation_number}` : 'Build your quotation with real-time preview'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Quotation'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Form Builder */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Basic Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter quotation title"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter quotation description"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      name="valid_until"
                      value={formData.valid_until}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Customer *
                  </label>
                  <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleCustomerChange}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a customer</option>
                    {customers?.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.company_name} - {customer.contact_person}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCustomer && (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                        <p className="text-gray-900 dark:text-white font-medium">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                        <p className="text-gray-900 dark:text-white font-medium">{selectedCustomer.phone || 'N/A'}</p>
                      </div>
                      {selectedCustomer.location && (
                        <div className="col-span-2">
                          <span className="text-gray-600 dark:text-gray-400">Location:</span>
                          <p className="text-gray-900 dark:text-white font-medium">{selectedCustomer.location}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Line Items
                  </h3>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Item
                  </button>
                </div>
              </div>
              <div className="p-6">
                {lineItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No items added yet</p>
                    <button
                      onClick={() => setShowProductModal(true)}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add First Item
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lineItems.map((item, index) => (
                      <div key={item.id || index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          <div className="md:col-span-4">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Item Name
                            </label>
                            <input
                              type="text"
                              value={item.item_name}
                              onChange={(e) => handleLineItemChange(index, 'item_name', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Quantity
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Unit Price
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.unit_price}
                              onChange={(e) => handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Total
                            </label>
                            <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded text-sm font-medium text-gray-900 dark:text-white">
                              ${item.line_total?.toFixed(2) || '0.00'}
                            </div>
                          </div>
                          
                          <div className="md:col-span-2 flex justify-end items-end">
                            <button
                              onClick={() => handleRemoveLineItem(index)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {item.description && (
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                              Description
                            </label>
                            <textarea
                              value={item.description}
                              onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                              rows="2"
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Financial Details
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      name="tax_rate"
                      value={formData.tax_rate}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Discount Amount
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="discount_amount"
                      value={formData.discount_amount}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Terms & Notes
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Terms and Conditions
                  </label>
                  <textarea
                    name="terms_and_conditions"
                    value={formData.terms_and_conditions}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Internal notes (not visible to customer)"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Preview */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </h3>
              </div>
              <div className="p-6">
                {/* Preview Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    QUOTATION
                  </h2>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Date: {new Date().toLocaleDateString()}</p>
                      <p className="text-gray-600 dark:text-gray-400">Valid Until: {formData.valid_until || 'Not specified'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600 dark:text-gray-400">Status: {formData.status}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                {selectedCustomer && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Bill To:</h4>
                    <p className="text-gray-900 dark:text-white font-medium">{selectedCustomer.company_name}</p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedCustomer.contact_person}</p>
                    <p className="text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
                    {selectedCustomer.location && (
                      <p className="text-gray-600 dark:text-gray-400">{selectedCustomer.location}</p>
                    )}
                  </div>
                )}

                {/* Title and Description */}
                {formData.title && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{formData.title}</h3>
                    {formData.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2">{formData.description}</p>
                    )}
                  </div>
                )}

                {/* Line Items Preview */}
                {lineItems.length > 0 && (
                  <div className="mb-6">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-600">
                            <th className="text-left py-2 text-gray-900 dark:text-white">Item</th>
                            <th className="text-right py-2 text-gray-900 dark:text-white">Qty</th>
                            <th className="text-right py-2 text-gray-900 dark:text-white">Price</th>
                            <th className="text-right py-2 text-gray-900 dark:text-white">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lineItems.map((item, index) => (
                            <tr key={index} className="border-b border-gray-100 dark:border-gray-700">
                              <td className="py-2">
                                <div>
                                  <p className="text-gray-900 dark:text-white font-medium">{item.item_name}</p>
                                  {item.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-xs">{item.description}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-2 text-right text-gray-900 dark:text-white">{item.quantity}</td>
                              <td className="py-2 text-right text-gray-900 dark:text-white">${item.unit_price?.toFixed(2)}</td>
                              <td className="py-2 text-right text-gray-900 dark:text-white font-medium">${item.line_total?.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-2 border-t border-gray-200 dark:border-gray-600 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-gray-900 dark:text-white">${calculations.subtotal.toFixed(2)}</span>
                  </div>
                  {formData.tax_rate > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax ({formData.tax_rate}%):</span>
                      <span className="text-gray-900 dark:text-white">${calculations.taxAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {formData.discount_amount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                      <span className="text-gray-900 dark:text-white">-${formData.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-600 pt-2">
                    <span className="text-gray-900 dark:text-white">Total:</span>
                    <span className="text-gray-900 dark:text-white">${calculations.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Terms Preview */}
                {formData.terms_and_conditions && (
                  <div className="mt-6 text-xs text-gray-600 dark:text-gray-400">
                    <h5 className="font-medium text-gray-900 dark:text-white mb-2">Terms & Conditions:</h5>
                    <p>{formData.terms_and_conditions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Selection Modal */}
      {showProductModal && (
        <ProductSelectionModal
          onSelect={handleAddLineItem}
          onClose={() => setShowProductModal(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default QuotationBuilder;