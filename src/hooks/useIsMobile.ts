import { useEffect, useState } from 'react';

const MOBILE_MAX = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= MOBILE_MAX
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= MOBILE_MAX);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}