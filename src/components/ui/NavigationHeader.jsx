import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationHeader = ({ sidebarCollapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const primaryNavItems = [
    { label: 'Dashboard', path: '/main-dashboard', icon: 'LayoutDashboard' },
    { label: 'Pipeline', path: '/lead-pipeline-management', icon: 'TrendingUp' },
    { label: 'Customers', path: '/customer-directory', icon: 'Users' },
    { label: 'Analytics', path: '/sales-analytics-suite', icon: 'BarChart3' }
  ];

  const secondaryNavItems = [
    { label: 'Invoicing', path: '/modern-invoice-generator', icon: 'FileText' },
    { label: 'Inventory', path: '/product-inventory-hub', icon: 'Package' },
    { label: 'Team', path: '/user-management-dashboard', icon: 'UserCog' },
    { label: 'Settings', path: '/subscription-management', icon: 'Settings' }
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      // Implement global search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const QuickActions = () => (
    <div className="flex items-center space-x-2">
      {/* Quick Action Button */}
      <button className="p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150 ripple">
        <Icon name="Plus" size={18} />
      </button>
      
      {/* Notifications */}
      <button className="relative p-2 hover:bg-muted/50 rounded-lg transition-colors duration-150">
        <Icon name="Bell" size={18} />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full text-xs flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </span>
      </button>

      {/* User Menu */}
      <div className="flex items-center space-x-2 pl-2 border-l border-border/50">
        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-150">
          <Icon name="User" size={16} color="white" />
        </div>
      </div>
    </div>
  );

  const MoreMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-150
            hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50
            ${isOpen ? 'bg-muted/50' : ''}
          `}
        >
          <span className="text-sm font-medium">More</span>
          <Icon name="ChevronDown" size={16} className={`transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-floating z-300 animate-scale-in">
            <div className="p-2">
              {secondaryNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => {
                    handleNavigation(item?.path);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left
                    transition-colors duration-150 hover:bg-muted/50
                    ${location?.pathname === item?.path ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}
                  `}
                >
                  <Icon name={item?.icon} size={16} />
                  <span className="text-sm">{item?.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className={`
      fixed top-0 right-0 h-16 bg-card/95 backdrop-blur-glass border-b border-border z-100
      transition-all duration-300 ease-out shadow-elevated
      ${sidebarCollapsed ? 'left-16' : 'left-72'}
    `}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Navigation */}
        <nav className="flex items-center space-x-1">
          {primaryNavItems?.map((item) => {
            const isActive = location?.pathname === item?.path;
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg
                  transition-all duration-150 ease-out hover-lift
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  ${isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }
                `}
              >
                <Icon name={item?.icon} size={16} />
                <span className="text-sm font-medium">{item?.label}</span>
              </button>
            );
          })}
          <MoreMenu />
        </nav>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <div className={`
              relative flex items-center bg-muted/30 rounded-lg border transition-all duration-150
              ${isSearchFocused ? 'border-primary/50 bg-background' : 'border-transparent'}
            `}>
              <Icon name="Search" size={16} className="absolute left-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search customers, leads, invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-10 pr-4 py-2 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 hover:bg-muted/50 rounded-md transition-colors duration-150"
                >
                  <Icon name="X" size={14} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Section - Actions */}
        <QuickActions />
      </div>
    </header>
  );
};

export default NavigationHeader;