import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const InvoicePreview = ({ invoiceData, customer, template }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showSignature, setShowSignature] = useState(false);

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const resetZoom = () => {
    setZoomLevel(100);
  };

  const generatePaymentLink = () => {
    const paymentUrl = `https://pay.modernerp.com/invoice/${invoiceData?.invoiceNumber || 'INV-2024-001'}`;
    navigator.clipboard?.writeText(paymentUrl);
    // Toast notification would go here
    console.log('Payment link copied to clipboard');
  };

  const printInvoice = () => {
    window.print();
  };

  const downloadPDF = () => {
    // PDF generation logic would go here
    console.log('Downloading PDF...');
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="h-full flex flex-col bg-muted/20">
      {/* Preview Header */}
      <div className="p-4 border-b border-border/50 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Invoice Preview</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Link" onClick={generatePaymentLink}>
              Payment Link
            </Button>
            <Button variant="outline" size="sm" iconName="Download" onClick={downloadPDF}>
              PDF
            </Button>
            <Button variant="outline" size="sm" iconName="Printer" onClick={printInvoice}>
              Print
            </Button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="ZoomOut" onClick={zoomOut} disabled={zoomLevel <= 50} />
          <span className="text-sm font-medium min-w-[60px] text-center">{zoomLevel}%</span>
          <Button variant="ghost" size="sm" iconName="ZoomIn" onClick={zoomIn} disabled={zoomLevel >= 200} />
          <Button variant="ghost" size="sm" onClick={resetZoom}>Reset</Button>
        </div>
      </div>
      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-4">
        <div 
          className="mx-auto bg-white shadow-floating rounded-lg overflow-hidden transition-transform duration-150"
          style={{ 
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            width: '8.5in',
            minHeight: '11in'
          }}
        >
          {/* Invoice Header */}
          <div className="p-8 border-b-2 border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Icon name="Zap" size={24} color="white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">ModernERP</h1>
                    <p className="text-sm text-gray-600">Business Suite</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>123 Business Street</p>
                  <p>San Francisco, CA 94105</p>
                  <p>contact@modernerp.com</p>
                  <p>(555) 123-4567</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h2>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Invoice #:</span> {invoiceData?.invoiceNumber || 'INV-2024-001'}</p>
                  <p><span className="font-medium">Date:</span> {formatDate(invoiceData?.invoiceDate || '2024-10-21')}</p>
                  <p><span className="font-medium">Due Date:</span> {formatDate(invoiceData?.dueDate || '2024-11-20')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="p-8 border-b border-gray-200">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
                {customer ? (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{customer?.name}</p>
                    <p>{customer?.email}</p>
                    <p>{customer?.phone}</p>
                    <div className="mt-2">
                      <p>{customer?.address}</p>
                      <p>{customer?.city}, {customer?.state} {customer?.zipCode}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">
                    <p>No customer selected</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms:</h3>
                <div className="text-sm text-gray-600">
                  <p>{invoiceData?.paymentTerms === 'net30' ? 'Net 30 Days' : 
                       invoiceData?.paymentTerms === 'net15' ? 'Net 15 Days' : 
                       invoiceData?.paymentTerms === 'immediate' ? 'Due Immediately' : 'Custom Terms'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-sm font-semibold text-gray-900">Description</th>
                  <th className="text-center py-3 text-sm font-semibold text-gray-900 w-20">Qty</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-24">Rate</th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-24">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData?.items && invoiceData?.items?.length > 0 ? (
                  invoiceData?.items?.map((item, index) => (
                    <tr key={item?.id || index} className="border-b border-gray-100">
                      <td className="py-3 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{item?.description || 'Item description'}</p>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-gray-600 text-center">{item?.quantity || 0}</td>
                      <td className="py-3 text-sm text-gray-600 text-right">${(item?.rate || 0)?.toFixed(2)}</td>
                      <td className="py-3 text-sm text-gray-900 text-right font-medium">${(item?.amount || 0)?.toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-400">
                      No items added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-8 flex justify-end">
              <div className="w-64">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="text-gray-900">${(invoiceData?.subtotal || 0)?.toFixed(2)}</span>
                  </div>
                  {invoiceData?.discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-gray-900">-${(invoiceData?.discount || 0)?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax ({invoiceData?.taxRate || 0}%):</span>
                    <span className="text-gray-900">${(invoiceData?.tax || 0)?.toFixed(2)}</span>
                  </div>
                  <div className="border-t-2 border-gray-200 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-blue-600">${(invoiceData?.total || 0)?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoiceData?.notes && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes:</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoiceData?.notes}</p>
              </div>
            )}

            {/* Digital Signature Placeholder */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Authorized Signature:</p>
                  <div className="w-48 h-16 border-b-2 border-gray-300 relative">
                    {showSignature && (
                      <div className="absolute bottom-0 left-0 text-lg font-signature text-gray-700">
                        John Smith
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">John Smith, CEO</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-2">Date:</p>
                  <div className="w-32 h-8 border-b-2 border-gray-300 flex items-end">
                    <span className="text-sm text-gray-700">{formatDate(new Date()?.toISOString())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Preview Actions */}
      <div className="p-4 border-t border-border/50 bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Preview ready for print</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSignature(!showSignature)}
            >
              {showSignature ? 'Hide' : 'Show'} Signature
            </Button>
            <Button variant="outline" size="sm" iconName="Eye">
              Client View
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;