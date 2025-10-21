import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const GlobalSearch = ({ isInSidebar = false }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

  // Mock search data - replace with actual API calls
  const mockData = {
    customers: [
      { id: 1, name: 'Acme Corporation', type: 'customer', email: 'contact@acme.com' },
      { id: 2, name: 'Tech Solutions Inc', type: 'customer', email: 'info@techsolutions.com' }
    ],
    leads: [
      { id: 1, name: 'John Smith', type: 'lead', company: 'Smith Industries', status: 'qualified' },
      { id: 2, name: 'Sarah Johnson', type: 'lead', company: 'Johnson Corp', status: 'new' }
    ],
    invoices: [
      { id: 1, number: 'INV-001', type: 'invoice', customer: 'Acme Corporation', amount: '$2,500' },
      { id: 2, number: 'INV-002', type: 'invoice', customer: 'Tech Solutions Inc', amount: '$1,800' }
    ],
    products: [
      { id: 1, name: 'Premium Software License', type: 'product', sku: 'PSL-001', price: '$299' },
      { id: 2, name: 'Consulting Services', type: 'product', sku: 'CS-001', price: '$150/hr' }
    ]
  };

  const searchData = (searchQuery) => {
    const query = searchQuery?.toLowerCase();
    const results = [];

    Object.entries(mockData)?.forEach(([category, items]) => {
      items?.forEach(item => {
        const searchableText = Object.values(item)?.join(' ')?.toLowerCase();
        if (searchableText?.includes(query)) {
          results?.push({ ...item, category });
        }
      });
    });

    return results?.slice(0, 8); // Limit results
  };

  const handleSearch = async (searchQuery) => {
    if (!searchQuery?.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const searchResults = searchData(searchQuery);
      setResults(searchResults);
      setIsLoading(false);
      setSelectedIndex(-1);
    }, 300);
  };

  const handleInputChange = (e) => {
    const value = e?.target?.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleResultClick = (result) => {
    const routes = {
      customer: '/customer-directory',
      lead: '/lead-pipeline-management',
      invoice: '/modern-invoice-generator',
      product: '/product-inventory-hub'
    };

    navigate(routes?.[result?.type] || '/main-dashboard');
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results?.length === 0) return;

    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev < results?.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e?.preventDefault();
        if (selectedIndex >= 0) {
          handleResultClick(results?.[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef?.current?.blur();
        break;
    }
  };

  const getResultIcon = (type) => {
    const icons = {
      customer: 'Users',
      lead: 'TrendingUp',
      invoice: 'FileText',
      product: 'Package'
    };
    return icons?.[type] || 'Search';
  };

  const getResultSubtitle = (result) => {
    switch (result?.type) {
      case 'customer':
        return result?.email;
      case 'lead':
        return `${result?.company} • ${result?.status}`;
      case 'invoice':
        return `${result?.customer} • ${result?.amount}`;
      case 'product':
        return `${result?.sku} • ${result?.price}`;
      default:
        return '';
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef?.current && !resultsRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isInSidebar) {
    return (
      <div className="relative" ref={resultsRef}>
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-transparent rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-background transition-all duration-150"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted/50 rounded-md transition-colors duration-150"
            >
              <Icon name="X" size={12} />
            </button>
          )}
        </div>
        {/* Results Dropdown */}
        {isOpen && (query || results?.length > 0) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-floating z-300 max-h-80 overflow-y-auto animate-scale-in">
            {isLoading ? (
              <div className="p-4 text-center">
                <Icon name="Loader2" size={20} className="animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </div>
            ) : results?.length > 0 ? (
              <div className="p-2">
                {results?.map((result, index) => (
                  <button
                    key={`${result?.type}-${result?.id}`}
                    onClick={() => handleResultClick(result)}
                    className={`
                      w-full flex items-center space-x-3 p-3 rounded-md text-left transition-colors duration-150
                      ${index === selectedIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'}
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center
                      ${index === selectedIndex ? 'bg-primary/20' : 'bg-muted/50'}
                    `}>
                      <Icon name={getResultIcon(result?.type)} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{result?.name || result?.number}</p>
                      <p className="text-xs text-muted-foreground truncate">{getResultSubtitle(result)}</p>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">{result?.category}</span>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="p-4 text-center">
                <Icon name="SearchX" size={20} className="mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">No results found</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  // Full-screen search overlay for mobile
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-glass z-400 animate-fade-in">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search customers, leads, invoices, products..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-lg focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-150"
                autoFocus
              />
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 hover:bg-muted/50 rounded-xl transition-colors duration-150"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12">
              <Icon name="Loader2" size={32} className="animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">Searching...</p>
            </div>
          ) : results?.length > 0 ? (
            <div className="space-y-2">
              {results?.map((result, index) => (
                <button
                  key={`${result?.type}-${result?.id}`}
                  onClick={() => handleResultClick(result)}
                  className={`
                    w-full flex items-center space-x-4 p-4 bg-card border border-border rounded-xl text-left transition-all duration-150 hover:shadow-elevated
                    ${index === selectedIndex ? 'border-primary/50 bg-primary/5' : 'hover:border-border/80'}
                  `}
                >
                  <div className="w-12 h-12 bg-muted/50 rounded-xl flex items-center justify-center">
                    <Icon name={getResultIcon(result?.type)} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{result?.name || result?.number}</h3>
                    <p className="text-sm text-muted-foreground truncate">{getResultSubtitle(result)}</p>
                  </div>
                  <span className="text-sm text-muted-foreground capitalize bg-muted/50 px-3 py-1 rounded-full">
                    {result?.category}
                  </span>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <Icon name="SearchX" size={32} className="mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">No results found for "{query}"</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;