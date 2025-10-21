import React, { useState, useEffect, createContext, useContext } from 'react';
import Icon from '../AppIcon';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    if (newToast?.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast?.duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev?.filter(toast => toast?.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  const toast = {
    success: (message, options = {}) => addToast({ ...options, type: 'success', message }),
    error: (message, options = {}) => addToast({ ...options, type: 'error', message }),
    warning: (message, options = {}) => addToast({ ...options, type: 'warning', message }),
    info: (message, options = {}) => addToast({ ...options, type: 'info', message }),
    loading: (message, options = {}) => addToast({ ...options, type: 'loading', message, duration: 0 }),
    custom: (component, options = {}) => addToast({ ...options, type: 'custom', component })
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  if (toasts?.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-400 space-y-3 max-w-sm w-full">
      {toasts?.map(toast => (
        <Toast key={toast?.id} toast={toast} onRemove={() => removeToast(toast?.id)} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove && onRemove(), 150); // Match animation duration
  };

  const getToastStyles = () => {
    const baseStyles = "glass-card p-4 shadow-floating border-l-4 transition-all duration-150";
    
    switch (toast?.type) {
      case 'success':
        return `${baseStyles} border-l-success bg-success/5`;
      case 'error':
        return `${baseStyles} border-l-error bg-error/5`;
      case 'warning':
        return `${baseStyles} border-l-warning bg-warning/5`;
      case 'loading':
        return `${baseStyles} border-l-primary bg-primary/5`;
      default:
        return `${baseStyles} border-l-border bg-muted/5`;
    }
  };

  const getIcon = () => {
    switch (toast?.type) {
      case 'success':
        return <Icon name="CheckCircle" size={20} className="text-success" />;
      case 'error':
        return <Icon name="XCircle" size={20} className="text-error" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={20} className="text-warning" />;
      case 'loading':
        return <Icon name="Loader2" size={20} className="text-primary animate-spin" />;
      default:
        return <Icon name="Info" size={20} className="text-muted-foreground" />;
    }
  };

  if (toast?.type === 'custom') {
    return (
      <div className={`
        transform transition-all duration-150 ease-out
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        {toast?.component}
      </div>
    );
  }

  return (
    <div className={`
      transform transition-all duration-150 ease-out
      ${isVisible && !isRemoving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
    `}>
      <div className={getToastStyles()}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            {toast?.title && (
              <h4 className="font-semibold text-sm text-foreground mb-1">
                {toast?.title}
              </h4>
            )}
            <p className="text-sm text-muted-foreground">
              {toast?.message}
            </p>
            {toast?.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {toast?.description}
              </p>
            )}
          </div>

          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1 hover:bg-muted/50 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <Icon name="X" size={14} />
          </button>
        </div>

        {/* Progress bar for timed toasts */}
        {toast?.duration > 0 && (
          <div className="mt-3 h-1 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-current opacity-50 rounded-full animate-progress"
              style={{ 
                animationDuration: `${toast?.duration}ms`,
                animationTimingFunction: 'linear'
              }}
            />
          </div>
        )}

        {/* Action buttons */}
        {toast?.action && (
          <div className="mt-3 flex space-x-2">
            <button
              onClick={toast?.action?.onClick}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-150"
            >
              {toast?.action?.label}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Progress bar animation
const progressKeyframes = `
  @keyframes progress {
    from { width: 100%; }
    to { width: 0%; }
  }
  .animate-progress {
    animation: progress linear;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = progressKeyframes;
  document.head?.appendChild(style);
}

export default ToastProvider;