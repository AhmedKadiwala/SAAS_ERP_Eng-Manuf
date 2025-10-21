import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import { ToastProvider } from "components/ui/NotificationToast";
import NotFound from "pages/NotFound";
import LeadPipelineManagement from './pages/lead-pipeline-management';
import ModernLoginScreen from './pages/modern-login-screen';
import MainDashboard from './pages/main-dashboard';
import CustomerDirectory from './pages/customer-directory';
import UserManagementDashboard from './pages/user-management-dashboard';
import ModernInvoiceGenerator from './pages/modern-invoice-generator';
import SalesAnalyticsSuite from './pages/sales-analytics-suite';
import ProductInventoryHub from './pages/product-inventory-hub';
import SubscriptionManagement from './pages/subscription-management';
import CompanyOnboardingWizard from './pages/company-onboarding-wizard';
import QuotationCreatorManager from './pages/quotation-creator-manager';
import SalesOrderProcessingSystem from './pages/sales-order-processing-system';
import PaymentTrackingReceipts from './pages/payment-tracking-receipts';
import CustomerCommunicationHub from './pages/customer-communication-hub';
import BasicReportingAnalyticsDashboard from './pages/basic-reporting-analytics-dashboard';
import StockLevelDashboardWithAlerts from './pages/stock-level-dashboard-with-alerts';

const Routes = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ErrorBoundary>
          <ScrollToTop />
          <RouterRoutes>
            {/* Define your route here */}
            <Route path="/" element={<MainDashboard />} />
            <Route path="/lead-pipeline-management" element={<LeadPipelineManagement />} />
            <Route path="/modern-login-screen" element={<ModernLoginScreen />} />
            <Route path="/main-dashboard" element={<MainDashboard />} />
            <Route path="/customer-directory" element={<CustomerDirectory />} />
            <Route path="/user-management-dashboard" element={<UserManagementDashboard />} />
            <Route path="/modern-invoice-generator" element={<ModernInvoiceGenerator />} />
            <Route path="/sales-analytics-suite" element={<SalesAnalyticsSuite />} />
            <Route path="/product-inventory-hub" element={<ProductInventoryHub />} />
            <Route path="/subscription-management" element={<SubscriptionManagement />} />
            <Route path="/company-onboarding-wizard" element={<CompanyOnboardingWizard />} />
            <Route path="/quotation-creator-manager" element={<QuotationCreatorManager />} />
            <Route path="/sales-order-processing-system" element={<SalesOrderProcessingSystem />} />
            <Route path="/payment-tracking-receipts" element={<PaymentTrackingReceipts />} />
            <Route path="/customer-communication-hub" element={<CustomerCommunicationHub />} />
            <Route path="/basic-reporting-analytics-dashboard" element={<BasicReportingAnalyticsDashboard />} />
            <Route path="/stock-level-dashboard-with-alerts" element={<StockLevelDashboardWithAlerts />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </ErrorBoundary>
      </ToastProvider>
    </BrowserRouter>
  );
};

export default Routes;