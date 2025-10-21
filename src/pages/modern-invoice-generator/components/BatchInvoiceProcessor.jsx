import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BatchInvoiceProcessor = ({ customers, products, templates, onBatchCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [batchSettings, setBatchSettings] = useState({
    invoiceDate: new Date()?.toISOString()?.split('T')?.[0],
    dueDate: '',
    paymentTerms: 'net30',
    taxRate: 10,
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);

  const customerOptions = customers?.map(customer => ({
    value: customer?.id,
    label: customer?.name,
    description: customer?.email
  }));

  const templateOptions = templates?.map(template => ({
    value: template?.id,
    label: template?.name,
    description: template?.description
  }));

  const paymentTermsOptions = [
    { value: 'immediate', label: 'Due Immediately' },
    { value: 'net15', label: 'Net 15 Days' },
    { value: 'net30', label: 'Net 30 Days' },
    { value: 'net60', label: 'Net 60 Days' }
  ];

  const handleBatchProcess = async () => {
    if (selectedCustomers?.length === 0 || !selectedTemplate) {
      return;
    }

    setIsProcessing(true);
    setProcessedCount(0);

    // Simulate batch processing
    for (let i = 0; i < selectedCustomers?.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing time
      setProcessedCount(i + 1);
    }

    // Call the actual batch creation function
    onBatchCreate({
      customers: selectedCustomers,
      template: selectedTemplate,
      settings: batchSettings
    });

    setIsProcessing(false);
    setIsOpen(false);
    
    // Reset form
    setSelectedCustomers([]);
    setSelectedTemplate('');
    setProcessedCount(0);
  };

  const calculateDueDate = (invoiceDate, terms) => {
    const date = new Date(invoiceDate);
    switch (terms) {
      case 'immediate':
        return date?.toISOString()?.split('T')?.[0];
      case 'net15':
        date?.setDate(date?.getDate() + 15);
        break;
      case 'net30':
        date?.setDate(date?.getDate() + 30);
        break;
      case 'net60':
        date?.setDate(date?.getDate() + 60);
        break;
      default:
        date?.setDate(date?.getDate() + 30);
    }
    return date?.toISOString()?.split('T')?.[0];
  };

  React.useEffect(() => {
    const dueDate = calculateDueDate(batchSettings?.invoiceDate, batchSettings?.paymentTerms);
    setBatchSettings(prev => ({ ...prev, dueDate }));
  }, [batchSettings?.invoiceDate, batchSettings?.paymentTerms]);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        iconName="Layers"
        onClick={() => setIsOpen(true)}
      >
        Batch Process
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-400 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-glass border border-border max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold gradient-text">Batch Invoice Generator</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create multiple invoices from a template
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => setIsOpen(false)}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {isProcessing ? (
            /* Processing View */
            (<div className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Loader2" size={32} className="text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Processing Invoices...</h3>
              <p className="text-muted-foreground mb-4">
                {processedCount} of {selectedCustomers?.length} invoices created
              </p>
              {/* Progress Bar */}
              <div className="w-full max-w-xs mx-auto bg-muted/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-primary transition-all duration-300"
                  style={{ width: `${(processedCount / selectedCustomers?.length) * 100}%` }}
                />
              </div>
            </div>)
          ) : (
            /* Configuration View */
            (<div className="space-y-6">
              {/* Template Selection */}
              <div>
                <Select
                  label="Invoice Template"
                  placeholder="Choose a template..."
                  options={templateOptions}
                  value={selectedTemplate}
                  onChange={setSelectedTemplate}
                  required
                />
              </div>
              {/* Customer Selection */}
              <div>
                <Select
                  label="Select Customers"
                  placeholder="Choose customers..."
                  options={customerOptions}
                  value={selectedCustomers}
                  onChange={setSelectedCustomers}
                  multiple
                  searchable
                  required
                />
                {selectedCustomers?.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedCustomers?.length} customer(s) selected
                  </p>
                )}
              </div>
              {/* Batch Settings */}
              <div className="glass-card p-4">
                <h3 className="font-medium mb-4">Batch Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      value={batchSettings?.invoiceDate}
                      onChange={(e) => setBatchSettings(prev => ({ ...prev, invoiceDate: e?.target?.value }))}
                      className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:bg-background transition-all duration-150"
                    />
                  </div>

                  <div>
                    <Select
                      label="Payment Terms"
                      options={paymentTermsOptions}
                      value={batchSettings?.paymentTerms}
                      onChange={(value) => setBatchSettings(prev => ({ ...prev, paymentTerms: value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={batchSettings?.dueDate}
                      onChange={(e) => setBatchSettings(prev => ({ ...prev, dueDate: e?.target?.value }))}
                      className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:bg-background transition-all duration-150"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-2 block">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      value={batchSettings?.taxRate}
                      onChange={(e) => setBatchSettings(prev => ({ ...prev, taxRate: parseFloat(e?.target?.value) || 0 }))}
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:bg-background transition-all duration-150"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Default Notes
                  </label>
                  <textarea
                    value={batchSettings?.notes}
                    onChange={(e) => setBatchSettings(prev => ({ ...prev, notes: e?.target?.value }))}
                    placeholder="Add default notes for all invoices..."
                    className="w-full h-20 px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-all duration-150 resize-none"
                  />
                </div>
              </div>
              {/* Preview Summary */}
              {selectedCustomers?.length > 0 && selectedTemplate && (
                <div className="glass-card p-4 bg-primary/5">
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <Icon name="FileText" size={16} />
                    <span>Batch Summary</span>
                  </h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">Invoices to create:</span> {selectedCustomers?.length}</p>
                    <p><span className="text-muted-foreground">Template:</span> {templates?.find(t => t?.id === selectedTemplate)?.name}</p>
                    <p><span className="text-muted-foreground">Invoice date:</span> {new Date(batchSettings.invoiceDate)?.toLocaleDateString()}</p>
                    <p><span className="text-muted-foreground">Due date:</span> {new Date(batchSettings.dueDate)?.toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>)
          )}
        </div>

        {/* Footer */}
        {!isProcessing && (
          <div className="p-6 border-t border-border/50">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                iconName="Play"
                onClick={handleBatchProcess}
                disabled={selectedCustomers?.length === 0 || !selectedTemplate}
              >
                Create {selectedCustomers?.length} Invoice{selectedCustomers?.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchInvoiceProcessor;