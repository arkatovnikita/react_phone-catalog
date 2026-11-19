import { Outlet } from 'react-router-dom';
import { Header } from './modules/shared/components/Header';
import { Footer } from './modules/shared/components/Footer';
import { ToastProvider } from './modules/shared/context/ToastContext';
import { useScrollToTop } from './modules/shared/hooks/useScrollToTop';
import './App.scss';

export const App = () => {
  useScrollToTop();

  return (
    <ToastProvider>
      <div className="App">
        <Header />

        <main>
          <Outlet />
        </main>

        <Footer />
      </div>
    </ToastProvider>
  );
};
