import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Toast } from '../types/Toast';
import { Toaster } from '../components/Toaster';

type ToastContextValue = {
  showToast: (message: string, link?: Toast['link']) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION = 3500;
const MAX_TOASTS = 3;

type Props = {
  children: ReactNode;
};

export const ToastProvider = ({ children }: Props) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const hideToast = useCallback((id: number) => {
    setToasts(current => current.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, link?: Toast['link']) => {
      nextId.current += 1;

      const id = nextId.current;

      setToasts(current =>
        [...current, { id, message, link }].slice(-MAX_TOASTS),
      );
      window.setTimeout(() => hideToast(id), TOAST_DURATION);
    },
    [hideToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used inside ToastProvider');
  }

  return context;
};
