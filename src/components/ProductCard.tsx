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
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-[#F5F1E8] overflow-hidden">
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

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
            <p className="font-mono text-white text-sm mb-1">${product.price.toFixed(2)}</p>
            <button className="text-white text-sm uppercase tracking-wider hover:text-[#C1876B] transition-colors">
              Quick View
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <h3 className="font-serif text-lg text-[#2C2C2C] group-hover:text-[#C1876B] transition-colors">
          {product.name}
        </h3>
        {!isHovered && (
          <p className="font-mono text-sm text-[#A8A8A8] mt-1">${product.price.toFixed(2)}</p>
        )}
      </div>
    </a>
  );
}
