import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationSidebar from '../../components/ui/NavigationSidebar';
import NavigationHeader from '../../components/ui/NavigationHeader';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionButton from '../../components/ui/QuickActionButton';
import Icon from '../../components/AppIcon';


// Import components
import InvoiceEditor from './components/InvoiceEditor';
import InvoicePreview from './components/InvoicePreview';
import InvoiceTemplateGallery from './components/InvoiceTemplateGallery';
import InvoiceActions from './components/InvoiceActions';
import BatchInvoiceProcessor from './components/BatchInvoiceProcessor';

const ModernInvoiceGenerator = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('split'); // split, editor, preview
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'INV-2024-001',
    invoiceDate: '2024-10-21',
    dueDate: '2024-11-20',
    customerId: '',
    items: [],
    taxRate: 10,
    discountType: 'percentage',
    discountValue: 0,
    paymentTerms: 'net30',
    notes: '',
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockCustomers = [
    {
      id: 1,
      name: "Acme Corporation",
      email: "billing@acme.com",
      phone: "(555) 123-4567",
      address: "123 Business Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105"
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      email: "accounts@techsolutions.com",
      phone: "(555) 987-6543",
      address: "456 Innovation Drive",
      city: "Austin",
      state: "TX",
      zipCode: "73301"
    },
    {
      id: 3,
      name: "Global Enterprises",
      email: "finance@globalent.com",
      phone: "(555) 456-7890",
      address: "789 Corporate Blvd",
      city: "New York",
      state: "NY",
      zipCode: "10001"
    }
  ];

  const mockProducts = [
    {
      id: 1,
      name: "Premium Software License",
      sku: "PSL-001",
      price: 299.00,
      description: "Annual premium software license with full support"
    },
    {
      id: 2,
      name: "Consulting Services",
      sku: "CS-001",
      price: 150.00,
      description: "Professional consulting services per hour"
    },
    {
      id: 3,
      name: "Training Workshop",
      sku: "TW-001",
      price: 500.00,
      description: "Full-day training workshop for up to 10 participants"
    },
    {
      id: 4,
      name: "Support Package",
      sku: "SP-001",
      price: 99.00,
      description: "Monthly premium support package"
    }
  ];

  const mockTemplates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean, contemporary design with gradients',
      features: ['Gradient header', 'Modern typography', 'Glass effects']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, clean layout with minimal styling',
      features: ['Clean lines', 'Minimal colors', 'Professional']
    },
    {
      id: 'corporate',
      name: 'Corporate',
      description: 'Traditional business invoice template',
      features: ['Corporate colors', 'Professional layout', 'Traditional']
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold, creative design for agencies',
      features: ['Bold colors', 'Creative layout', 'Eye-catching']
    }
  ];

  const selectedCustomer = mockCustomers?.find(c => c?.id === invoiceData?.customerId);

  useEffect(() => {
    // Set default template
    if (!selectedTemplate) {
      setSelectedTemplate(mockTemplates?.[0]);
    }
  }, [selectedTemplate]);

  const handleInvoiceChange = (updatedData) => {
    setInvoiceData(prev => ({ ...prev, ...updatedData }));
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    console.log('Invoice saved:', invoiceData);
  };

  const handleSend = async (sendOptions) => {
    setIsLoading(true);
    // Simulate send operation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    console.log('Invoice sent with options:', sendOptions);
  };

  const handleDuplicate = () => {
    const duplicatedInvoice = {
      ...invoiceData,
      invoiceNumber: `INV-2024-${String(Math.floor(Math.random() * 1000))?.padStart(3, '0')}`,
      invoiceDate: new Date()?.toISOString()?.split('T')?.[0]
    };
    setInvoiceData(duplicatedInvoice);
    console.log('Invoice duplicated');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      console.log('Invoice deleted');
      navigate('/main-dashboard');
    }
  };

  const handleBatchCreate = (batchData) => {
    console.log('Batch invoices created:', batchData);
  };

  const ViewToggle = () => (
    <div className="flex items-center space-x-1 bg-muted/30 rounded-lg p-1">
      <button
        onClick={() => setCurrentView('editor')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
          currentView === 'editor' ? 'bg-background shadow-sm' : 'hover:bg-muted/50'
        }`}
      >
        <Icon name="Edit3" size={14} className="mr-1.5" />
        Editor
      </button>
      <button
        onClick={() => setCurrentView('split')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
          currentView === 'split' ? 'bg-background shadow-sm' : 'hover:bg-muted/50'
        }`}
      >
        <Icon name="Columns" size={14} className="mr-1.5" />
        Split
      </button>
      <button
        onClick={() => setCurrentView('preview')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
          currentView === 'preview' ? 'bg-background shadow-sm' : 'hover:bg-muted/50'
        }`}
      >
        <Icon name="Eye" size={14} className="mr-1.5" />
        Preview
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <NavigationSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <NavigationHeader sidebarCollapsed={sidebarCollapsed} />
      
      <main className={`
        transition-all duration-300 ease-out pt-16
        ${sidebarCollapsed ? 'ml-16' : 'ml-72'}
      `}>
        <div className="p-6">
          <NavigationBreadcrumbs />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Invoice Generator</h1>
              <p className="text-muted-foreground">
                Create professional invoices with real-time preview and branded templates
              </p>
            </div>
            
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <ViewToggle />
              <BatchInvoiceProcessor
                customers={mockCustomers}
                products={mockProducts}
                templates={mockTemplates}
                onBatchCreate={handleBatchCreate}
              />
            </div>
          </div>

          {/* Template Gallery */}
          <div className="mb-6">
            <InvoiceTemplateGallery
              templates={mockTemplates}
              onTemplateSelect={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[800px]">
            {/* Editor Panel */}
            {(currentView === 'editor' || currentView === 'split') && (
              <div className={`${currentView === 'split' ? 'xl:col-span-5' : 'xl:col-span-8'} space-y-6`}>
                <div className="glass-card rounded-xl overflow-hidden h-full">
                  <InvoiceEditor
                    invoiceData={invoiceData}
                    onInvoiceChange={handleInvoiceChange}
                    customers={mockCustomers}
                    products={mockProducts}
                    templates={mockTemplates}
                    onTemplateSelect={handleTemplateSelect}
                  />
                </div>
              </div>
            )}

            {/* Preview Panel */}
            {(currentView === 'preview' || currentView === 'split') && (
              <div className={`${currentView === 'split' ? 'xl:col-span-5' : 'xl:col-span-8'} space-y-6`}>
                <div className="glass-card rounded-xl overflow-hidden h-full">
                  <InvoicePreview
                    invoiceData={invoiceData}
                    customer={selectedCustomer}
                    template={selectedTemplate}
                  />
                </div>
              </div>
            )}

            {/* Actions Panel */}
            <div className={`${currentView === 'split' ? 'xl:col-span-2' : 'xl:col-span-4'}`}>
              <div className="glass-card rounded-xl p-6 sticky top-24">
                <InvoiceActions
                  invoiceData={invoiceData}
                  onSave={handleSave}
                  onSend={handleSend}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Mobile View Toggle */}
          <div className="xl:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-300">
            <ViewToggle />
          </div>
        </div>
      </main>

      <QuickActionButton />
    </div>
  );
};

export default ModernInvoiceGenerator;