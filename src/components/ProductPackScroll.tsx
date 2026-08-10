import { useEffect, useRef, useMemo, useCallback, useState, type ReactNode } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { Product } from '../data/products';
import { useIsMobile } from '../hooks/useIsMobile';

interface Props {
  product: Product;
  mobileContent?: ReactNode;
}

const IMG_ASPECT = 16 / 9;

function getFrameSrc(product: Product, frameNumber: number) {
  const sourceFrameNumber = (product.frameStart ?? 1) + frameNumber - 1;
  const padded = sourceFrameNumber.toString().padStart(product.framePadLength ?? 3, '0');
  const prefix = product.framePrefix ?? '';
  return `${product.folderPath}/${prefix}${padded}.${product.frameExtension || 'jpg'}`;
}

export default function ProductPackScroll({ product, mobileContent }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const isMobile = useIsMobile();
  const totalFrames = product.frameCount || 120;
  const [loadProgress, setLoadProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Array of HTMLImageElement references
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadedCountRef = useRef(0);

  // Initialize image array structure
  useEffect(() => {
    imagesRef.current = new Array(totalFrames).fill(null);
    loadedCountRef.current = 0;
    setLoadProgress(0);

    let isMounted = true;

    // Helper to load a single frame with async decoding
    const loadFrame = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        if (imagesRef.current[index]) {
          resolve(imagesRef.current[index]!);
          return;
        }
        const img = new Image();
        img.src = getFrameSrc(product, index + 1);
        
        const onLoaded = () => {
          if (!isMounted) return;
          imagesRef.current[index] = img;
          loadedCountRef.current += 1;
          const currentProgress = Math.round((loadedCountRef.current / totalFrames) * 100);
          setLoadProgress(currentProgress);
          
          if (index === currentFrameRef.current) {
            drawFrame(index);
          }
          resolve(img);
        };

        if (img.complete && img.naturalWidth) {
          onLoaded();
        } else {
          img.onload = () => {
            // Attempt off-thread decode if supported
            if ('decode' in img) {
              img.decode().then(onLoaded).catch(onLoaded);
            } else {
              onLoaded();
            }
          };
          img.onerror = () => {
            if (!isMounted) return;
            loadedCountRef.current += 1;
            setLoadProgress(Math.round((loadedCountRef.current / totalFrames) * 100));
            reject(new Error(`Failed to load frame ${index}`));
          };
        }
      });
    };

    // Progressive loading pipeline for optimal initial load speed
    const loadAllProgressively = async () => {
      // 1. Critical first frames (1-5)
      const firstBatch = [0, 1, 2, 3, 4].filter(i => i < totalFrames);
      await Promise.all(firstBatch.map(loadFrame));
      if (!isMounted) return;
      drawFrame(currentFrameRef.current);

      // 2. Keyframes across animation (every 5th frame)
      const keyframes: number[] = [];
      for (let i = 5; i < totalFrames; i += 5) {
        keyframes.push(i);
      }
      await Promise.all(keyframes.map(loadFrame));
      if (!isMounted) return;

      // 3. Remaining intermediate frames
      const remaining: number[] = [];
      for (let i = 0; i < totalFrames; i++) {
        if (!imagesRef.current[i]) remaining.push(i);
      }

      // Batch remaining in chunks of 10 to avoid socket exhaustion
      const CHUNK_SIZE = 10;
      for (let i = 0; i < remaining.length; i += CHUNK_SIZE) {
        if (!isMounted) return;
        const chunk = remaining.slice(i, i + CHUNK_SIZE);
        await Promise.all(chunk.map(loadFrame));
      }
    };

    loadAllProgressively();

    return () => {
      isMounted = false;
    };
  }, [product, totalFrames]);

  // Find nearest loaded frame if exact target frame is still downloading
  const getNearestLoadedImage = useCallback((targetIdx: number): HTMLImageElement | null => {
    const images = imagesRef.current;
    if (images[targetIdx]?.complete && images[targetIdx]?.naturalWidth) {
      return images[targetIdx];
    }
    // Search outwards from targetIdx
    for (let delta = 1; delta < totalFrames; delta++) {
      const prev = targetIdx - delta;
      if (prev >= 0 && images[prev]?.complete && images[prev]?.naturalWidth) {
        return images[prev];
      }
      const next = targetIdx + delta;
      if (next < totalFrames && images[next]?.complete && images[next]?.naturalWidth) {
        return images[next];
      }
    }
    return null;
  }, [totalFrames]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    const clamped = Math.max(0, Math.min(totalFrames - 1, index));
    const img = getNearestLoadedImage(clamped);
    if (!img) return;

    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.width / img.height;
    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (isMobile) {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = 0;
    } else if (canvasAspect > imgAspect) {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    context.fillStyle = '#0B1D16'; // Brand forest background match
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [totalFrames, isMobile, getNearestLoadedImage]);

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    const idx = Math.round(latest);
    if (idx === currentFrameRef.current) return;
    currentFrameRef.current = idx;
    drawFrame(idx);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      drawFrame(currentFrameRef.current);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [drawFrame]);

  const isLoading = loadProgress < 100;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isMobile ? 'h-[300vh] pt-[var(--nav-height)]' : 'h-[240vh]'}`}
    >
      <div
        className={`w-full overflow-hidden bg-brand-forest lg:bg-brand-surface ${
          isMobile ? 'sticky top-[var(--nav-height)]' : 'sticky top-0 h-[100dvh]'
        }`}
      >
        <div className={`relative w-full bg-brand-forest ${isMobile ? '' : 'h-full'}`}>
          <canvas
            ref={canvasRef}
            className="w-full block touch-none"
            style={
              isMobile
                ? { height: `calc(100vw / ${IMG_ASPECT})` }
                : { height: '100%', minHeight: '100%' }
            }
          />

          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-brand-forest gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-brand-accent/30 border-t-brand-accent animate-spin" />
              <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.35em] text-white/70 tabular-nums">
                Loading - {loadProgress}%
              </p>
            </div>
          )}
        </div>

        {isMobile && mobileContent && (
          <div id="story" className="bg-brand-parchment border-t border-brand-border px-4 sm:px-6 py-10 sm:py-14">
            {mobileContent}
          </div>
        )}

        {!isMobile && (
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: product.gradient,
              maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
            }}
          />
        )}
      </div>
    </div>
  );
}
