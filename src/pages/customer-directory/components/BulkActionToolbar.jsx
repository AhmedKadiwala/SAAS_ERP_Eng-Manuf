import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionToolbar = ({ 
  selectedCount, 
  onClearSelection, 
  onBulkExport, 
  onBulkEmail, 
  onBulkTag, 
  onBulkDelete,
  isVisible 
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);

  const exportOptions = [
    { value: 'csv', label: 'Export as CSV' },
    { value: 'excel', label: 'Export as Excel' },
    { value: 'pdf', label: 'Export as PDF' }
  ];

  const tagOptions = [
    { value: 'vip', label: 'Add VIP Tag' },
    { value: 'high-value', label: 'Add High Value Tag' },
    { value: 'enterprise', label: 'Add Enterprise Tag' },
    { value: 'at-risk', label: 'Add At Risk Tag' },
    { value: 'remove-all', label: 'Remove All Tags' }
  ];

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await onBulkExport(format);
    } finally {
      setIsExporting(false);
    }
  };

  const handleBulkTag = (tagAction) => {
    onBulkTag(tagAction);
    setShowTagMenu(false);
  };

  if (!isVisible) return null;

  return (
    <div className={`
      fixed bottom-6 left-1/2 -translate-x-1/2 z-300
      glass-card p-4 shadow-floating border border-border/50
      transition-all duration-300 animate-slide-in
      max-w-4xl w-full mx-4
    `}>
      <div className="flex items-center justify-between">
        {/* Selection Info */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Check" size={16} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {selectedCount} customer{selectedCount !== 1 ? 's' : ''} selected
              </p>
              <p className="text-xs text-muted-foreground">
                Choose an action to apply to selected customers
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Export Dropdown */}
          <div className="relative">
            <Select
              options={exportOptions}
              value=""
              onChange={handleExport}
              placeholder="Export"
              disabled={isExporting}
              className="min-w-32"
            />
          </div>

          {/* Email Campaign */}
          <Button
            variant="outline"
            size="sm"
            iconName="Mail"
            iconPosition="left"
            onClick={onBulkEmail}
          >
            Email Campaign
          </Button>

          {/* Tag Management */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              iconName="Tag"
              iconPosition="left"
              onClick={() => setShowTagMenu(!showTagMenu)}
            >
              Manage Tags
            </Button>

            {showTagMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-popover border border-border rounded-lg shadow-floating z-10 animate-scale-in">
                <div className="p-2">
                  {tagOptions?.map((option) => (
                    <button
                      key={option?.value}
                      onClick={() => handleBulkTag(option?.value)}
                      className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-muted/50 rounded-md transition-colors duration-150"
                    >
                      <Icon 
                        name={option?.value === 'remove-all' ? 'Trash2' : 'Plus'} 
                        size={14} 
                        className={option?.value === 'remove-all' ? 'text-error' : 'text-muted-foreground'}
                      />
                      <span className={option?.value === 'remove-all' ? 'text-error' : ''}>
                        {option?.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            iconName="Trash2"
            onClick={onBulkDelete}
          />

          {/* Clear Selection */}
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClearSelection}
          />
        </div>
      </div>
      {/* Progress Bar for Export */}
      {isExporting && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Exporting customers...</span>
            <span className="text-muted-foreground">Processing</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-shimmer" style={{ width: '100%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionToolbar;