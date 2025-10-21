import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const ImportExportModal = ({ isOpen, onClose, type = 'import' }) => {
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);

  const formatOptions = [
    { value: 'csv', label: 'CSV Format' },
    { value: 'excel', label: 'Excel Format (.xlsx)' },
    { value: 'json', label: 'JSON Format' }
  ];

  const exportOptions = [
    { value: 'all', label: 'All Customers' },
    { value: 'active', label: 'Active Customers Only' },
    { value: 'selected', label: 'Selected Customers' },
    { value: 'filtered', label: 'Current Filter Results' }
  ];

  const handleFileSelect = (event) => {
    const file = event?.target?.files?.[0];
    setSelectedFile(file);
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setStep(3); // Success step
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDownloadTemplate = () => {
    // Simulate template download
    console.log(`Downloading ${selectedFormat} template`);
  };

  const resetModal = () => {
    setStep(1);
    setSelectedFile(null);
    setProgress(0);
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-400 flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name={type === 'import' ? 'Upload' : 'Download'} size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {type === 'import' ? 'Import Customers' : 'Export Customers'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {type === 'import' ?'Upload customer data from file' :'Download customer data to file'
                }
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" iconName="X" onClick={handleClose} />
        </div>

        {/* Content */}
        <div className="p-6">
          {type === 'import' ? (
            <>
              {/* Import Steps */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-4">
                  {[1, 2, 3]?.map((stepNum) => (
                    <React.Fragment key={stepNum}>
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${step >= stepNum 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {step > stepNum ? <Icon name="Check" size={16} /> : stepNum}
                      </div>
                      {stepNum < 3 && (
                        <div className={`w-12 h-0.5 ${step > stepNum ? 'bg-primary' : 'bg-muted'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <Select
                    label="File Format"
                    options={formatOptions}
                    value={selectedFormat}
                    onChange={setSelectedFormat}
                  />

                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-foreground">Download Template</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Download"
                        onClick={handleDownloadTemplate}
                      >
                        Download
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Download a template file with the correct format and column headers for importing your customer data.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-foreground">
                      Select File to Import
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors duration-150">
                      <input
                        type="file"
                        accept=".csv,.xlsx,.json"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Icon name="Upload" size={32} className="mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm font-medium text-foreground mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          CSV, Excel, or JSON files up to 10MB
                        </p>
                      </label>
                    </div>
                    
                    {selectedFile && (
                      <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg">
                        <Icon name="FileText" size={16} className="text-success" />
                        <span className="text-sm font-medium text-success">{selectedFile?.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="X"
                          onClick={() => setSelectedFile(null)}
                          className="ml-auto h-6 w-6 p-0"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => setStep(2)}
                      disabled={!selectedFile}
                      iconName="ArrowRight"
                      iconPosition="right"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Processing Import
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Please wait while we process your file...
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button onClick={handleProcess} disabled={isProcessing} loading={isProcessing}>
                      {isProcessing ? 'Processing...' : 'Start Import'}
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="CheckCircle" size={32} className="text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Import Completed Successfully
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Successfully imported 150 customers with 3 duplicates skipped.
                    </p>
                  </div>
                  <Button onClick={handleClose}>
                    Close
                  </Button>
                </div>
              )}
            </>
          ) : (
            // Export Content
            (<div className="space-y-6">
              <Select
                label="Export Data"
                options={exportOptions}
                value="all"
                onChange={() => {}}
              />
              <Select
                label="File Format"
                options={formatOptions}
                value={selectedFormat}
                onChange={setSelectedFormat}
              />
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium text-foreground mb-2">Export Summary</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Total customers: 1,247</p>
                  <p>• File format: {formatOptions?.find(f => f?.value === selectedFormat)?.label}</p>
                  <p>• Estimated file size: 2.3 MB</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button iconName="Download" iconPosition="left">
                  Export Data
                </Button>
              </div>
            </div>)
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;