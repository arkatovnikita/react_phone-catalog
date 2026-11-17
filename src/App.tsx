import { Outlet } from 'react-router-dom';
import { Header } from './modules/shared/components/Header';
import { Footer } from './modules/shared/components/Footer';
import { ToastProvider } from './modules/shared/context/ToastContext';
import './App.scss';

export const App = () => (
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
