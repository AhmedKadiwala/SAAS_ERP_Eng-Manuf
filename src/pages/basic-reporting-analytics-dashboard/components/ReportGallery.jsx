import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ReportGallery = ({ analytics, onGenerateReport }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  const reportTemplates = [
    {
      id: 'revenue-summary',
      title: 'Revenue Summary Report',
      description: 'Comprehensive overview of revenue performance with trends and forecasts',
      category: 'financial',
      icon: 'DollarSign',
      tags: ['revenue', 'financial', 'summary'],
      fields: ['total_revenue', 'monthly_growth', 'top_customers', 'revenue_by_source'],
      estimatedTime: '2 minutes',
      lastGenerated: '2025-10-20',
      alt: 'Revenue summary report template showing financial performance overview'
    },
    {
      id: 'customer-analysis',
      title: 'Customer Analysis Report',
      description: 'Deep dive into customer behavior, segmentation, and relationship metrics',
      category: 'customer',
      icon: 'Users',
      tags: ['customers', 'segmentation', 'behavior'],
      fields: ['customer_count', 'industry_breakdown', 'relationship_scores', 'churn_risk'],
      estimatedTime: '3 minutes',
      lastGenerated: '2025-10-19',
      alt: 'Customer analysis report template for customer behavior insights'
    },
    {
      id: 'product-performance',
      title: 'Product Performance Report',
      description: 'Analyze product sales, inventory turnover, and profitability metrics',
      category: 'product',
      icon: 'Package',
      tags: ['products', 'inventory', 'performance'],
      fields: ['product_sales', 'inventory_turnover', 'profit_margins', 'category_analysis'],
      estimatedTime: '2 minutes',
      lastGenerated: '2025-10-21',
      alt: 'Product performance report template showing sales and inventory metrics'
    },
    {
      id: 'activity-dashboard',
      title: 'Activity Dashboard Report',
      description: 'Track user activities, system usage, and operational metrics',
      category: 'operational',
      icon: 'Activity',
      tags: ['activities', 'usage', 'operations'],
      fields: ['activity_volume', 'user_engagement', 'system_performance', 'peak_hours'],
      estimatedTime: '1 minute',
      lastGenerated: '2025-10-21',
      alt: 'Activity dashboard report template for operational insights'
    },
    {
      id: 'quarterly-review',
      title: 'Quarterly Business Review',
      description: 'Comprehensive quarterly performance analysis across all business metrics',
      category: 'executive',
      icon: 'TrendingUp',
      tags: ['quarterly', 'executive', 'comprehensive'],
      fields: ['revenue_summary', 'customer_metrics', 'product_performance', 'growth_analysis'],
      estimatedTime: '5 minutes',
      lastGenerated: '2025-10-15',
      alt: 'Quarterly business review report template for executive insights'
    },
    {
      id: 'sales-forecast',
      title: 'Sales Forecast Report',
      description: 'Predictive analysis of sales trends and revenue projections',
      category: 'financial',
      icon: 'Target',
      tags: ['sales', 'forecast', 'predictions'],
      fields: ['sales_trends', 'seasonal_analysis', 'pipeline_health', 'revenue_projections'],
      estimatedTime: '4 minutes',
      lastGenerated: '2025-10-18',
      alt: 'Sales forecast report template for revenue predictions'
    },
    {
      id: 'inventory-optimization',
      title: 'Inventory Optimization Report',
      description: 'Stock level analysis with reorder recommendations and cost optimization',
      category: 'product',
      icon: 'Archive',
      tags: ['inventory', 'optimization', 'cost'],
      fields: ['stock_levels', 'reorder_points', 'carrying_costs', 'turnover_rates'],
      estimatedTime: '3 minutes',
      lastGenerated: '2025-10-20',
      alt: 'Inventory optimization report template for stock management'
    },
    {
      id: 'customer-satisfaction',
      title: 'Customer Satisfaction Report',
      description: 'Customer feedback analysis and satisfaction scoring metrics',
      category: 'customer',
      icon: 'Heart',
      tags: ['satisfaction', 'feedback', 'quality'],
      fields: ['satisfaction_scores', 'feedback_analysis', 'service_quality', 'loyalty_metrics'],
      estimatedTime: '2 minutes',
      lastGenerated: '2025-10-17',
      alt: 'Customer satisfaction report template for service quality analysis'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Reports', icon: 'Grid3X3' },
    { id: 'financial', label: 'Financial', icon: 'DollarSign' },
    { id: 'customer', label: 'Customer', icon: 'Users' },
    { id: 'product', label: 'Product', icon: 'Package' },
    { id: 'operational', label: 'Operational', icon: 'Activity' },
    { id: 'executive', label: 'Executive', icon: 'TrendingUp' }
  ];

  const filteredReports = reportTemplates?.filter(report => {
    const matchesCategory = selectedCategory === 'all' || report?.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      report?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      report?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      report?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleGenerateReport = (report) => {
    const reportConfig = {
      templateId: report?.id,
      title: report?.title,
      fields: report?.fields,
      filters: {
        dateRange: '30d',
        includeCharts: true,
        format: 'pdf'
      },
      generatedAt: new Date()?.toISOString()
    };
    
    onGenerateReport?.(reportConfig);
    setSelectedReport(report);
  };

  const handleScheduleReport = (report, schedule) => {
    console.log('Schedule report:', report?.id, 'Schedule:', schedule);
    // Implementation would handle report scheduling
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Report Gallery</h2>
          <p className="text-muted-foreground">Choose from pre-built report templates or create custom reports</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2">
            <Icon name="Plus" size={16} />
            <span>Create Report</span>
          </button>
        </div>
      </div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={category?.icon} size={16} />
            <span>{category?.label}</span>
          </button>
        ))}
      </div>
      {/* Report Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports?.map((report, index) => (
          <motion.div
            key={report?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card group hover:shadow-elevated transition-all duration-300"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon name={report?.icon} className="text-primary" size={24} />
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleScheduleReport(report, 'weekly')}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    title="Schedule Report"
                  >
                    <Icon name="Calendar" size={16} />
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                    <Icon name="MoreHorizontal" size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {report?.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {report?.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {report?.tags?.slice(0, 3)?.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
                {report?.tags?.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md">
                    +{report?.tags?.length - 3}
                  </span>
                )}
              </div>

              {/* Metadata */}
              <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Icon name="Clock" size={14} />
                    <span>Est. {report?.estimatedTime}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Icon name="Database" size={14} />
                    <span>{report?.fields?.length} fields</span>
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Calendar" size={14} />
                  <span>Last generated: {new Date(report?.lastGenerated)?.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleGenerateReport(report)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
                >
                  <Icon name="Play" size={16} />
                  <span>Generate</span>
                </button>
                
                <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center">
                  <Icon name="Eye" size={16} />
                </button>
                
                <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center justify-center">
                  <Icon name="Copy" size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Empty State */}
      {filteredReports?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Icon name="FileText" className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground mb-2">No reports found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm ? `No reports match "${searchTerm}"` : 'No reports available in this category'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 text-primary hover:underline"
            >
              Clear search
            </button>
          )}
        </motion.div>
      )}
      {/* Report Generation Modal */}
      {selectedReport && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReport(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="glass-card max-w-md w-full p-6"
            onClick={(e) => e?.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="FileText" className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Generating Report</h3>
                <p className="text-sm text-muted-foreground">{selectedReport?.title}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
              
              <div className="text-sm text-muted-foreground text-center">
                Processing data sources... This may take a few minutes.
              </div>
              
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                  Run in Background
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ReportGallery;