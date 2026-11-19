import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'orchard-recently-viewed';
const MAX_ITEMS = 12;

export const useRecentlyViewed = () => {
  const [viewedIds, setViewedIds] = useLocalStorage<string[]>(STORAGE_KEY, []);

  const addViewed = useCallback(
    (itemId: string) => {
      setViewedIds(ids =>
        [itemId, ...ids.filter(id => id !== itemId)].slice(0, MAX_ITEMS),
      );
    },
    [setViewedIds],
  );

  return { viewedIds, addViewed };
};
