import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import Icon from '../../../components/AppIcon';

const ChartBuilder = ({ analytics, onChartUpdate }) => {
  const [selectedDataSource, setSelectedDataSource] = useState('revenue');
  const [chartType, setChartType] = useState('bar');
  const [selectedFields, setSelectedFields] = useState({ x: '', y: '' });
  const [chartConfig, setChartConfig] = useState({
    title: 'Custom Chart',
    colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'],
    showGrid: true,
    showLegend: true
  });

  const dataSources = [
    { id: 'revenue', label: 'Revenue Data', icon: 'DollarSign' },
    { id: 'customers', label: 'Customer Data', icon: 'Users' },
    { id: 'products', label: 'Product Data', icon: 'Package' },
    { id: 'activities', label: 'Activity Data', icon: 'Activity' }
  ];

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: 'BarChart3' },
    { id: 'line', label: 'Line Chart', icon: 'TrendingUp' },
    { id: 'area', label: 'Area Chart', icon: 'Activity' },
    { id: 'pie', label: 'Pie Chart', icon: 'PieChart' },
    { id: 'scatter', label: 'Scatter Plot', icon: 'Zap' }
  ];

  const getDataSourceFields = (source) => {
    switch (source) {
      case 'revenue':
        return [
          { id: 'date', label: 'Date', type: 'string' },
          { id: 'revenue', label: 'Revenue', type: 'number' },
          { id: 'invoices', label: 'Invoice Count', type: 'number' }
        ];
      case 'customers':
        return [
          { id: 'industry', label: 'Industry', type: 'string' },
          { id: 'status', label: 'Status', type: 'string' },
          { id: 'count', label: 'Count', type: 'number' },
          { id: 'score', label: 'Relationship Score', type: 'number' }
        ];
      case 'products':
        return [
          { id: 'category', label: 'Category', type: 'string' },
          { id: 'count', label: 'Product Count', type: 'number' },
          { id: 'value', label: 'Total Value', type: 'number' }
        ];
      default:
        return [];
    }
  };

  const generateChartData = () => {
    if (!analytics || !selectedDataSource) return [];

    switch (selectedDataSource) {
      case 'revenue':
        return analytics?.revenue?.chartData || [];
      
      case 'customers':
        const industryData = analytics?.customers?.industryBreakdown || {};
        return Object?.entries(industryData)?.map(([industry, count]) => ({
          industry: industry?.charAt(0)?.toUpperCase() + industry?.slice(1),
          count,
          score: Math?.floor(Math?.random() * 40) + 60, // Mock relationship scores
          alt: `${industry} industry data: ${count} customers`
        }));
      
      case 'products':
        return analytics?.products?.categoryBreakdown || [];
      
      default:
        return [];
    }
  };

  const renderChart = () => {
    const data = generateChartData();
    const commonProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const getXAxisKey = () => {
      if (selectedFields?.x) return selectedFields?.x;
      if (selectedDataSource === 'revenue') return 'date';
      if (selectedDataSource === 'customers') return 'industry';
      if (selectedDataSource === 'products') return 'category';
      return 'name';
    };

    const getYAxisKey = () => {
      if (selectedFields?.y) return selectedFields?.y;
      if (selectedDataSource === 'revenue') return 'revenue';
      if (selectedDataSource === 'customers') return 'count';
      if (selectedDataSource === 'products') return 'value';
      return 'value';
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            {chartConfig?.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />}
            <XAxis 
              dataKey={getXAxisKey()}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload?.[0]) {
                  return (
                    <div className="glass-card p-3 shadow-floating border border-border/50">
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-sm text-primary">
                        {payload?.[0]?.name}: {payload?.[0]?.value?.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey={getYAxisKey()} fill={chartConfig?.colors?.[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            {chartConfig?.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />}
            <XAxis 
              dataKey={getXAxisKey()}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey={getYAxisKey()} 
              stroke={chartConfig?.colors?.[0]} 
              strokeWidth={3}
              dot={{ fill: chartConfig?.colors?.[0], strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="customGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartConfig?.colors?.[0]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartConfig?.colors?.[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            {chartConfig?.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />}
            <XAxis 
              dataKey={getXAxisKey()}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip />
            <Area
              type="monotone"
              dataKey={getYAxisKey()}
              stroke={chartConfig?.colors?.[0]}
              strokeWidth={2}
              fill="url(#customGradient)"
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              dataKey={getYAxisKey()}
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartConfig?.colors?.[index % chartConfig?.colors?.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            {chartConfig?.showGrid && <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.3} />}
            <XAxis 
              type="number"
              dataKey={getXAxisKey()}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <YAxis 
              type="number"
              dataKey={getYAxisKey()}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
            />
            <Tooltip />
            <Scatter dataKey={getYAxisKey()} fill={chartConfig?.colors?.[0]} />
          </ScatterChart>
        );

      default:
        return null;
    }
  };

  const handleFieldSelection = (axis, fieldId) => {
    setSelectedFields(prev => ({
      ...prev,
      [axis]: fieldId
    }));
  };

  const handleColorChange = (index, color) => {
    const newColors = [...chartConfig?.colors];
    newColors[index] = color;
    setChartConfig(prev => ({
      ...prev,
      colors: newColors
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Configuration Panel */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-1 space-y-6"
      >
        {/* Data Source Selection */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Data Source</h3>
          <div className="space-y-2">
            {dataSources?.map((source) => (
              <button
                key={source?.id}
                onClick={() => setSelectedDataSource(source?.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  selectedDataSource === source?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={source?.icon} size={16} />
                <span className="text-sm font-medium">{source?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart Type Selection */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Chart Type</h3>
          <div className="grid grid-cols-2 gap-2">
            {chartTypes?.map((type) => (
              <button
                key={type?.id}
                onClick={() => setChartType(type?.id)}
                className={`flex flex-col items-center space-y-2 p-3 rounded-lg transition-colors ${
                  chartType === type?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={type?.icon} size={20} />
                <span className="text-xs font-medium text-center">{type?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Field Mapping */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Field Mapping</h3>
          <div className="space-y-4">
            {chartType !== 'pie' && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">X-Axis</label>
                  <select
                    value={selectedFields?.x || ''}
                    onChange={(e) => handleFieldSelection('x', e?.target?.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Auto-select</option>
                    {getDataSourceFields(selectedDataSource)?.map((field) => (
                      <option key={field?.id} value={field?.id}>{field?.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Y-Axis</label>
                  <select
                    value={selectedFields?.y || ''}
                    onChange={(e) => handleFieldSelection('y', e?.target?.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Auto-select</option>
                    {getDataSourceFields(selectedDataSource)?.filter(f => f?.type === 'number')?.map((field) => (
                      <option key={field?.id} value={field?.id}>{field?.label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chart Configuration */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Chart Title</label>
              <input
                type="text"
                value={chartConfig?.title}
                onChange={(e) => setChartConfig(prev => ({ ...prev, title: e?.target?.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showGrid"
                checked={chartConfig?.showGrid}
                onChange={(e) => setChartConfig(prev => ({ ...prev, showGrid: e?.target?.checked }))}
                className="rounded border-border focus:ring-primary"
              />
              <label htmlFor="showGrid" className="text-sm text-foreground">Show Grid</label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showLegend"
                checked={chartConfig?.showLegend}
                onChange={(e) => setChartConfig(prev => ({ ...prev, showLegend: e?.target?.checked }))}
                className="rounded border-border focus:ring-primary"
              />
              <label htmlFor="showLegend" className="text-sm text-foreground">Show Legend</label>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">Colors</label>
              <div className="flex space-x-2">
                {chartConfig?.colors?.slice(0, 4)?.map((color, index) => (
                  <input
                    key={index}
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(index, e?.target?.value)}
                    className="w-8 h-8 rounded border border-border"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {/* Chart Workspace */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-3"
      >
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-foreground">{chartConfig?.title}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onChartUpdate?.({ type: chartType, data: generateChartData(), config: chartConfig })}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <Icon name="Save" size={16} />
                <span>Save Chart</span>
              </button>
              
              <button
                onClick={() => {
                  const chartElement = document.querySelector('.recharts-responsive-container');
                  if (chartElement) {
                    // Chart export logic would go here
                    console.log('Export chart functionality');
                  }
                }}
                className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center space-x-2"
              >
                <Icon name="Download" size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>

          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">Chart Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Data Source:</span> {selectedDataSource}
              </div>
              <div>
                <span className="font-medium">Chart Type:</span> {chartType}
              </div>
              <div>
                <span className="font-medium">Data Points:</span> {generateChartData()?.length}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {new Date()?.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChartBuilder;