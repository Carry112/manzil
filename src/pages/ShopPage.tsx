import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { api } from '../lib/api';
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
    const { data } = await api.categories.list();
    if (data) setCategories(data);
  };

  const loadProducts = async () => {
    const params: Record<string, string> = {};
    if (selectedCategory) params.category_id = selectedCategory;
    const { data } = await api.products.list(params);
    if (data) setProducts(data);
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, 500]);
    setSizes([]);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-24">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#FFCCE0]/40 via-[#FFF8F0] to-[#C8DCFF]/30 py-12 mb-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#FFB3D1]/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-[#C8DCFF]/20 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#FFB3D1] mb-2">Discover</p>
              <h1 className="font-serif text-5xl md:text-6xl text-[#3D2B3D]">Shop</h1>
              <p className="text-[#B0A0B0] mt-2">{products.length} products</p>
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-6 py-3 border border-[#FFB3D1]/40 rounded-full hover:border-[#FFB3D1] hover:bg-[#FFCCE0]/30 transition-all text-[#3D2B3D]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#FFB3D1]" />
              <span className="text-sm uppercase tracking-wider">Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-auto">
          {products.map((product, index) => {
            const isFeatured = index % 7 === 0;
            return (
              <div key={product.id} className={isFeatured ? 'md:col-span-2 md:row-span-2' : ''}>
                <ProductCard product={product} featured={isFeatured} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter overlay */}
      <div
        className={`fixed inset-0 bg-[#3D2B3D]/30 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterOpen(false)}
      />

      {/* Filter panel */}
      <div
        className={`fixed inset-y-0 left-0 w-full md:w-[400px] bg-[#FFF8F0] z-50 transform transition-transform duration-500 ease-out ${
          isFilterOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="relative h-full overflow-y-auto">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#FFCCE0]/40 to-transparent rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-[#3D2B3D]">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-[#FFCCE0] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#FFB3D1]" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Category filter */}
              <div>
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#3D2B3D] mb-4 font-semibold">Category</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="w-4 h-4 accent-[#FFB3D1] border-[#FFB3D1]/40"
                    />
                    <span className="text-[#3D2B3D] group-hover:text-[#FFB3D1] transition-colors text-sm">
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
                        className="w-4 h-4 accent-[#FFB3D1] border-[#FFB3D1]/40"
                      />
                      <span className="text-[#3D2B3D] group-hover:text-[#FFB3D1] transition-colors text-sm">
                        {category.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="pt-8 border-t border-[#FFB3D1]/20">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#3D2B3D] mb-4 font-semibold">
                  Price Range
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#FFB3D1]"
                    style={{ background: `linear-gradient(to right, #FFB3D1 0%, #FFB3D1 ${(priceRange[1]/500)*100}%, #FFCCE0 ${(priceRange[1]/500)*100}%, #FFCCE0 100%)` }}
                  />
                  <div className="flex justify-between mt-3 text-sm text-[#B0A0B0] font-mono">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Size filter */}
              <div className="pt-8 border-t border-[#FFB3D1]/20">
                <h3 className="text-xs uppercase tracking-[0.2em] text-[#3D2B3D] mb-4 font-semibold">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['6', '7', '8', '9', '10', '11', '12', '13'].map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSizes((prev) =>
                          prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                        );
                      }}
                      className={`px-4 py-3 border rounded-xl transition-all text-sm font-medium ${
                        sizes.includes(size)
                          ? 'border-[#FFB3D1] bg-gradient-to-r from-[#FFB3D1] to-[#FFCCE0] text-white shadow-md'
                          : 'border-[#FFB3D1]/30 text-[#3D2B3D] hover:border-[#FFB3D1] hover:bg-[#FFCCE0]/30'
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
                className="flex-1 px-6 py-3 border border-[#FFB3D1]/40 rounded-xl hover:border-[#FFB3D1] transition-colors text-sm uppercase tracking-wider text-[#3D2B3D]"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white rounded-xl hover:shadow-lg hover:shadow-[#FFB3D1]/30 transition-all text-sm uppercase tracking-wider font-medium"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
