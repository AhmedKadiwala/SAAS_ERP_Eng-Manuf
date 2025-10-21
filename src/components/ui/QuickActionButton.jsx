import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const QuickActionButton = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const getContextualActions = () => {
    const path = location?.pathname;
    
    switch (path) {
      case '/customer-directory':
        return [
          { label: 'Add Customer', icon: 'UserPlus', action: () => console.log('Add customer') },
          { label: 'Import Contacts', icon: 'Upload', action: () => console.log('Import contacts') }
        ];
      
      case '/lead-pipeline-management':
        return [
          { label: 'Add Lead', icon: 'Plus', action: () => console.log('Add lead') },
          { label: 'Create Deal', icon: 'Handshake', action: () => console.log('Create deal') }
        ];
      
      case '/modern-invoice-generator':
        return [
          { label: 'New Invoice', icon: 'FileText', action: () => console.log('New invoice') },
          { label: 'Quick Quote', icon: 'Calculator', action: () => console.log('Quick quote') }
        ];
      
      case '/product-inventory-hub':
        return [
          { label: 'Add Product', icon: 'Package', action: () => console.log('Add product') },
          { label: 'Stock Update', icon: 'RefreshCw', action: () => console.log('Stock update') }
        ];
      
      case '/user-management-dashboard':
        return [
          { label: 'Invite User', icon: 'UserPlus', action: () => console.log('Invite user') },
          { label: 'Create Role', icon: 'Shield', action: () => console.log('Create role') }
        ];
      
      default:
        return [
          { label: 'Quick Add', icon: 'Plus', action: () => console.log('Quick add') },
          { label: 'New Task', icon: 'CheckSquare', action: () => console.log('New task') }
        ];
    }
  };

  const actions = getContextualActions();
  const primaryAction = actions?.[0];

  const handlePrimaryAction = () => {
    if (actions?.length === 1) {
      primaryAction?.action();
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const handleActionClick = (action) => {
    action?.action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-400">
      {/* Expanded Actions */}
      {isExpanded && actions?.length > 1 && (
        <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
          {actions?.slice(1)?.reverse()?.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className="flex items-center space-x-3 bg-card border border-border rounded-lg px-4 py-3 shadow-floating hover:shadow-glass hover:scale-105 transition-all duration-150 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-150">
                <Icon name={action?.icon} size={18} className="group-hover:text-primary transition-colors duration-150" />
              </div>
              <span className="text-sm font-medium whitespace-nowrap">{action?.label}</span>
            </button>
          ))}
        </div>
      )}
      {/* Primary Action Button */}
      <button
        onClick={handlePrimaryAction}
        className="w-14 h-14 bg-gradient-primary rounded-full shadow-floating hover:shadow-glass hover:scale-110 transition-all duration-150 ripple group focus:outline-none focus:ring-4 focus:ring-primary/30"
      >
        <Icon 
          name={isExpanded ? 'X' : primaryAction?.icon} 
          size={24} 
          color="white" 
          className={`transition-transform duration-150 ${isExpanded ? 'rotate-90' : 'group-hover:scale-110'}`}
        />
      </button>
      {/* Action Count Indicator */}
      {actions?.length > 1 && !isExpanded && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-elevated">
          <span className="text-xs font-bold text-accent-foreground">{actions?.length}</span>
        </div>
      )}
      {/* Backdrop for mobile */}
      {isExpanded && (
        <div 
          className="fixed inset-0 -z-10 md:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
};

export default QuickActionButton;