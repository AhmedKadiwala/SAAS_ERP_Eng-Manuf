import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const NavigationBreadcrumbs = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/main-dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/customer-directory': { label: 'Customers', icon: 'Users' },
    '/lead-pipeline-management': { label: 'Sales Pipeline', icon: 'TrendingUp' },
    '/modern-invoice-generator': { label: 'Invoicing', icon: 'FileText' },
    '/sales-analytics-suite': { label: 'Analytics', icon: 'BarChart3' },
    '/product-inventory-hub': { label: 'Inventory', icon: 'Package' },
    '/user-management-dashboard': { label: 'Team Management', icon: 'UserCog' },
    '/subscription-management': { label: 'Settings', icon: 'Settings' },
    '/company-onboarding-wizard': { label: 'Company Setup', icon: 'Building' },
    '/modern-login-screen': { label: 'Login', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/main-dashboard', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      const route = routeMap?.[currentPath];
      if (route) {
        breadcrumbs?.push({
          label: route?.label,
          path: currentPath,
          icon: route?.icon
        });
      }
    });

    // Remove duplicate home/dashboard entries
    if (breadcrumbs?.length > 1 && breadcrumbs?.[1]?.path === '/main-dashboard') {
      breadcrumbs?.splice(0, 1);
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => {
          const isLast = index === breadcrumbs?.length - 1;
          const isFirst = index === 0;

          return (
            <li key={crumb?.path} className="flex items-center space-x-2">
              {!isFirst && (
                <Icon 
                  name="ChevronRight" 
                  size={14} 
                  className="text-muted-foreground flex-shrink-0" 
                />
              )}
              {isLast ? (
                <div className="flex items-center space-x-2 text-foreground font-medium">
                  <Icon name={crumb?.icon} size={16} className="text-primary" />
                  <span>{crumb?.label}</span>
                </div>
              ) : (
                <button
                  onClick={() => handleNavigation(crumb?.path)}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-150 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 rounded-sm px-1 py-0.5"
                >
                  <Icon name={crumb?.icon} size={14} />
                  <span>{crumb?.label}</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default NavigationBreadcrumbs;