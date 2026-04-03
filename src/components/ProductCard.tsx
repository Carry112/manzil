import { useRef, useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  rotation?: number;
}

export function ProductCard({ product, featured = false, rotation = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const hasSecondImage = Boolean(product.images[1]);
  const price = `$${product.price.toFixed(2)}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const tiltX = (y - centerY) / 24;
    const tiltY = -(x - centerX) / 24;
    setTilt({ x: tiltX, y: tiltY });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <a
      href={`/product/${product.slug}`}
      className={`group relative block overflow-hidden transition-all duration-500 ${
        featured ? 'col-span-2 row-span-2' : ''
      }`}
      style={{ transform: `rotate(${rotation}deg)` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        resetTilt();
      }}
    >
      <div className="pointer-events-none absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle_at_20%_20%,rgba(255,143,195,0.22),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(111,163,255,0.2),transparent_44%)] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-[#2B1E2B]/15 bg-gradient-to-br from-[#FFE7F3] via-[#FFF6FB] to-[#EAF1FF] shadow-[0_20px_50px_-30px_rgba(43,30,43,0.65)] transition-transform duration-300"
        style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        {product.images[0] && (
          <>
            {/* Keep the same image-swap-on-hover behavior */}
            <img
              src={product.images[0]}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
              }`}
            />
            {hasSecondImage && (
              <img
                src={product.images[1]}
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                }`}
              />
            )}
          </>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#241824]/60 via-[#241824]/10 to-transparent" />

        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border border-white/55 bg-white/75 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#2B1E2B] backdrop-blur-sm">
          <Sparkles className="h-3 w-3 text-[#FF8FC3]" />
          Signature
        </div>

        <div className="pointer-events-none absolute left-3 right-3 top-12 h-px bg-gradient-to-r from-white/50 via-[#FFB3D1]/70 to-white/30" />

        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#2B1E2B]/80 via-[#2B1E2B]/25 to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-5 transition-transform duration-500 group-hover:translate-y-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/12 px-3 py-1.5 text-white backdrop-blur-sm">
              <span className="text-xs uppercase tracking-[0.17em]">Quick View</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {product.new_arrival && (
          <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-[#FF8FC3] to-[#6FA3FF] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-lg shadow-[#FF8FC3]/30">
            New
          </div>
        )}
      </div>

      <div className="mt-3 rounded-2xl border border-[#2B1E2B]/10 bg-white/70 px-3 py-3 backdrop-blur-sm transition-colors group-hover:border-[#FF8FC3]/35">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg leading-tight text-[#2B1E2B] transition-colors group-hover:text-[#FF8FC3]">
            {product.name}
          </h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-[#B79EB7] transition-colors group-hover:text-[#6FA3FF]" />
        </div>
        <p className="mt-2 font-mono text-sm text-[#B0A0B0]">{price}</p>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-transparent transition-colors duration-500 group-hover:border-[#FF8FC3]/40" />
    </a>
  );
}
