import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceHistory = ({ invoices }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const getStatusColor = (status) => {
    const colors = {
      paid: 'text-success bg-success/10 border-success/20',
      pending: 'text-warning bg-warning/10 border-warning/20',
      failed: 'text-error bg-error/10 border-error/20',
      refunded: 'text-muted-foreground bg-muted/10 border-muted/20'
    };
    return colors?.[status?.toLowerCase()] || colors?.pending;
  };

  const getStatusIcon = (status) => {
    const icons = {
      paid: 'CheckCircle',
      pending: 'Clock',
      failed: 'XCircle',
      refunded: 'RotateCcw'
    };
    return icons?.[status?.toLowerCase()] || 'Clock';
  };

  const filteredInvoices = invoices?.filter(invoice => {
    if (selectedPeriod === 'all') return true;
    const invoiceDate = new Date(invoice.date);
    const now = new Date();
    
    switch (selectedPeriod) {
      case '3months':
        return invoiceDate >= new Date(now.setMonth(now.getMonth() - 3));
      case '6months':
        return invoiceDate >= new Date(now.setMonth(now.getMonth() - 6));
      case '1year':
        return invoiceDate >= new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return true;
    }
  });

  const InvoiceRow = ({ invoice }) => (
    <div className="glass-card p-4 hover-lift">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>
          
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h4 className="font-semibold text-foreground">{invoice?.number}</h4>
              <span className={`
                px-2 py-1 rounded-full text-xs font-medium border
                ${getStatusColor(invoice?.status)}
              `}>
                <Icon name={getStatusIcon(invoice?.status)} size={12} className="inline mr-1" />
                {invoice?.status?.charAt(0)?.toUpperCase() + invoice?.status?.slice(1)}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{invoice?.date}</span>
              <span>•</span>
              <span>{invoice?.plan}</span>
              <span>•</span>
              <span>{invoice?.period}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-bold text-foreground text-lg">${invoice?.amount}</p>
            {invoice?.tax > 0 && (
              <p className="text-sm text-muted-foreground">+${invoice?.tax} tax</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              onClick={() => window.open(invoice?.pdfUrl, '_blank')}
            >
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Eye"
              onClick={() => window.open(invoice?.viewUrl, '_blank')}
            >
              View
            </Button>
          </div>
        </div>
      </div>

      {invoice?.paymentMethod && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="CreditCard" size={14} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {invoice?.paymentMethod?.type} •••• {invoice?.paymentMethod?.last4}
              </span>
            </div>
            {invoice?.nextBilling && (
              <span className="text-muted-foreground">
                Next billing: {invoice?.nextBilling}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const totalAmount = filteredInvoices?.reduce((sum, invoice) => sum + invoice?.amount + invoice?.tax, 0);
  const paidAmount = filteredInvoices?.filter(invoice => invoice?.status === 'paid')?.reduce((sum, invoice) => sum + invoice?.amount + invoice?.tax, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Invoice History</h2>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e?.target?.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Time</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export All
          </Button>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Receipt" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-xl font-bold text-foreground">{filteredInvoices?.length}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-xl font-bold text-foreground">${paidAmount?.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="TrendingUp" size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold text-foreground">${totalAmount?.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Invoice List */}
      <div className="space-y-4">
        {filteredInvoices?.length > 0 ? (
          filteredInvoices?.map((invoice) => (
            <InvoiceRow key={invoice?.id} invoice={invoice} />
          ))
        ) : (
          <div className="glass-card p-8 text-center">
            <Icon name="FileX" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Invoices Found</h3>
            <p className="text-muted-foreground">
              No invoices found for the selected period.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceHistory;