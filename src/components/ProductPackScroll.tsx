import { useEffect, useRef, useMemo } from 'react';
import { useScroll, useTransform } from 'motion/react';
import { Product } from '../data/products';

interface Props {
  product: Product;
}

export default function ProductPackScroll({ product }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const totalFrames = product.frameCount || 120;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, totalFrames - 1]);

  // Preload images logic
  const images = useMemo(() => {
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      if (product.framePrefix) {
        const paddedIdx = i.toString().padStart(3, '0');
        img.src = `${product.folderPath}/${product.framePrefix}${paddedIdx}.${product.frameExtension || 'jpg'}`;
      } else {
        img.src = `${product.folderPath}/${i}.webp`;
      }
      imgs.push(img);
    }
    return imgs;
  }, [product.folderPath, product.frameCount, product.framePrefix, product.frameExtension, totalFrames]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const render = () => {
      const idx = Math.floor(frameIndex.get());
      const img = images[idx];
      
      if (img && img.complete) {
        // Clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate fit (cover)
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasAspect > imgAspect) {
          // Desktop / Wide Aspect Ratio: Use cover logic
          drawWidth = canvas.width;
          drawHeight = drawWidth / imgAspect;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          // Mobile / Tall Aspect Ratio: Strict cover logic to fill the screen completely
          drawHeight = canvas.height;
          drawWidth = drawHeight * imgAspect;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }

        context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
      requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (canvas) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = canvas.clientWidth * dpr;
        canvas.height = canvas.clientHeight * dpr;
        // DO NOT use context.scale(dpr, dpr) here because our draw calculations
        // are already based on the physical canvas.width and canvas.height!
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    const animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [images, frameIndex]);

  return (
    <div ref={containerRef} className="h-[500vh] relative">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ 
            background: product.gradient,
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
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
