import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Texture } from '../components/Texture';
import { ProductCard } from '../components/ProductCard';
import type { Product, Category } from '../types';

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sizes, setSizes] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [selectedCategory]);

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*');
    if (data) setCategories(data);
  };

  const loadProducts = async () => {
    let query = supabase.from('products').select('*');

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory);
    }

    const { data } = await query;
    if (data) setProducts(data);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 500]);
    setSizes([]);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-24">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h1 className="font-serif text-5xl md:text-6xl text-[#2C2C2C] mb-2">Shop</h1>
            <p className="text-[#A8A8A8]">{products.length} products</p>
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-6 py-3 border border-[#E8DCC4] hover:border-[#C1876B] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-sm uppercase tracking-wider">Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-auto">
          {products.map((product, index) => {
            const isFeatured = index % 7 === 0;
            return (
              <div
                key={product.id}
                className={isFeatured ? 'md:col-span-2 md:row-span-2' : ''}
              >
                <ProductCard product={product} featured={isFeatured} />
              </div>
            );
          })}
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 w-full md:w-[400px] bg-[#FAF9F6] z-50 transform transition-transform duration-500 ease-out ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full overflow-y-auto">
          <Texture type="canvas" opacity={0.04} />

          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-[#2C2C2C]">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:scale-110 transition-transform"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm uppercase tracking-wider text-[#2C2C2C] mb-4">Category</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="w-4 h-4 text-[#C1876B] border-[#E8DCC4] focus:ring-[#C1876B]"
                    />
                    <span className="text-[#2C2C2C] group-hover:text-[#C1876B] transition-colors">
                      All
                    </span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="w-4 h-4 text-[#C1876B] border-[#E8DCC4] focus:ring-[#C1876B]"
                      />
                      <span className="text-[#2C2C2C] group-hover:text-[#C1876B] transition-colors">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-[#E8DCC4]">
                <h3 className="text-sm uppercase tracking-wider text-[#2C2C2C] mb-4">
                  Price Range
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1 bg-[#E8DCC4] rounded-lg appearance-none cursor-pointer accent-[#C1876B]"
                  />
                  <div className="flex justify-between mt-3 text-sm text-[#A8A8A8] font-mono">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-[#E8DCC4]">
                <h3 className="text-sm uppercase tracking-wider text-[#2C2C2C] mb-4">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['6', '7', '8', '9', '10', '11', '12', '13'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSizes((prev) =>
                          prev.includes(size)
                            ? prev.filter((s) => s !== size)
                            : [...prev, size]
                        );
                      }}
                      className={`px-4 py-3 border transition-colors ${
                        sizes.includes(size)
                          ? 'border-[#C1876B] bg-[#C1876B] text-white'
                          : 'border-[#E8DCC4] hover:border-[#C1876B]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-3">
              <button
                onClick={clearFilters}
                className="flex-1 px-6 py-3 border border-[#E8DCC4] hover:border-[#C1876B] transition-colors text-sm uppercase tracking-wider"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="relative flex-1 px-6 py-3 bg-[#C1876B] text-white hover:bg-[#C1876B]/90 transition-colors overflow-hidden group"
              >
                <Texture type="leather" opacity={0.08} className="group-hover:opacity-0" />
                <span className="relative z-10 text-sm uppercase tracking-wider">Apply</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
