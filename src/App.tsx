import { Outlet } from 'react-router-dom';
import { Header } from './modules/shared/components/Header';
import './App.scss';

export const App = () => (
  <div className="App">
    <h1 className="visually-hidden">Product Catalog</h1>

    <Header />

    <main>
      <Outlet />
    </main>

    <footer>Footer</footer>
  </div>
);
