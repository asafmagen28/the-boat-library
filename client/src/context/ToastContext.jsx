import { createContext, useContext, useState, useCallback, useRef } from 'react';
import Toast from '../components/Toast/Toast';
import containerStyles from '../components/Toast/ToastContainer.module.scss';

const ToastContext = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, variant = 'info', duration = 5000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    timersRef.current[id] = setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className={containerStyles.container}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={`toast-${toast.id}`}
            message={toast.message}
            variant={toast.variant}
            onDismiss={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
