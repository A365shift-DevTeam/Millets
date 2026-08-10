import { useEffect, useState } from 'react';

const MOBILE_MAX = 1024;

function isMobileViewport() {
  if (typeof window === 'undefined') return false;

  return (
    window.innerWidth <= MOBILE_MAX ||
    window.matchMedia('(orientation: portrait)').matches
  );
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(isMobileViewport);

  useEffect(() => {
    const onResize = () => setIsMobile(isMobileViewport());
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', onResize, { passive: true });
    onResize();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);

  return isMobile;
}
