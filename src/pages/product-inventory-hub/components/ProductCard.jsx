import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onEdit, onDelete, onViewDetails, isSelected, onSelect }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageNavigation = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === product?.images?.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product?.images?.length - 1 : prev - 1
      );
    }
  };

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'in_stock':
        return 'text-success bg-success/10 border-success/20';
      case 'low_stock':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'out_of_stock':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getStockStatusText = (status) => {
    switch (status) {
      case 'in_stock':
        return 'In Stock';
      case 'low_stock':
        return 'Low Stock';
      case 'out_of_stock':
        return 'Out of Stock';
      default:
        return 'Unknown';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`
        glass-card p-4 hover-lift cursor-pointer transition-all duration-300
        ${isSelected ? 'ring-2 ring-primary/50 border-primary/30' : ''}
      `}
      onClick={() => onSelect && onSelect(product?.id)}
    >
      {/* Selection Checkbox */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e?.stopPropagation();
              onSelect && onSelect(product?.id);
            }}
            className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary/50"
          />
          <span className={`
            px-2 py-1 text-xs font-medium rounded-full border
            ${getStockStatusColor(product?.stockStatus)}
          `}>
            {getStockStatusText(product?.stockStatus)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={(e) => {
              e?.stopPropagation();
              onEdit(product);
            }}
            className="p-1.5 hover:bg-muted/50 rounded-md transition-colors duration-150"
          >
            <Icon name="Edit2" size={14} />
          </button>
          <button
            onClick={(e) => {
              e?.stopPropagation();
              onDelete(product?.id);
            }}
            className="p-1.5 hover:bg-error/10 text-error rounded-md transition-colors duration-150"
          >
            <Icon name="Trash2" size={14} />
          </button>
        </div>
      </div>
      {/* Product Image Gallery */}
      <div className="relative mb-4 bg-muted/30 rounded-lg overflow-hidden h-48">
        <Image
          src={product?.images?.[currentImageIndex]?.url}
          alt={product?.images?.[currentImageIndex]?.alt}
          className="w-full h-full object-cover"
        />
        
        {product?.images?.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e?.stopPropagation();
                handleImageNavigation('prev');
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-150"
            >
              <Icon name="ChevronLeft" size={16} />
            </button>
            <button
              onClick={(e) => {
                e?.stopPropagation();
                handleImageNavigation('next');
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-150"
            >
              <Icon name="ChevronRight" size={16} />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
              {product?.images?.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e?.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`
                    w-2 h-2 rounded-full transition-colors duration-150
                    ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}
                  `}
                />
              ))}
            </div>
          </>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-xs font-medium bg-black/50 text-white rounded-md">
            {product?.category}
          </span>
        </div>
      </div>
      {/* Product Information */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
            {product?.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            SKU: {product?.sku}
          </p>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-foreground">
              ${product?.price?.toLocaleString()}
            </span>
            {product?.comparePrice && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                ${product?.comparePrice?.toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">
              {product?.stockQuantity} units
            </p>
            <p className="text-xs text-muted-foreground">
              Min: {product?.reorderPoint}
            </p>
          </div>
        </div>

        {/* Variants */}
        {product?.variants && product?.variants?.length > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Variants:</span>
            <div className="flex space-x-1">
              {product?.variants?.slice(0, 3)?.map((variant, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-muted/50 rounded-md"
                >
                  {variant?.name}
                </span>
              ))}
              {product?.variants?.length > 3 && (
                <span className="px-2 py-1 text-xs bg-muted/50 rounded-md">
                  +{product?.variants?.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onViewDetails(product);
            }}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e?.stopPropagation();
              onEdit(product);
            }}
            className="flex-1"
          >
            Edit
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;