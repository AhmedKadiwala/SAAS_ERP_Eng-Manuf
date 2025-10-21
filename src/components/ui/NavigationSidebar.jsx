import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationSidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/main-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Business overview and KPIs'
    },
    {
      label: 'Sales Pipeline',
      path: '/lead-pipeline-management',
      icon: 'TrendingUp',
      tooltip: 'Lead management and pipeline'
    },
    {
      label: 'Customers',
      path: '/customer-directory',
      icon: 'Users',
      tooltip: 'Customer relationship management'
    },
    {
      label: 'Invoicing',
      path: '/modern-invoice-generator',
      icon: 'FileText',
      tooltip: 'Invoice generation and management'
    },
    {
      label: 'Analytics',
      path: '/sales-analytics-suite',
      icon: 'BarChart3',
      tooltip: 'Sales performance analysis'
    },
    {
      label: 'Inventory',
      path: '/product-inventory-hub',
      icon: 'Package',
      tooltip: 'Product catalog and stock'
    },
    {
      label: 'Team',
      path: '/user-management-dashboard',
      icon: 'UserCog',
      tooltip: 'User management and roles'
    },
    {
      label: 'Settings',
      path: '/subscription-management',
      icon: 'Settings',
      tooltip: 'Account and subscription settings'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/main-dashboard');
    setIsMobileOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const Logo = () => (
    <div 
      className="flex items-center space-x-3 cursor-pointer group"
      onClick={handleLogoClick}
    >
      <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glass group-hover:scale-105 transition-transform duration-150">
        <Icon name="Zap" size={24} color="white" strokeWidth={2.5} />
      </div>
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-xl font-bold gradient-text">ModernERP</span>
          <span className="text-xs text-muted-foreground">Business Suite</span>
        </div>
      )}
    </div>
  );

  const NavigationItem = ({ item }) => {
    const isActive = location?.pathname === item?.path;
    
    return (
      <div className="relative group">
        <button
          onClick={() => handleNavigation(item?.path)}
          className={`
            w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg
            transition-all duration-150 ease-out
            hover:bg-muted/50 hover:scale-102 hover-lift
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
            ${isActive 
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-elevated' 
              : 'text-muted-foreground hover:text-foreground'
            }
            ${isCollapsed ? 'justify-center' : 'justify-start'}
          `}
          title={isCollapsed ? item?.tooltip : ''}
        >
          <Icon 
            name={item?.icon} 
            size={20} 
            className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`}
          />
          {!isCollapsed && (
            <span className="font-medium text-sm">{item?.label}</span>
          )}
          {isActive && !isCollapsed && (
            <div className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
          )}
        </button>
        {isCollapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-popover border border-border rounded-md shadow-floating opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-300 whitespace-nowrap">
            <span className="text-xs font-medium">{item?.label}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-200 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-300 md:hidden p-2 bg-card border border-border rounded-lg shadow-elevated hover:bg-muted/50 transition-colors duration-150"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={20} />
      </button>
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full bg-card/95 backdrop-blur-glass border-r border-border z-100
        transition-all duration-300 ease-out
        ${isCollapsed ? 'w-16' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        shadow-glass
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <Logo />
            {!isCollapsed && (
              <button
                onClick={onToggle}
                className="hidden md:flex p-1.5 hover:bg-muted/50 rounded-md transition-colors duration-150"
              >
                <Icon name="PanelLeftClose" size={16} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems?.map((item) => (
              <NavigationItem key={item?.path} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <div className={`
              flex items-center space-x-3 p-3 rounded-lg bg-muted/30
              ${isCollapsed ? 'justify-center' : 'justify-start'}
            `}>
              <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">Admin User</span>
                  <span className="text-xs text-muted-foreground truncate">admin@modernerp.com</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
      {/* Collapsed Sidebar Toggle */}
      {isCollapsed && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-20 z-100 hidden md:flex p-2 bg-card border border-border rounded-lg shadow-elevated hover:bg-muted/50 transition-colors duration-150"
        >
          <Icon name="PanelLeftOpen" size={16} />
        </button>
      )}
    </>
  );
};

export default NavigationSidebar;