import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import NavigationBreadcrumbs from '../../components/ui/NavigationBreadcrumbs';
import QuickActionButton from '../../components/ui/QuickActionButton';
import { useToast } from '../../components/ui/NotificationToast';

// Import components
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import BulkOperationsToolbar from './components/BulkOperationsToolbar';
import ProductModal from './components/ProductModal';
import StockMovementHistory from './components/StockMovementHistory';
import StockValueVisualization from './components/StockValueVisualization';

const ProductInventoryHub = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    sortBy: 'name_asc',
    minPrice: 0,
    maxPrice: 10000
  });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock product data
  const mockProducts = [
  {
    id: 1,
    name: "Premium Software License",
    sku: "PSL-001",
    description: "Professional software license with advanced features and premium support for enterprise customers.",
    category: "electronics",
    price: 299.00,
    comparePrice: 399.00,
    stockQuantity: 150,
    reorderPoint: 25,
    stockStatus: "in_stock",
    images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1633984613303-dcd998e36dbe",
      alt: "Software license certificate with digital security badge on modern computer screen"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1669643470668-19d6fb1d3f21",
      alt: "Professional software interface dashboard showing analytics and premium features"
    }],

    variants: [
    { id: 1, name: "Standard", sku: "PSL-001-STD", price: 299, stockQuantity: 100 },
    { id: 2, name: "Enterprise", sku: "PSL-001-ENT", price: 499, stockQuantity: 50 }],

    tags: ["software", "premium", "enterprise"],
    isActive: true,
    createdAt: new Date('2024-09-15')
  },
  {
    id: 2,
    name: "Wireless Bluetooth Headphones",
    sku: "ELE-WBH-001",
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    category: "electronics",
    price: 220.00,
    comparePrice: null,
    stockQuantity: 22,
    reorderPoint: 30,
    stockStatus: "low_stock",
    images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1713801129175-8e60c67e0412",
      alt: "Black wireless Bluetooth headphones with sleek modern design on white background"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1677615852737-2b2dfce8b547",
      alt: "Person wearing wireless headphones while using smartphone in modern office setting"
    }],

    variants: [
    { id: 1, name: "Black", sku: "ELE-WBH-001-BLK", price: 220, stockQuantity: 12 },
    { id: 2, name: "White", sku: "ELE-WBH-001-WHT", price: 220, stockQuantity: 10 }],

    tags: ["electronics", "audio", "wireless"],
    isActive: true,
    createdAt: new Date('2024-09-20')
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    sku: "CLO-OCT-002",
    description: "Comfortable organic cotton t-shirt made from sustainable materials with premium quality fabric.",
    category: "clothing",
    price: 60.00,
    comparePrice: 80.00,
    stockQuantity: 315,
    reorderPoint: 50,
    stockStatus: "in_stock",
    images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1704584593104-781977db5c9a",
      alt: "White organic cotton t-shirt laid flat showing soft fabric texture and quality stitching"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1725210971794-30945ac043bc",
      alt: "Person wearing comfortable organic cotton t-shirt in casual outdoor setting"
    }],

    variants: [
    { id: 1, name: "Small", sku: "CLO-OCT-002-S", price: 60, stockQuantity: 85 },
    { id: 2, name: "Medium", sku: "CLO-OCT-002-M", price: 60, stockQuantity: 120 },
    { id: 3, name: "Large", sku: "CLO-OCT-002-L", price: 60, stockQuantity: 110 }],

    tags: ["clothing", "organic", "sustainable"],
    isActive: true,
    createdAt: new Date('2024-10-01')
  },
  {
    id: 4,
    name: "Smart Home Security Camera",
    sku: "ELE-SHS-003",
    description: "Advanced security camera with AI detection, night vision, and mobile app integration.",
    category: "electronics",
    price: 280.00,
    comparePrice: null,
    stockQuantity: 28,
    reorderPoint: 15,
    stockStatus: "in_stock",
    images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1666613789626-e8b9352639fe",
      alt: "White smart security camera mounted on wall with LED indicator lights and modern design"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1707733260992-73ff6dbed163",
      alt: "Smart home security system interface on smartphone showing camera feeds and controls"
    }],

    variants: [],
    tags: ["electronics", "security", "smart-home"],
    isActive: true,
    createdAt: new Date('2024-10-05')
  },
  {
    id: 5,
    name: "Yoga Exercise Mat",
    sku: "SPO-YEM-001",
    description: "Premium yoga mat with non-slip surface and eco-friendly materials for comfortable practice.",
    category: "sports",
    price: 90.00,
    comparePrice: 120.00,
    stockQuantity: 45,
    reorderPoint: 20,
    stockStatus: "in_stock",
    images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1576385649146-1c3700f76631",
      alt: "Purple yoga mat rolled out on wooden floor showing textured non-slip surface"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1518310952931-b1de897abd40",
      alt: "Person practicing yoga poses on exercise mat in bright studio with natural lighting"
    }],

    variants: [
    { id: 1, name: "Purple", sku: "SPO-YEM-001-PUR", price: 90, stockQuantity: 20 },
    { id: 2, name: "Blue", sku: "SPO-YEM-001-BLU", price: 90, stockQuantity: 25 }],

    tags: ["sports", "yoga", "fitness"],
    isActive: true,
    createdAt: new Date('2024-10-10')
  },
  {
    id: 6,
    name: "Professional Kitchen Knife Set",
    sku: "HOM-PKN-004",
    description: "High-quality stainless steel kitchen knives with ergonomic handles and premium storage block.",
    category: "home-garden",
    price: 180.00,
    comparePrice: 250.00,
    stockQuantity: 0,
    reorderPoint: 10,
    stockStatus: "out_of_stock",
    images: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1700515268359-09d3dbbe2ef3",
      alt: "Set of professional kitchen knives with stainless steel blades arranged in wooden storage block"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1633118656185-1650bfe74350",
      alt: "Chef using professional kitchen knife to prepare vegetables on cutting board in modern kitchen"
    }],

    variants: [],
    tags: ["home", "kitchen", "professional"],
    isActive: true,
    createdAt: new Date('2024-09-25')
  }];


  const tabs = [
  { id: 'catalog', label: 'Product Catalog', icon: 'Grid3x3', count: products?.length },
  { id: 'inventory', label: 'Inventory Tracking', icon: 'Package', count: null },
  { id: 'movements', label: 'Stock Movements', icon: 'TrendingUp', count: null },
  { id: 'analytics', label: 'Value Analytics', icon: 'BarChart3', count: null }];


  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and sort products
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = !filters?.search ||
    product?.name?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
    product?.sku?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
    product?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase());

    const matchesCategory = !filters?.category || product?.category === filters?.category;
    const matchesStockStatus = !filters?.stockStatus || product?.stockStatus === filters?.stockStatus;
    const matchesPrice = product?.price >= filters?.minPrice && product?.price <= filters?.maxPrice;

    return matchesSearch && matchesCategory && matchesStockStatus && matchesPrice;
  })?.sort((a, b) => {
    switch (filters?.sortBy) {
      case 'name_asc':
        return a?.name?.localeCompare(b?.name);
      case 'name_desc':
        return b?.name?.localeCompare(a?.name);
      case 'price_asc':
        return a?.price - b?.price;
      case 'price_desc':
        return b?.price - a?.price;
      case 'stock_asc':
        return a?.stockQuantity - b?.stockQuantity;
      case 'stock_desc':
        return b?.stockQuantity - a?.stockQuantity;
      case 'created_desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'created_asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      default:
        return 0;
    }
  });

  const handleProductSelect = (productId) => {
    setSelectedProducts((prev) => {
      if (prev?.includes(productId)) {
        return prev?.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts?.length === filteredProducts?.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts?.map((p) => p?.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      stockStatus: '',
      sortBy: 'name_asc',
      minPrice: 0,
      maxPrice: 10000
    });
  };

  const handleBulkAction = (action, data) => {
    toast?.success(`Bulk ${action} applied to ${selectedProducts?.length} products`);
    setSelectedProducts([]);
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev?.filter((p) => p?.id !== productId));
      toast?.success('Product deleted successfully');
    }
  };

  const handleViewDetails = (product) => {
    toast?.info(`Viewing details for ${product?.name}`);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts((prev) => prev?.map((p) => p?.id === editingProduct?.id ? { ...productData, id: editingProduct?.id } : p));
      toast?.success('Product updated successfully');
    } else {
      setProducts((prev) => [...prev, { ...productData, id: Date.now() }]);
      toast?.success('Product created successfully');
    }
  };

  const renderProductCatalog = () =>
  <div className="space-y-6">
      <ProductFilters
      filters={filters}
      onFiltersChange={handleFiltersChange}
      onClearFilters={handleClearFilters} />


      <BulkOperationsToolbar
      selectedCount={selectedProducts?.length}
      onBulkAction={handleBulkAction}
      onClearSelection={handleClearSelection} />


      {/* Products Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            Products ({filteredProducts?.length})
          </h3>
          {filteredProducts?.length > 0 &&
        <button
          onClick={handleSelectAll}
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-150">

              {selectedProducts?.length === filteredProducts?.length ? 'Deselect All' : 'Select All'}
            </button>
        }
        </div>
        <Button
        onClick={handleCreateProduct}
        iconName="Plus"
        iconPosition="left">

          Add Product
        </Button>
      </div>

      {/* Products Grid */}
      {isLoading ?
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)]?.map((_, index) =>
      <div key={index} className="glass-card p-4 animate-pulse">
              <div className="bg-muted/50 h-48 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="bg-muted/50 h-4 rounded w-3/4" />
                <div className="bg-muted/50 h-3 rounded w-1/2" />
                <div className="bg-muted/50 h-4 rounded w-1/3" />
              </div>
            </div>
      )}
        </div> :
    filteredProducts?.length === 0 ?
    <div className="glass-card p-12 text-center">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            {filters?.search || filters?.category || filters?.stockStatus ?
        'Try adjusting your filters or search terms' : 'Get started by adding your first product'
        }
          </p>
          <Button onClick={handleCreateProduct} iconName="Plus" iconPosition="left">
            Add Product
          </Button>
        </div> :

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredProducts?.map((product) =>
        <ProductCard
          key={product?.id}
          product={product}
          isSelected={selectedProducts?.includes(product?.id)}
          onSelect={handleProductSelect}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
          onViewDetails={handleViewDetails} />

        )}
          </AnimatePresence>
        </div>
    }
    </div>;


  const renderInventoryTracking = () =>
  <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Inventory Overview</h3>
            <p className="text-sm text-muted-foreground">
              Real-time stock levels and alerts
            </p>
          </div>
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export Inventory
          </Button>
        </div>

        {/* Stock Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="CheckCircle" size={20} className="text-success" />
              <div>
                <p className="text-sm text-muted-foreground">In Stock</p>
                <p className="text-xl font-bold text-success">
                  {products?.filter((p) => p?.stockStatus === 'in_stock')?.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-xl font-bold text-warning">
                  {products?.filter((p) => p?.stockStatus === 'low_stock')?.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="XCircle" size={20} className="text-error" />
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-xl font-bold text-error">
                  {products?.filter((p) => p?.stockStatus === 'out_of_stock')?.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Package" size={20} className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-xl font-bold text-primary">{products?.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Stock Alerts</h4>
          {products?.filter((p) => p?.stockStatus === 'low_stock' || p?.stockStatus === 'out_of_stock')?.map((product) =>
        <div key={product?.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon
              name={product?.stockStatus === 'out_of_stock' ? 'XCircle' : 'AlertTriangle'}
              size={16}
              className={product?.stockStatus === 'out_of_stock' ? 'text-error' : 'text-warning'} />

                <div>
                  <p className="font-medium text-foreground">{product?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Current: {product?.stockQuantity} • Reorder at: {product?.reorderPoint}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Reorder
              </Button>
            </div>
        )}
        </div>
      </div>
    </div>;


  const renderTabContent = () => {
    switch (activeTab) {
      case 'catalog':
        return renderProductCatalog();
      case 'inventory':
        return renderInventoryTracking();
      case 'movements':
        return <StockMovementHistory />;
      case 'analytics':
        return <StockValueVisualization />;
      default:
        return renderProductCatalog();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <NavigationBreadcrumbs />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Product Inventory Hub
              </h1>
              <p className="text-muted-foreground">
                Comprehensive product and stock management with real-time insights
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" iconName="Upload" iconPosition="left">
                Import Products
              </Button>
              <Button onClick={handleCreateProduct} iconName="Plus" iconPosition="left">
                Add Product
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-muted/30 rounded-lg p-1">
            {tabs?.map((tab) =>
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-150
                  ${activeTab === tab?.id ?
              'bg-background text-foreground shadow-elevated' :
              'text-muted-foreground hover:text-foreground hover:bg-muted/50'}
                `
              }>

                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
                {tab?.count !== null &&
              <span className={`
                    px-2 py-0.5 text-xs rounded-full
                    ${activeTab === tab?.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                  `}>
                    {tab?.count}
                  </span>
              }
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}>

          {renderTabContent()}
        </motion.div>

        {/* Product Modal */}
        <ProductModal
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          product={editingProduct}
          onSave={handleSaveProduct}
          mode={editingProduct ? 'edit' : 'create'} />


        {/* Quick Action Button */}
        <QuickActionButton />
      </div>
    </div>);

};

export default ProductInventoryHub;