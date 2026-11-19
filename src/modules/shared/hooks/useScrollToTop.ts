import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollToTop = () => {
  const { pathname } = useLocation();
  const pageKey = pathname.startsWith('/product/') ? '/product' : pathname;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pageKey]);
};
