import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceActions = ({ 
  invoiceData, 
  onSave, 
  onSend, 
  onDuplicate, 
  onDelete,
  isLoading = false 
}) => {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [sendOptions, setSendOptions] = useState({
    email: true,
    sms: false,
    portal: true
  });

  const handleSend = () => {
    onSend(sendOptions);
  };

  const handleGeneratePaymentLink = () => {
    const paymentUrl = `https://pay.modernerp.com/invoice/${invoiceData?.invoiceNumber || 'INV-2024-001'}`;
    navigator.clipboard?.writeText(paymentUrl);
    // Toast notification would be triggered here
    console.log('Payment link copied to clipboard');
  };

  const handleScheduleSend = () => {
    // Schedule send logic would go here
    console.log('Schedule send dialog would open');
  };

  const quickActions = [
    {
      label: 'Save Draft',
      icon: 'Save',
      action: onSave,
      variant: 'outline',
      shortcut: 'Ctrl+S'
    },
    {
      label: 'Send Invoice',
      icon: 'Send',
      action: handleSend,
      variant: 'default',
      shortcut: 'Ctrl+Enter'
    },
    {
      label: 'Preview',
      icon: 'Eye',
      action: () => console.log('Preview'),
      variant: 'outline'
    }
  ];

  const moreActions = [
    {
      label: 'Duplicate Invoice',
      icon: 'Copy',
      action: onDuplicate,
      description: 'Create a copy of this invoice'
    },
    {
      label: 'Convert to Quote',
      icon: 'FileText',
      action: () => console.log('Convert to quote'),
      description: 'Convert this invoice to a quotation'
    },
    {
      label: 'Payment Link',
      icon: 'Link',
      action: handleGeneratePaymentLink,
      description: 'Generate secure payment link'
    },
    {
      label: 'Schedule Send',
      icon: 'Clock',
      action: handleScheduleSend,
      description: 'Schedule invoice delivery'
    },
    {
      label: 'Export PDF',
      icon: 'Download',
      action: () => console.log('Export PDF'),
      description: 'Download as PDF file'
    },
    {
      label: 'Print Invoice',
      icon: 'Printer',
      action: () => window.print(),
      description: 'Print invoice document'
    }
  ];

  const dangerActions = [
    {
      label: 'Delete Invoice',
      icon: 'Trash2',
      action: onDelete,
      description: 'Permanently delete this invoice',
      variant: 'destructive'
    }
  ];

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {quickActions?.map((action) => (
          <Button
            key={action?.label}
            variant={action?.variant}
            iconName={action?.icon}
            onClick={action?.action}
            loading={isLoading && action?.label === 'Send Invoice'}
            disabled={isLoading}
            title={action?.shortcut}
          >
            {action?.label}
          </Button>
        ))}
        
        <Button
          variant="ghost"
          iconName="MoreHorizontal"
          onClick={() => setShowMoreActions(!showMoreActions)}
          className={showMoreActions ? 'bg-muted/50' : ''}
        >
          More
        </Button>
      </div>
      {/* Send Options */}
      <div className="glass-card p-4">
        <h4 className="font-medium mb-3 flex items-center space-x-2">
          <Icon name="Send" size={16} />
          <span>Send Options</span>
        </h4>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendOptions?.email}
              onChange={(e) => setSendOptions(prev => ({ ...prev, email: e?.target?.checked }))}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/50"
            />
            <Icon name="Mail" size={16} className="text-muted-foreground" />
            <span className="text-sm">Send via Email</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendOptions?.sms}
              onChange={(e) => setSendOptions(prev => ({ ...prev, sms: e?.target?.checked }))}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/50"
            />
            <Icon name="MessageSquare" size={16} className="text-muted-foreground" />
            <span className="text-sm">Send SMS Notification</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendOptions?.portal}
              onChange={(e) => setSendOptions(prev => ({ ...prev, portal: e?.target?.checked }))}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary/50"
            />
            <Icon name="Globe" size={16} className="text-muted-foreground" />
            <span className="text-sm">Publish to Client Portal</span>
          </label>
        </div>
      </div>
      {/* More Actions Dropdown */}
      {showMoreActions && (
        <div className="glass-card p-4 animate-fade-in">
          <h4 className="font-medium mb-3">Additional Actions</h4>
          
          <div className="space-y-1">
            {moreActions?.map((action) => (
              <button
                key={action?.label}
                onClick={action?.action}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-150 text-left"
              >
                <Icon name={action?.icon} size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{action?.label}</p>
                  <p className="text-xs text-muted-foreground">{action?.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Danger Zone */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <h5 className="text-sm font-medium text-muted-foreground mb-2">Danger Zone</h5>
            {dangerActions?.map((action) => (
              <button
                key={action?.label}
                onClick={action?.action}
                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-error/10 transition-colors duration-150 text-left text-error"
              >
                <Icon name={action?.icon} size={16} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{action?.label}</p>
                  <p className="text-xs opacity-80">{action?.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Keyboard Shortcuts Help */}
      <div className="text-xs text-muted-foreground">
        <p>Shortcuts: Ctrl+S (Save), Ctrl+Enter (Send), Ctrl+P (Print)</p>
      </div>
    </div>
  );
};

export default InvoiceActions;