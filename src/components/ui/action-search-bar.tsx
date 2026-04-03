import { useEffect, useMemo, useState } from 'react';
import { Input } from './input';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import type { Category, Product } from '../../types';

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface ActionSearchBarProps {
  className?: string;
  placeholder?: string;
  onProductSelect?: (product: Product) => void;
}

function ActionSearchBar({
  className = '',
  placeholder = 'Search shoes, styles, drops...',
  onProductSelect,
}: ActionSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 180);

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      setIsLoading(true);
      setLoadError(null);

      const [productsResult, categoriesResult] = await Promise.all([
        api.products.list(),
        api.categories.list(),
      ]);

      if (!active) return;

      if (productsResult.error) {
        setLoadError('Unable to load products');
      } else {
        setProducts(productsResult.data || []);
      }

      if (!categoriesResult.error) {
        setCategories(categoriesResult.data || []);
      }

      setIsLoading(false);
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const categoryById = useMemo(
    () =>
      categories.reduce<Record<string, string>>((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {}),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const ranked = [...products].sort((a, b) => {
      const aScore = Number(a.featured) * 2 + Number(a.new_arrival);
      const bScore = Number(b.featured) * 2 + Number(b.new_arrival);
      if (bScore !== aScore) return bScore - aScore;
      return a.name.localeCompare(b.name);
    });

    if (!normalizedQuery) {
      return ranked.slice(0, 7);
    }

    return ranked
      .filter((product) => {
        const text = [
          product.name,
          product.slug,
          product.description,
          categoryById[product.category_id] || '',
          ...(product.sizes || []),
        ]
          .join(' ')
          .toLowerCase();

        return text.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [categoryById, debouncedQuery, products]);

  const showDropdown = isFocused;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleProductClick = (product: Product) => {
    setQuery(product.name);
    setIsFocused(false);
    onProductSelect?.(product);

    window.history.pushState({}, '', `/product/${product.slug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
  };

  const container = {
    hidden: { opacity: 0, y: -6, height: 0 },
    show: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: {
        height: { duration: 0.25 },
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -4,
      height: 0,
      transition: {
        height: { duration: 0.2 },
        opacity: { duration: 0.15 },
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.12 } },
  };

  return (
    <div className={`w-full max-w-[320px] ${className}`}>
      <div className="relative">
        <label
          className="mb-1 block text-[10px] font-medium uppercase tracking-[0.2em] text-[#8E7E8E]"
          htmlFor="action-search"
        >
          Search Shoes
        </label>

        <div className="relative">
          <Input
            id="action-search"
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={() => window.setTimeout(() => setIsFocused(false), 180)}
            className="h-10 rounded-xl border-[#FFB3D1]/35 bg-white/80 pl-3 pr-9 text-sm text-[#3D2B3D] placeholder:text-[#AA99AA] focus-visible:border-[#FF8FC3] focus-visible:ring-4 focus-visible:ring-[#FF8FC3]/20 focus-visible:ring-offset-0"
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4">
            <Search className="h-4 w-4 text-[#AA99AA]" />
          </div>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-[#FFB3D1]/25 bg-white shadow-[0_20px_40px_-28px_rgba(43,30,43,0.55)]"
              variants={container}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {isLoading ? (
                <div className="px-3 py-3 text-sm text-[#8C7C8C]">Loading products...</div>
              ) : loadError ? (
                <div className="px-3 py-3 text-sm text-[#A56D89]">{loadError}</div>
              ) : filteredProducts.length === 0 ? (
                <div className="px-3 py-3 text-sm text-[#8C7C8C]">No shoes found for "{query}"</div>
              ) : (
                <motion.ul>
                  {filteredProducts.map((product) => {
                    const image = product.images?.[0];
                    const category = categoryById[product.category_id] || 'Shoes';
                    return (
                      <motion.li
                        key={product.id}
                        className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 transition-colors hover:bg-[#FFF0F8]"
                        variants={item}
                        layout
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-[#F0D8E7] bg-[#FDF4FA]">
                            {image ? (
                              <img src={image} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="grid h-full w-full place-items-center text-[#B6A0B6]">
                                <Sparkles className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[#3D2B3D]">{product.name}</p>
                            <p className="truncate text-xs text-[#9B8A9B]">{category}</p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 text-[11px] text-[#9F8E9F]">
                          {product.new_arrival && (
                            <span className="rounded-full bg-[#FFE8F4] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[#C06A99]">
                              New
                            </span>
                          )}
                          <span className="font-medium text-[#5B4B5B]">${product.price.toFixed(2)}</span>
                        </div>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              )}

              <div className="border-t border-[#F1DFEA] px-3 py-2">
                <div className="flex items-center justify-between text-[11px] text-[#A695A6]">
                  <span>{query.trim() ? 'Tap a shoe to open details' : 'Top picks from latest drops'}</span>
                  <span>{filteredProducts.length} shown</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { ActionSearchBar };
