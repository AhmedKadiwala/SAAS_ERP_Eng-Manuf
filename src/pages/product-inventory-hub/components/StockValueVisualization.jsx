import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const StockValueVisualization = () => {
  const [selectedView, setSelectedView] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  const stockValueData = {
    totalValue: 485750.00,
    totalProducts: 1247,
    categories: [
      { name: 'Electronics', value: 185250.00, count: 342, color: '#667eea', percentage: 38.1 },
      { name: 'Clothing', value: 125400.00, count: 456, color: '#764ba2', percentage: 25.8 },
      { name: 'Home & Garden', value: 89650.00, count: 234, color: '#f093fb', percentage: 18.5 },
      { name: 'Sports', value: 52300.00, count: 145, color: '#4facfe', percentage: 10.8 },
      { name: 'Books', value: 32150.00, count: 70, color: '#ffd93d', percentage: 6.6 }
    ],
    trends: [
      { date: '2024-09-21', value: 445200 },
      { date: '2024-09-28', value: 452800 },
      { date: '2024-10-05', value: 468300 },
      { date: '2024-10-12', value: 475600 },
      { date: '2024-10-19', value: 485750 }
    ],
    topProducts: [
      { name: 'Premium Software License', value: 44850.00, quantity: 150, unitPrice: 299 },
      { name: 'Wireless Bluetooth Headphones', value: 26400.00, quantity: 120, unitPrice: 220 },
      { name: 'Smart Home Security Camera', value: 22400.00, quantity: 80, unitPrice: 280 },
      { name: 'Organic Cotton T-Shirt', value: 18900.00, quantity: 315, unitPrice: 60 },
      { name: 'Yoga Exercise Mat', value: 16200.00, quantity: 180, unitPrice: 90 }
    ]
  };

  const viewOptions = [
    { value: 'overview', label: 'Overview' },
    { value: 'categories', label: 'By Category' },
    { value: 'trends', label: 'Value Trends' },
    { value: 'products', label: 'Top Products' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(value);
  };

  const formatCompactCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000)?.toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000)?.toFixed(1)}K`;
    }
    return formatCurrency(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="glass-card p-3 shadow-floating">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">
            Value: {formatCurrency(payload?.[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Summary Cards */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Icon name="DollarSign" size={24} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Total Inventory Value</h3>
              <p className="text-sm text-muted-foreground">Current stock worth</p>
            </div>
          </div>
          <div className="text-3xl font-bold gradient-text mb-2">
            {formatCurrency(stockValueData?.totalValue)}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-success">+8.2%</span>
            <span className="text-muted-foreground">vs last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center">
              <Icon name="Package" size={24} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Total Products</h3>
              <p className="text-sm text-muted-foreground">Unique items in stock</p>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {stockValueData?.totalProducts?.toLocaleString()}
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="Plus" size={16} className="text-primary" />
            <span className="text-primary">+24</span>
            <span className="text-muted-foreground">new this month</span>
          </div>
        </motion.div>
      </div>

      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">Value by Category</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stockValueData?.categories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {stockValueData?.categories?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry?.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {stockValueData?.categories?.map((category, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category?.color }}
              />
              <span className="text-sm text-muted-foreground truncate">
                {category?.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stockValueData?.categories?.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 hover-lift"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">{category?.name}</h3>
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category?.color }}
              />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(category?.value)}
                </p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="font-medium text-foreground">{category?.count}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Share</p>
                  <p className="font-medium text-foreground">{category?.percentage}%</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Category Comparison</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockValueData?.categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#718096"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#718096"
                fontSize={12}
                tickFormatter={formatCompactCurrency}
              />
              <Tooltip content={CustomTooltip} />
              <Bar dataKey="value" fill="#667eea" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Inventory Value Trends</h3>
            <p className="text-sm text-muted-foreground">Track value changes over time</p>
          </div>
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={setTimeRange}
            className="min-w-40"
          />
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockValueData?.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#718096"
                fontSize={12}
                tickFormatter={(value) => new Date(value)?.toLocaleDateString()}
              />
              <YAxis 
                stroke="#718096"
                fontSize={12}
                tickFormatter={formatCompactCurrency}
              />
              <Tooltip content={CustomTooltip} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#667eea" 
                strokeWidth={3}
                dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-success" />
            <span className="text-sm font-medium text-muted-foreground">Growth Rate</span>
          </div>
          <p className="text-2xl font-bold text-success">+8.2%</p>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Icon name="BarChart3" size={20} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Avg Daily Value</span>
          </div>
          <p className="text-2xl font-bold text-foreground">$16,192</p>
          <p className="text-sm text-muted-foreground">This month</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Icon name="Target" size={20} className="text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Peak Value</span>
          </div>
          <p className="text-2xl font-bold text-foreground">$485,750</p>
          <p className="text-sm text-muted-foreground">Current high</p>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Products by Value</h3>
          <p className="text-sm text-muted-foreground">Highest value inventory items</p>
        </div>
        <Button variant="outline" iconName="Download" iconPosition="left">
          Export Report
        </Button>
      </div>

      <div className="space-y-4">
        {stockValueData?.topProducts?.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors duration-150"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">#{index + 1}</span>
              </div>
              <div>
                <h4 className="font-medium text-foreground">{product?.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {product?.quantity} units × {formatCurrency(product?.unitPrice)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-bold text-foreground">
                {formatCurrency(product?.value)}
              </p>
              <p className="text-sm text-muted-foreground">
                {((product?.value / stockValueData?.totalValue) * 100)?.toFixed(1)}% of total
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedView) {
      case 'overview':
        return renderOverview();
      case 'categories':
        return renderCategories();
      case 'trends':
        return renderTrends();
      case 'products':
        return renderProducts();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      {/* View Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Stock Value Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive inventory value insights and trends
          </p>
        </div>
        <Select
          options={viewOptions}
          value={selectedView}
          onChange={setSelectedView}
          className="min-w-48"
        />
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default StockValueVisualization;