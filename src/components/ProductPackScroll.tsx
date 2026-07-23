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

  const images = useMemo(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = getFrameSrc(product, i);
      imgs.push(img);
    }
    return imgs;
  }, [
    product.folderPath,
    product.frameCount,
    product.frameStart,
    product.framePrefix,
    product.framePadLength,
    product.frameExtension,
    totalFrames,
  ]);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const clamped = Math.max(0, Math.min(totalFrames - 1, index));
    const img = images[clamped];
    if (!img?.complete || !img.naturalWidth) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

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

    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, [images, totalFrames, isMobile]);

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

    let loaded = 0;
    const onImageReady = () => {
      loaded += 1;
      setLoadProgress(Math.round((loaded / totalFrames) * 100));
      if (loaded === 1 || loaded === totalFrames) {
        drawFrame(currentFrameRef.current);
      }
    };

    images.forEach((img) => {
      if (img.complete) onImageReady();
      else {
        img.addEventListener('load', onImageReady);
        img.addEventListener('error', onImageReady);
      }
    });

    drawFrame(0);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      images.forEach((img) => {
        img.removeEventListener('load', onImageReady);
        img.removeEventListener('error', onImageReady);
      });
    };
  }, [images, drawFrame, totalFrames]);

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
                Loading — {loadProgress}%
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