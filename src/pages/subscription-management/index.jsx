import React, { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionButton from '../../components/ui/QuickActionButton';
import { useToast } from '../../components/ui/NotificationToast';
import CurrentPlanCard from './components/CurrentPlanCard';
import UsageMetrics from './components/UsageMetrics';
import PlanComparison from './components/PlanComparison';
import PaymentMethods from './components/PaymentMethods';
import InvoiceHistory from './components/InvoiceHistory';
import BillingAnalytics from './components/BillingAnalytics';

const SubscriptionManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Mock data
  const currentPlan = {
    id: 'pro',
    name: 'Professional',
    price: 49,
    billing: 'month',
    nextBilling: 'Nov 21, 2024',
    status: 'active'
  };

  const usageData = [
    {
      id: 'users',
      name: 'Team Members',
      description: 'Active user accounts',
      icon: 'Users',
      used: 8,
      limit: 15,
      percentage: 53
    },
    {
      id: 'storage',
      name: 'Storage Space',
      description: 'File storage usage',
      icon: 'HardDrive',
      used: 45,
      limit: 100,
      percentage: 45
    },
    {
      id: 'api',
      name: 'API Calls',
      description: 'Monthly API requests',
      icon: 'Zap',
      used: 8500,
      limit: 10000,
      percentage: 85
    }
  ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small teams getting started',
      icon: 'Rocket',
      monthlyPrice: 19,
      yearlyPrice: 190,
      popular: false,
      features: [
        'Up to 5 team members',
        '10GB storage space',
        'Basic analytics',
        'Email support',
        'Standard integrations'
      ],
      limits: {
        users: '5',
        storage: '10GB',
        apiCalls: '5,000/month'
      }
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'Advanced features for growing businesses',
      icon: 'Crown',
      monthlyPrice: 49,
      yearlyPrice: 490,
      popular: true,
      features: [
        'Up to 15 team members',
        '100GB storage space',
        'Advanced analytics',
        'Priority support',
        'Premium integrations',
        'Custom workflows'
      ],
      limits: {
        users: '15',
        storage: '100GB',
        apiCalls: '10,000/month'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      icon: 'Building',
      monthlyPrice: 99,
      yearlyPrice: 990,
      popular: false,
      features: [
        'Unlimited team members',
        '1TB storage space',
        'Enterprise analytics',
        '24/7 phone support',
        'All integrations',
        'Custom development',
        'Dedicated account manager'
      ],
      limits: {
        users: 'Unlimited',
        storage: '1TB',
        apiCalls: 'Unlimited'
      }
    }
  ];

  const paymentMethods = [
    {
      id: '1',
      type: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: '2',
      type: 'Mastercard',
      last4: '8888',
      expiry: '08/26',
      isDefault: false
    }
  ];

  const invoices = [
    {
      id: 'INV-001',
      number: 'INV-2024-001',
      date: 'Oct 21, 2024',
      amount: 49.00,
      tax: 4.90,
      status: 'paid',
      plan: 'Professional',
      period: 'Oct 2024 - Nov 2024',
      paymentMethod: { type: 'Visa', last4: '4242' },
      nextBilling: 'Nov 21, 2024',
      pdfUrl: '#',
      viewUrl: '#'
    },
    {
      id: 'INV-002',
      number: 'INV-2024-002',
      date: 'Sep 21, 2024',
      amount: 49.00,
      tax: 4.90,
      status: 'paid',
      plan: 'Professional',
      period: 'Sep 2024 - Oct 2024',
      paymentMethod: { type: 'Visa', last4: '4242' },
      pdfUrl: '#',
      viewUrl: '#'
    },
    {
      id: 'INV-003',
      number: 'INV-2024-003',
      date: 'Aug 21, 2024',
      amount: 19.00,
      tax: 1.90,
      status: 'paid',
      plan: 'Starter',
      period: 'Aug 2024 - Sep 2024',
      paymentMethod: { type: 'Mastercard', last4: '8888' },
      pdfUrl: '#',
      viewUrl: '#'
    }
  ];

  const handlePlanSelect = (plan) => {
    toast?.success(`Plan upgrade to ${plan?.name} initiated`, {
      description: 'You will be redirected to complete the payment process.'
    });
  };

  const handleAddPaymentMethod = () => {
    toast?.success('Payment method added successfully');
  };

  const handleEditPaymentMethod = (method) => {
    toast?.info(`Editing payment method ending in ${method?.last4}`);
  };

  const handleDeletePaymentMethod = (methodId) => {
    toast?.success('Payment method removed successfully');
  };

  const handleSetDefaultPaymentMethod = (methodId) => {
    toast?.success('Default payment method updated');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'plans', label: 'Plans', icon: 'Package' },
    { id: 'payment', label: 'Payment', icon: 'CreditCard' },
    { id: 'invoices', label: 'Invoices', icon: 'FileText' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ];

  useEffect(() => {
    document.title = 'Subscription Management - ModernERP';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-72'}`}>
        <NavigationHeader sidebarCollapsed={sidebarCollapsed} />
        
        <main className="pt-16 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <NavigationBreadcrumbs />
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">Subscription Management</h1>
                <p className="text-muted-foreground mt-2">
                  Manage your subscription, billing, and payment methods
                </p>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="glass-card p-2">
              <nav className="flex space-x-2">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                      ${activeTab === tab?.id
                        ? 'bg-primary text-white shadow-elevated'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    <span className="text-xs">{tab?.icon}</span>
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <CurrentPlanCard currentPlan={currentPlan} />
                    <UsageMetrics usageData={usageData} />
                  </div>
                  <div className="space-y-6">
                    <div className="glass-card p-6">
                      <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                      <div className="space-y-3">
                        <button
                          onClick={() => setActiveTab('plans')}
                          className="w-full flex items-center space-x-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors duration-150"
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <span className="text-xs">📦</span>
                          </div>
                          <span className="text-sm font-medium">Upgrade Plan</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('payment')}
                          className="w-full flex items-center space-x-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors duration-150"
                        >
                          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                            <span className="text-xs">💳</span>
                          </div>
                          <span className="text-sm font-medium">Add Payment Method</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('invoices')}
                          className="w-full flex items-center space-x-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors duration-150"
                        >
                          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                            <span className="text-xs">📄</span>
                          </div>
                          <span className="text-sm font-medium">View Invoices</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'plans' && (
                <PlanComparison
                  plans={plans}
                  currentPlanId={currentPlan?.id}
                  onPlanSelect={handlePlanSelect}
                />
              )}

              {activeTab === 'payment' && (
                <PaymentMethods
                  paymentMethods={paymentMethods}
                  onAddMethod={handleAddPaymentMethod}
                  onEditMethod={handleEditPaymentMethod}
                  onDeleteMethod={handleDeletePaymentMethod}
                  onSetDefault={handleSetDefaultPaymentMethod}
                />
              )}

              {activeTab === 'invoices' && (
                <InvoiceHistory invoices={invoices} />
              )}

              {activeTab === 'analytics' && (
                <BillingAnalytics analyticsData={{
                  monthlyRevenue: [
                    { month: 'Jan', revenue: 4900, subscriptions: 100 },
                    { month: 'Feb', revenue: 5390, subscriptions: 110 },
                    { month: 'Mar', revenue: 5880, subscriptions: 120 },
                    { month: 'Apr', revenue: 6370, subscriptions: 130 },
                    { month: 'May', revenue: 6860, subscriptions: 140 },
                    { month: 'Jun', revenue: 7350, subscriptions: 150 }
                  ],
                  planDistribution: [
                    { plan: 'Starter', count: 45, percentage: 30 },
                    { plan: 'Professional', count: 75, percentage: 50 },
                    { plan: 'Enterprise', count: 30, percentage: 20 }
                  ],
                  churnRate: 3.2,
                  totalMrr: 7350,
                  growthRate: 12.5
                }} />
              )}
            </div>
          </div>
        </main>
      </div>
      <QuickActionButton />
    </div>
  );
};

export default SubscriptionManagement;