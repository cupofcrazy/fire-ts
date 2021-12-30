import { useState, useEffect } from 'react';

export const useOnScreen = <T extends Element>(ref: React.MutableRefObject<T>, rootMargin = '0px') => {
  const [isOnScreen, setIsOnScreen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOnScreen(entry.isIntersecting);
      }, {
        rootMargin
      }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      observer.unobserve(ref.current);
    }
  }, []);
  return isOnScreen;
}