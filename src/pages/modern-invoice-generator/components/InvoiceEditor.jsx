import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InvoiceEditor = ({ 
  invoiceData, 
  onInvoiceChange, 
  customers, 
  products, 
  templates,
  onTemplateSelect 
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(invoiceData?.customerId || '');
  const [items, setItems] = useState(invoiceData?.items || []);
  const [taxRate, setTaxRate] = useState(invoiceData?.taxRate || 10);
  const [discountType, setDiscountType] = useState(invoiceData?.discountType || 'percentage');
  const [discountValue, setDiscountValue] = useState(invoiceData?.discountValue || 0);
  const [paymentTerms, setPaymentTerms] = useState(invoiceData?.paymentTerms || 'net30');
  const [notes, setNotes] = useState(invoiceData?.notes || '');

  const customerOptions = customers?.map(customer => ({
    value: customer?.id,
    label: customer?.name,
    description: customer?.email
  }));

  const productOptions = products?.map(product => ({
    value: product?.id,
    label: product?.name,
    description: `$${product?.price} - ${product?.sku}`
  }));

  const paymentTermsOptions = [
    { value: 'immediate', label: 'Due Immediately' },
    { value: 'net15', label: 'Net 15 Days' },
    { value: 'net30', label: 'Net 30 Days' },
    { value: 'net60', label: 'Net 60 Days' },
    { value: 'custom', label: 'Custom Terms' }
  ];

  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'CAD', label: 'CAD (C$)' }
  ];

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      productId: '',
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };

  const updateItem = (itemId, field, value) => {
    const updatedItems = items?.map(item => {
      if (item?.id === itemId) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem?.quantity * updatedItem?.rate;
        }
        if (field === 'productId') {
          const product = products?.find(p => p?.id === value);
          if (product) {
            updatedItem.description = product?.name;
            updatedItem.rate = product?.price;
            updatedItem.amount = updatedItem?.quantity * product?.price;
          }
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const removeItem = (itemId) => {
    setItems(items?.filter(item => item?.id !== itemId));
  };

  const calculateSubtotal = () => {
    return items?.reduce((sum, item) => sum + item?.amount, 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percentage') {
      return (subtotal * discountValue) / 100;
    }
    return discountValue;
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return ((subtotal - discount) * taxRate) / 100;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  useEffect(() => {
    const updatedInvoiceData = {
      customerId: selectedCustomer,
      items,
      taxRate,
      discountType,
      discountValue,
      paymentTerms,
      notes,
      subtotal: calculateSubtotal(),
      discount: calculateDiscount(),
      tax: calculateTax(),
      total: calculateTotal()
    };
    onInvoiceChange(updatedInvoiceData);
  }, [selectedCustomer, items, taxRate, discountType, discountValue, paymentTerms, notes]);

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold gradient-text">Create Invoice</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Save">
              Save Draft
            </Button>
            <Button variant="default" size="sm" iconName="Send">
              Send Invoice
            </Button>
          </div>
        </div>

        {/* Template Gallery */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Invoice Templates</h3>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {templates?.map((template) => (
              <button
                key={template?.id}
                onClick={() => onTemplateSelect(template)}
                className="flex-shrink-0 w-24 h-16 bg-muted/30 rounded-lg border-2 border-transparent hover:border-primary/50 transition-all duration-150 p-2 group"
              >
                <div className="w-full h-full bg-gradient-primary rounded opacity-20 group-hover:opacity-40 transition-opacity duration-150" />
                <span className="text-xs font-medium mt-1 block">{template?.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Invoice Number"
            type="text"
            value={invoiceData?.invoiceNumber || 'INV-2024-001'}
            placeholder="INV-2024-001"
            className="font-mono"
          />
          <Input
            label="Invoice Date"
            type="date"
            value={invoiceData?.invoiceDate || '2024-10-21'}
          />
        </div>

        {/* Customer Selection */}
        <div>
          <Select
            label="Bill To"
            placeholder="Select customer..."
            options={customerOptions}
            value={selectedCustomer}
            onChange={setSelectedCustomer}
            searchable
            required
          />
        </div>

        {/* Items Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Line Items</h3>
            <Button variant="outline" size="sm" iconName="Plus" onClick={addItem}>
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {items?.map((item, index) => (
              <div key={item?.id} className="glass-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Item #{index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    onClick={() => removeItem(item?.id)}
                    className="text-error hover:text-error"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select
                    label="Product/Service"
                    placeholder="Select product..."
                    options={productOptions}
                    value={item?.productId}
                    onChange={(value) => updateItem(item?.id, 'productId', value)}
                    searchable
                  />
                  <Input
                    label="Description"
                    type="text"
                    value={item?.description}
                    onChange={(e) => updateItem(item?.id, 'description', e?.target?.value)}
                    placeholder="Item description..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Input
                    label="Quantity"
                    type="number"
                    value={item?.quantity}
                    onChange={(e) => updateItem(item?.id, 'quantity', parseFloat(e?.target?.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                  <Input
                    label="Rate ($)"
                    type="number"
                    value={item?.rate}
                    onChange={(e) => updateItem(item?.id, 'rate', parseFloat(e?.target?.value) || 0)}
                    min="0"
                    step="0.01"
                  />
                  <Input
                    label="Amount ($)"
                    type="number"
                    value={item?.amount?.toFixed(2)}
                    disabled
                    className="bg-muted/30"
                  />
                </div>
              </div>
            ))}

            {items?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Package" size={32} className="mx-auto mb-2 opacity-50" />
                <p>No items added yet</p>
                <Button variant="outline" size="sm" iconName="Plus" onClick={addItem} className="mt-2">
                  Add First Item
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Calculations */}
        <div className="glass-card p-4">
          <h3 className="text-lg font-semibold mb-4">Calculations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Discount Type
              </label>
              <Select
                options={[
                  { value: 'percentage', label: 'Percentage (%)' },
                  { value: 'fixed', label: 'Fixed Amount ($)' }
                ]}
                value={discountType}
                onChange={setDiscountType}
              />
            </div>
            <Input
              label="Discount Value"
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(parseFloat(e?.target?.value) || 0)}
              min="0"
              step="0.01"
            />
            <Input
              label="Tax Rate (%)"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e?.target?.value) || 0)}
              min="0"
              max="100"
              step="0.01"
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-border/50">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${calculateSubtotal()?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Discount:</span>
              <span>-${calculateDiscount()?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax ({taxRate}%):</span>
              <span>${calculateTax()?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border/50">
              <span>Total:</span>
              <span className="text-primary">${calculateTotal()?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Payment Terms"
            options={paymentTermsOptions}
            value={paymentTerms}
            onChange={setPaymentTerms}
          />
          <Input
            label="Due Date"
            type="date"
            value={invoiceData?.dueDate || '2024-11-20'}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            Notes & Terms
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e?.target?.value)}
            placeholder="Add any additional notes or terms..."
            className="w-full h-24 px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-all duration-150 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceEditor;