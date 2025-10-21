import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const ExportPanel = ({ analytics, onExport }) => {
  const [selectedDataType, setSelectedDataType] = useState('revenue');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportOptions, setExportOptions] = useState({
    includeCharts: true,
    includeTables: true,
    includeMetadata: false,
    dateRange: '30d',
    compression: false
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportHistory, setExportHistory] = useState([]);

  const dataTypes = [
    {
      id: 'revenue',
      label: 'Revenue Analytics',
      description: 'Financial performance and revenue trends',
      icon: 'DollarSign',
      size: '2.3 MB',
      records: analytics?.revenue?.summary?.totalInvoices || 0
    },
    {
      id: 'customers',
      label: 'Customer Data',
      description: 'Customer profiles and relationship metrics',
      icon: 'Users',
      size: '1.8 MB',
      records: analytics?.overview?.customers || 0
    },
    {
      id: 'products',
      label: 'Product Analytics',
      description: 'Inventory and product performance data',
      icon: 'Package',
      size: '1.2 MB',
      records: analytics?.overview?.products?.total || 0
    },
    {
      id: 'complete',
      label: 'Complete Report',
      description: 'All analytics data and visualizations',
      icon: 'FileText',
      size: '8.7 MB',
      records: 'All data'
    }
  ];

  const formats = [
    {
      id: 'pdf',
      label: 'PDF Report',
      description: 'Formatted report with charts and tables',
      icon: 'FileText',
      extension: '.pdf'
    },
    {
      id: 'excel',
      label: 'Excel Spreadsheet',
      description: 'Data in Excel format with multiple sheets',
      icon: 'Sheet',
      extension: '.xlsx'
    },
    {
      id: 'csv',
      label: 'CSV Data',
      description: 'Raw data in comma-separated values',
      icon: 'Database',
      extension: '.csv'
    },
    {
      id: 'json',
      label: 'JSON Format',
      description: 'Structured data in JSON format',
      icon: 'Code',
      extension: '.json'
    },
    {
      id: 'powerbi',
      label: 'Power BI Dataset',
      description: 'Data formatted for Power BI import',
      icon: 'BarChart3',
      extension: '.pbix'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      await onExport?.(selectedDataType, exportFormat);
      
      // Add to export history
      const newExport = {
        id: Date.now()?.toString(),
        type: selectedDataType,
        format: exportFormat,
        timestamp: new Date()?.toISOString(),
        size: dataTypes?.find(dt => dt?.id === selectedDataType)?.size || '0 MB',
        status: 'completed'
      };
      
      setExportHistory(prev => [newExport, ...prev?.slice(0, 9)]);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleScheduleExport = () => {
    console.log('Schedule export:', { selectedDataType, exportFormat, exportOptions });
    // Implementation for scheduled exports
  };

  const getDataTypeInfo = (typeId) => {
    return dataTypes?.find(dt => dt?.id === typeId);
  };

  const getFormatInfo = (formatId) => {
    return formats?.find(f => f?.id === formatId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Export Configuration */}
      <div className="lg:col-span-2 space-y-6">
        {/* Data Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Select Data to Export</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataTypes?.map((dataType) => (
              <button
                key={dataType?.id}
                onClick={() => setSelectedDataType(dataType?.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedDataType === dataType?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedDataType === dataType?.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    <Icon name={dataType?.icon} size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{dataType?.label}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{dataType?.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{dataType?.records} records</span>
                      <span>{dataType?.size}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Format Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Choose Export Format</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {formats?.map((format) => (
              <button
                key={format?.id}
                onClick={() => setExportFormat(format?.id)}
                className={`p-3 rounded-lg border transition-all text-left ${
                  exportFormat === format?.id
                    ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name={format?.icon} size={16} className="text-muted-foreground" />
                  <span className="font-medium text-foreground">{format?.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{format?.description}</p>
                <span className="text-xs text-primary mt-1 block">{format?.extension}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Export Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Export Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Content Options</h4>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions?.includeCharts}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e?.target?.checked }))}
                    className="rounded border-border focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Include Charts</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions?.includeTables}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeTables: e?.target?.checked }))}
                    className="rounded border-border focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Include Data Tables</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exportOptions?.includeMetadata}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e?.target?.checked }))}
                    className="rounded border-border focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">Include Metadata</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Data Range</h4>
              
              <select
                value={exportOptions?.dateRange}
                onChange={(e) => setExportOptions(prev => ({ ...prev, dateRange: e?.target?.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
                <option value="all">All time</option>
              </select>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exportOptions?.compression}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, compression: e?.target?.checked }))}
                  className="rounded border-border focus:ring-primary"
                />
                <span className="text-sm text-foreground">Compress file</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Export Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-4"
        >
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isExporting ? (
              <>
                <Icon name="Loader2" size={20} className="animate-spin" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Icon name="Download" size={20} />
                <span>Export Now</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleScheduleExport}
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors flex items-center space-x-2"
          >
            <Icon name="Calendar" size={20} />
            <span>Schedule</span>
          </button>
        </motion.div>
      </div>
      {/* Export Preview & History */}
      <div className="space-y-6">
        {/* Export Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Export Preview</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Icon name={getDataTypeInfo(selectedDataType)?.icon} size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{getDataTypeInfo(selectedDataType)?.label}</p>
                  <p className="text-sm text-muted-foreground">{getFormatInfo(exportFormat)?.label}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Records:</span>
                  <span>{getDataTypeInfo(selectedDataType)?.records}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Size:</span>
                  <span>{getDataTypeInfo(selectedDataType)?.size}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span>{getFormatInfo(exportFormat)?.extension}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date Range:</span>
                  <span>{exportOptions?.dateRange}</span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>⚡ Fast export - typically completes in under 30 seconds</p>
              <p>🔒 Secure download - files are encrypted and temporary</p>
            </div>
          </div>
        </motion.div>

        {/* Export History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Recent Exports</h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {exportHistory?.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">
                <Icon name="Download" size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No exports yet</p>
              </div>
            ) : (
              exportHistory?.map((exportItem) => (
                <div key={exportItem?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getDataTypeInfo(exportItem?.type)?.icon} 
                      size={16} 
                      className="text-muted-foreground" 
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {getDataTypeInfo(exportItem?.type)?.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(exportItem?.timestamp)?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">{exportItem?.size}</span>
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <Icon name="Download" size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Export Templates */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Templates</h3>
          
          <div className="space-y-2">
            <button className="w-full p-3 text-left rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Executive Summary</p>
                  <p className="text-xs text-muted-foreground">PDF with key metrics</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-3 text-left rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Raw Data Dump</p>
                  <p className="text-xs text-muted-foreground">CSV with all data</p>
                </div>
              </div>
            </button>
            
            <button className="w-full p-3 text-left rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-2">
                <Icon name="BarChart3" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Visual Report</p>
                  <p className="text-xs text-muted-foreground">PDF with charts</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExportPanel;