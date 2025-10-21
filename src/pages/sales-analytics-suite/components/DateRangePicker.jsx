import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const DateRangePicker = ({ onDateChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('last30days');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const presetRanges = [
    { id: 'today', label: 'Today', days: 0 },
    { id: 'yesterday', label: 'Yesterday', days: 1 },
    { id: 'last7days', label: 'Last 7 days', days: 7 },
    { id: 'last30days', label: 'Last 30 days', days: 30 },
    { id: 'last90days', label: 'Last 90 days', days: 90 },
    { id: 'thisweek', label: 'This week', days: 'thisweek' },
    { id: 'thismonth', label: 'This month', days: 'thismonth' },
    { id: 'thisquarter', label: 'This quarter', days: 'thisquarter' },
    { id: 'thisyear', label: 'This year', days: 'thisyear' },
    { id: 'lastweek', label: 'Last week', days: 'lastweek' },
    { id: 'lastmonth', label: 'Last month', days: 'lastmonth' },
    { id: 'lastquarter', label: 'Last quarter', days: 'lastquarter' },
    { id: 'lastyear', label: 'Last year', days: 'lastyear' },
    { id: 'custom', label: 'Custom range', days: 'custom' }
  ];

  const calculateDateRange = (rangeId) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    switch (rangeId) {
      case 'today':
        return { start: startOfDay, end: endOfDay };
      
      case 'yesterday':
        const yesterday = new Date(startOfDay);
        yesterday?.setDate(yesterday?.getDate() - 1);
        const yesterdayEnd = new Date(yesterday);
        yesterdayEnd?.setHours(23, 59, 59);
        return { start: yesterday, end: yesterdayEnd };
      
      case 'last7days':
        const last7Start = new Date(startOfDay);
        last7Start?.setDate(last7Start?.getDate() - 6);
        return { start: last7Start, end: endOfDay };
      
      case 'last30days':
        const last30Start = new Date(startOfDay);
        last30Start?.setDate(last30Start?.getDate() - 29);
        return { start: last30Start, end: endOfDay };
      
      case 'last90days':
        const last90Start = new Date(startOfDay);
        last90Start?.setDate(last90Start?.getDate() - 89);
        return { start: last90Start, end: endOfDay };
      
      case 'thisweek':
        const thisWeekStart = new Date(startOfDay);
        thisWeekStart?.setDate(thisWeekStart?.getDate() - thisWeekStart?.getDay());
        return { start: thisWeekStart, end: endOfDay };
      
      case 'thismonth':
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start: thisMonthStart, end: endOfDay };
      
      case 'thisquarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return { start: quarterStart, end: endOfDay };
      
      case 'thisyear':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return { start: yearStart, end: endOfDay };
      
      case 'lastweek':
        const lastWeekEnd = new Date(startOfDay);
        lastWeekEnd?.setDate(lastWeekEnd?.getDate() - lastWeekEnd?.getDay() - 1);
        lastWeekEnd?.setHours(23, 59, 59);
        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart?.setDate(lastWeekStart?.getDate() - 6);
        lastWeekStart?.setHours(0, 0, 0);
        return { start: lastWeekStart, end: lastWeekEnd };
      
      case 'lastmonth':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
        return { start: lastMonthStart, end: lastMonthEnd };
      
      case 'lastquarter':
        const lastQuarterMonth = Math.floor(today?.getMonth() / 3) * 3 - 3;
        const lastQuarterStart = new Date(today.getFullYear(), lastQuarterMonth, 1);
        const lastQuarterEnd = new Date(today.getFullYear(), lastQuarterMonth + 3, 0, 23, 59, 59);
        return { start: lastQuarterStart, end: lastQuarterEnd };
      
      case 'lastyear':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59);
        return { start: lastYearStart, end: lastYearEnd };
      
      default:
        return { start: startOfDay, end: endOfDay };
    }
  };

  const formatDateRange = (rangeId) => {
    if (rangeId === 'custom') {
      if (customStartDate && customEndDate) {
        const start = new Date(customStartDate)?.toLocaleDateString();
        const end = new Date(customEndDate)?.toLocaleDateString();
        return `${start} - ${end}`;
      }
      return 'Select custom range';
    }
    
    const range = calculateDateRange(rangeId);
    const start = range?.start?.toLocaleDateString();
    const end = range?.end?.toLocaleDateString();
    
    if (start === end) {
      return start;
    }
    
    return `${start} - ${end}`;
  };

  const handleRangeSelect = (rangeId) => {
    setSelectedRange(rangeId);
    
    if (rangeId !== 'custom') {
      const dateRange = calculateDateRange(rangeId);
      onDateChange?.(dateRange);
      setIsOpen(false);
    }
  };

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      end?.setHours(23, 59, 59);
      
      onDateChange?.({ start, end });
      setIsOpen(false);
    }
  };

  const getSelectedLabel = () => {
    const preset = presetRanges?.find(range => range?.id === selectedRange);
    return preset ? preset?.label : 'Select range';
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-background border border-border rounded-lg hover:bg-muted/50 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <Icon name="Calendar" size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{getSelectedLabel()}</span>
        <Icon 
          name="ChevronDown" 
          size={14} 
          className={`text-muted-foreground transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-floating z-300 animate-scale-in">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-foreground">Select Date Range</h4>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted/50 rounded-md transition-colors duration-150"
              >
                <Icon name="X" size={16} />
              </button>
            </div>

            {/* Preset Ranges */}
            <div className="space-y-1 mb-4">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Quick Select
              </h5>
              <div className="grid grid-cols-2 gap-1">
                {presetRanges?.filter(range => range?.id !== 'custom')?.map((range) => (
                  <button
                    key={range?.id}
                    onClick={() => handleRangeSelect(range?.id)}
                    className={`text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                      selectedRange === range?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    {range?.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range */}
            <div className="border-t border-border pt-4">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                Custom Range
              </h5>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e?.target?.value)}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">End Date</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e?.target?.value)}
                      className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleCustomDateApply}
                  disabled={!customStartDate || !customEndDate}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  Apply Custom Range
                </button>
              </div>
            </div>

            {/* Current Selection Display */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Selected:</span>
                <span className="font-medium text-foreground">{formatDateRange(selectedRange)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 -z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default DateRangePicker;