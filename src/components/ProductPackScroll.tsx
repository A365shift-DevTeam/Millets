import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { Product } from '../data/products';

interface Props {
  product: Product;
}

function getFrameSrc(product: Product, frameNumber: number) {
  const padded = frameNumber.toString().padStart(product.framePadLength ?? 3, '0');
  const prefix = product.framePrefix ?? '';
  return `${product.folderPath}/${prefix}${padded}.${product.frameExtension || 'jpg'}`;
}

export default function ProductPackScroll({ product }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const totalFrames = product.frameCount || 120;

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

    if (canvasAspect > imgAspect) {
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
  }, [images, totalFrames]);

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
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    let loaded = 0;
    const onImageReady = () => {
      loaded += 1;
      if (loaded === 1 || loaded === totalFrames) {
        drawFrame(currentFrameRef.current);
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        onImageReady();
      } else {
        img.addEventListener('load', onImageReady);
        img.addEventListener('error', onImageReady);
      }
    });

    drawFrame(0);

    return () => {
      window.removeEventListener('resize', handleResize);
      images.forEach((img) => {
        img.removeEventListener('load', onImageReady);
        img.removeEventListener('error', onImageReady);
      });
    };
  }, [images, drawFrame, totalFrames]);

  return (
    <div ref={containerRef} className="h-[500vh] relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: product.gradient,
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          }}
        />

        <canvas
          ref={canvasRef}
          className="w-full h-full relative z-10"
        />
      </div>
    </div>
  );
}