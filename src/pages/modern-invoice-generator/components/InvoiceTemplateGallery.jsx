import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceTemplateGallery = ({ templates, onTemplateSelect, selectedTemplate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTemplateSelect = (template) => {
    onTemplateSelect(template);
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      {/* Compact View */}
      {!isExpanded && (
        <div className="flex items-center justify-between p-4 glass-card">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-8 bg-gradient-primary rounded opacity-60" />
            <div>
              <h3 className="font-medium">{selectedTemplate?.name || 'Modern Template'}</h3>
              <p className="text-sm text-muted-foreground">Professional invoice design</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            iconName="Palette"
            onClick={() => setIsExpanded(true)}
          >
            Change Template
          </Button>
        </div>
      )}
      {/* Expanded Gallery */}
      {isExpanded && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Choose Template</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              iconName="X"
              onClick={() => setIsExpanded(false)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {templates?.map((template) => (
              <button
                key={template?.id}
                onClick={() => handleTemplateSelect(template)}
                className={`
                  group relative p-4 rounded-lg border-2 transition-all duration-150 hover:shadow-elevated
                  ${selectedTemplate?.id === template?.id 
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                  }
                `}
              >
                {/* Template Preview */}
                <div className="aspect-[3/4] mb-3 rounded-md overflow-hidden bg-muted/30 relative">
                  <div className={`
                    w-full h-full p-2 text-xs
                    ${template?.id === 'modern' ? 'bg-gradient-to-br from-blue-50 to-purple-50' :
                      template?.id === 'minimal' ? 'bg-gray-50' :
                      template?.id === 'corporate'? 'bg-gradient-to-br from-gray-50 to-blue-50' : 'bg-white'
                    }
                  `}>
                    {/* Mini header */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-4 h-4 bg-primary/60 rounded" />
                      <div className="text-right">
                        <div className="w-8 h-1 bg-gray-400 mb-1" />
                        <div className="w-6 h-1 bg-gray-300" />
                      </div>
                    </div>
                    
                    {/* Mini content */}
                    <div className="space-y-1">
                      <div className="w-12 h-1 bg-gray-400" />
                      <div className="w-8 h-1 bg-gray-300" />
                    </div>
                    
                    {/* Mini table */}
                    <div className="mt-2 space-y-0.5">
                      <div className="flex space-x-1">
                        <div className="flex-1 h-0.5 bg-gray-300" />
                        <div className="w-2 h-0.5 bg-gray-300" />
                        <div className="w-2 h-0.5 bg-gray-300" />
                      </div>
                      <div className="flex space-x-1">
                        <div className="flex-1 h-0.5 bg-gray-200" />
                        <div className="w-2 h-0.5 bg-gray-200" />
                        <div className="w-2 h-0.5 bg-gray-200" />
                      </div>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedTemplate?.id === template?.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Icon name="Check" size={12} color="white" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="text-left">
                  <h4 className="font-medium text-sm">{template?.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{template?.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template?.features?.slice(0, 2)?.map((feature, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-0.5 bg-muted/50 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 rounded-lg" />
              </button>
            ))}
          </div>

          {/* Template Actions */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {templates?.length} templates available
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" iconName="Upload">
                  Upload Custom
                </Button>
                <Button variant="outline" size="sm" iconName="Palette">
                  Customize Colors
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceTemplateGallery;