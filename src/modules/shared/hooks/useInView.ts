import { useEffect, useRef, useState } from 'react';

export const useInView = <T extends Element>() => {
  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
};
