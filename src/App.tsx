import { Outlet } from 'react-router-dom';
import { Header } from './modules/shared/components/Header';
import { Footer } from './modules/shared/components/Footer';
import './App.scss';

export const App = () => (
  <div className="App">
    <Header />

    <main>
      <Outlet />
    </main>

    <Footer />
  </div>
);
