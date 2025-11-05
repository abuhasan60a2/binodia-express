import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(null);

let idSeq = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message, type = 'info', duration = 2500) => {
    const id = ++idSeq;
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => remove(id), duration);
  }, [remove]);

  const api = useMemo(() => ({ add, remove }), [add, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 space-y-2 w-[calc(100%-2rem)] max-w-md">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={[
              'rounded-lg shadow-lg px-4 py-3 text-sm text-white',
              'animate-[modalIn_200ms_ease-out]',
              t.type === 'success' && 'bg-emerald-600',
              t.type === 'error' && 'bg-rose-600',
              t.type === 'info' && 'bg-gray-800',
            ].filter(Boolean).join(' ')}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}


