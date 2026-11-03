import { Outlet } from 'react-router-dom';
import './App.scss';

export const App = () => (
  <div className="App">
    <h1 className="visually-hidden">Product Catalog</h1>

    <header>Header</header>

    <main>
      <Outlet />
    </main>

    <footer>Footer</footer>
  </div>
);
