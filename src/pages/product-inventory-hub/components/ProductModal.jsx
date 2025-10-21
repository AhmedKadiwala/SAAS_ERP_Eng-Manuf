import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductModal = ({ isOpen, onClose, product, onSave, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    category: '',
    price: '',
    comparePrice: '',
    stockQuantity: '',
    reorderPoint: '',
    images: [],
    variants: [],
    tags: [],
    isActive: true
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isGeneratingSKU, setIsGeneratingSKU] = useState(false);

  const categoryOptions = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Apparel' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'books', label: 'Books & Media' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'toys', label: 'Toys & Games' }
  ];

  const steps = [
    { id: 1, title: 'Basic Info', icon: 'Info' },
    { id: 2, title: 'Pricing & Stock', icon: 'DollarSign' },
    { id: 3, title: 'Images & Media', icon: 'Image' },
    { id: 4, title: 'Variants', icon: 'Grid3x3' }
  ];

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product?.name || '',
        sku: product?.sku || '',
        description: product?.description || '',
        category: product?.category || '',
        price: product?.price?.toString() || '',
        comparePrice: product?.comparePrice?.toString() || '',
        stockQuantity: product?.stockQuantity?.toString() || '',
        reorderPoint: product?.reorderPoint?.toString() || '',
        images: product?.images || [],
        variants: product?.variants || [],
        tags: product?.tags || [],
        isActive: product?.isActive !== false
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        description: '',
        category: '',
        price: '',
        comparePrice: '',
        stockQuantity: '',
        reorderPoint: '',
        images: [],
        variants: [],
        tags: [],
        isActive: true
      });
    }
    setCurrentStep(1);
    setErrors({});
  }, [product, mode, isOpen]);

  const generateSKU = async () => {
    if (!formData?.name || !formData?.category) {
      setErrors({ sku: 'Name and category are required to generate SKU' });
      return;
    }

    setIsGeneratingSKU(true);
    
    // Simulate SKU generation
    setTimeout(() => {
      const categoryPrefix = formData?.category?.substring(0, 3)?.toUpperCase();
      const namePrefix = formData?.name?.substring(0, 3)?.toUpperCase()?.replace(/[^A-Z]/g, '');
      const randomSuffix = Math.floor(Math.random() * 1000)?.toString()?.padStart(3, '0');
      const generatedSKU = `${categoryPrefix}-${namePrefix}-${randomSuffix}`;
      
      setFormData(prev => ({ ...prev, sku: generatedSKU }));
      setIsGeneratingSKU(false);
    }, 1000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event?.target?.files);
    const newImages = files?.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      alt: `Product image ${formData?.images?.length + index + 1} showing ${formData?.name || 'product'}`,
      file: file
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev?.images, ...newImages]
    }));
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev?.images?.filter(img => img?.id !== imageId)
    }));
  };

  const addVariant = () => {
    const newVariant = {
      id: Date.now(),
      name: '',
      sku: '',
      price: formData?.price,
      stockQuantity: 0,
      attributes: {}
    };
    
    setFormData(prev => ({
      ...prev,
      variants: [...prev?.variants, newVariant]
    }));
  };

  const updateVariant = (variantId, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev?.variants?.map(variant =>
        variant?.id === variantId ? { ...variant, [field]: value } : variant
      )
    }));
  };

  const removeVariant = (variantId) => {
    setFormData(prev => ({
      ...prev,
      variants: prev?.variants?.filter(variant => variant?.id !== variantId)
    }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.name?.trim()) newErrors.name = 'Product name is required';
        if (!formData?.sku?.trim()) newErrors.sku = 'SKU is required';
        if (!formData?.category) newErrors.category = 'Category is required';
        break;
      case 2:
        if (!formData?.price || parseFloat(formData?.price) <= 0) {
          newErrors.price = 'Valid price is required';
        }
        if (!formData?.stockQuantity || parseInt(formData?.stockQuantity) < 0) {
          newErrors.stockQuantity = 'Valid stock quantity is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    if (validateStep(currentStep)) {
      const productData = {
        ...formData,
        price: parseFloat(formData?.price),
        comparePrice: formData?.comparePrice ? parseFloat(formData?.comparePrice) : null,
        stockQuantity: parseInt(formData?.stockQuantity),
        reorderPoint: parseInt(formData?.reorderPoint) || 0,
        id: product?.id || Date.now()
      };

      onSave(productData);
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Input
              label="Product Name"
              type="text"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              error={errors?.name}
              required
              placeholder="Enter product name"
            />
            <div className="flex space-x-2">
              <Input
                label="SKU"
                type="text"
                value={formData?.sku}
                onChange={(e) => handleInputChange('sku', e?.target?.value)}
                error={errors?.sku}
                required
                placeholder="Product SKU"
                className="flex-1"
              />
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={generateSKU}
                  loading={isGeneratingSKU}
                  iconName="Shuffle"
                  disabled={!formData?.name || !formData?.category}
                >
                  Generate
                </Button>
              </div>
            </div>
            <Select
              label="Category"
              options={categoryOptions}
              value={formData?.category}
              onChange={(value) => handleInputChange('category', value)}
              error={errors?.category}
              required
              placeholder="Select category"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                placeholder="Product description..."
                rows={4}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-150"
              />
            </div>
            <Checkbox
              label="Active Product"
              description="Product is available for sale"
              checked={formData?.isActive}
              onChange={(e) => handleInputChange('isActive', e?.target?.checked)}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                value={formData?.price}
                onChange={(e) => handleInputChange('price', e?.target?.value)}
                error={errors?.price}
                required
                placeholder="0.00"
              />
              <Input
                label="Compare Price"
                type="number"
                value={formData?.comparePrice}
                onChange={(e) => handleInputChange('comparePrice', e?.target?.value)}
                placeholder="0.00"
                description="Original price for discount display"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Stock Quantity"
                type="number"
                value={formData?.stockQuantity}
                onChange={(e) => handleInputChange('stockQuantity', e?.target?.value)}
                error={errors?.stockQuantity}
                required
                placeholder="0"
              />
              <Input
                label="Reorder Point"
                type="number"
                value={formData?.reorderPoint}
                onChange={(e) => handleInputChange('reorderPoint', e?.target?.value)}
                placeholder="0"
                description="Minimum stock level for alerts"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Product Images
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click to upload images or drag and drop
                  </p>
                </label>
              </div>
            </div>
            {formData?.images?.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {formData?.images?.map((image, index) => (
                  <div key={image?.id} className="relative group">
                    <img
                      src={image?.url}
                      alt={image?.alt}
                      className="w-full h-24 object-cover rounded-lg border border-border"
                    />
                    <button
                      onClick={() => removeImage(image?.id)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    >
                      <Icon name="X" size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-foreground">Product Variants</h3>
                <p className="text-sm text-muted-foreground">
                  Create variants for different sizes, colors, or configurations
                </p>
              </div>
              <Button
                variant="outline"
                onClick={addVariant}
                iconName="Plus"
                iconPosition="left"
              >
                Add Variant
              </Button>
            </div>
            {formData?.variants?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Grid3x3" size={32} className="mx-auto mb-2" />
                <p>No variants created yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {formData?.variants?.map((variant, index) => (
                  <div key={variant?.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">Variant {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(variant?.id)}
                        iconName="Trash2"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Variant Name"
                        value={variant?.name}
                        onChange={(e) => updateVariant(variant?.id, 'name', e?.target?.value)}
                        placeholder="e.g., Large, Red, Premium"
                      />
                      <Input
                        label="Variant SKU"
                        value={variant?.sku}
                        onChange={(e) => updateVariant(variant?.id, 'sku', e?.target?.value)}
                        placeholder="Variant SKU"
                      />
                      <Input
                        label="Price"
                        type="number"
                        value={variant?.price}
                        onChange={(e) => updateVariant(variant?.id, 'price', e?.target?.value)}
                        placeholder="0.00"
                      />
                      <Input
                        label="Stock"
                        type="number"
                        value={variant?.stockQuantity}
                        onChange={(e) => updateVariant(variant?.id, 'stockQuantity', e?.target?.value)}
                        placeholder="0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-400 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {mode === 'edit' ? 'Edit Product' : 'Create New Product'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {steps?.[currentStep - 1]?.title}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} iconName="X" />
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-border/50">
            <div className="flex items-center space-x-4">
              {steps?.map((step, index) => (
                <div key={step?.id} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-150
                    ${currentStep >= step?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {currentStep > step?.id ? (
                      <Icon name="Check" size={16} />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </div>
                  {index < steps?.length - 1 && (
                    <div className={`
                      w-12 h-0.5 mx-2 transition-colors duration-150
                      ${currentStep > step?.id ? 'bg-primary' : 'bg-muted'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {currentStep === steps?.length ? (
                <Button onClick={handleSave} iconName="Save">
                  {mode === 'edit' ? 'Update Product' : 'Create Product'}
                </Button>
              ) : (
                <Button onClick={handleNext} iconName="ChevronRight" iconPosition="right">
                  Next
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;