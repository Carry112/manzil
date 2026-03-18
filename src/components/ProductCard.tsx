import { useState } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  rotation?: number;
}

export function ProductCard({ product, featured = false, rotation = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={`/product/${product.slug}`}
      className={`group block relative overflow-hidden transition-all duration-500 ${
        featured ? 'col-span-2 row-span-2' : ''
      }`}
      style={{ transform: `rotate(${rotation}deg)` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-gradient-to-b from-[#FFCCE0]/30 to-[#C8DCFF]/30 overflow-hidden rounded-2xl">
        {product.images[0] && (
          <>
            <img
              src={product.images[0]}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
              }`}
            />
            {product.images[1] && (
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

        {/* Hover overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#3D2B3D]/60 via-[#FFB3D1]/10 to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <p className="font-mono text-white text-sm mb-2">${product.price.toFixed(2)}</p>
            <button className="text-white text-xs uppercase tracking-widest hover:text-[#FFB3D1] transition-colors border border-white/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
              Quick View
            </button>
          </div>
        </div>

        {/* New badge */}
        {product.new_arrival && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-[#FFB3D1] to-[#FFCCE0] text-white text-xs rounded-full font-medium tracking-wide shadow-md">
            New
          </div>
        )}
      </div>

      <div className="mt-3 px-1">
        <h3 className="font-serif text-lg text-[#3D2B3D] group-hover:text-[#FFB3D1] transition-colors">
          {product.name}
        </h3>
        <p className="font-mono text-sm text-[#B0A0B0] mt-1">${product.price.toFixed(2)}</p>
      </div>
    </a>
  );
}
