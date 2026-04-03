import { useEffect, useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import type { Product, Category } from '../types';

export function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc'>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sizes, setSizes] = useState<string[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
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
    setSearchQuery('');
    setSortBy('featured');
    setPriceRange([0, 500]);
    setSizes([]);
  };

  const filteredProducts = useMemo(() => {
    const searched = products.filter((product) => {
      const searchTarget = `${product.name} ${product.description} ${product.slug}`.toLowerCase();
      return searchTarget.includes(searchQuery.toLowerCase());
    });

    const priced = searched.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    const sized = sizes.length
      ? priced.filter((product) => (product.sizes || []).some((size) => sizes.includes(size)))
      : priced;

    const sorted = [...sized];

    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => Number(b.new_arrival) - Number(a.new_arrival));
        break;
      default:
        sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return sorted;
  }, [products, searchQuery, priceRange, sizes, sortBy]);

  const featuredProducts = filteredProducts.filter((product) => product.featured).slice(0, 3);
  const featuredIds = new Set(featuredProducts.map((product) => product.id));
  const regularProducts = filteredProducts.filter((product) => !featuredIds.has(product.id));

  const categoryFilters = categories.length
    ? categories
    : [];

  const activeFilterCount =
    Number(Boolean(selectedCategory)) +
    Number(Boolean(searchQuery)) +
    Number(Boolean(sizes.length)) +
    Number(priceRange[0] !== 0 || priceRange[1] !== 500);

  return (
    <div className="min-h-screen bg-[#FFF8F0] pt-24">
      <div className="relative overflow-hidden border-b border-[#2B1E2B]/10 bg-gradient-to-r from-[#FFE8F5] via-[#FFF8F0] to-[#EAF1FF] py-14 md:py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 right-0 h-72 w-72 rounded-full bg-gradient-to-bl from-[#FFB3D1]/25 to-transparent blur-3xl" />
          <div className="absolute -bottom-10 left-0 h-72 w-72 rounded-full bg-gradient-to-tr from-[#C8DCFF]/25 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#FFB3D1]/40 bg-white/75 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#3D2B3D]">
                <Sparkles className="h-3.5 w-3.5 text-[#FF8FC3]" />
                Shoe Brand Showcase
              </p>
              <h1 className="font-serif text-5xl text-[#2B1E2B] md:text-6xl">The Product Floor</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#7A6A7A] md:text-base">
                Curated silhouettes for motion and statement. Explore our premium shoe collection with editorial product composition.
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-[#9B899B]">
                {filteredProducts.length} Results
              </p>
            </div>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-[#2B1E2B]/15 bg-white/70 px-6 py-3 text-[#3D2B3D] transition-all hover:border-[#FF8FC3]/45 hover:text-[#FF8FC3]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wider">Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-[#FF8FC3] to-[#6FA3FF] px-1.5 text-[10px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {categoryFilters.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-all ${
                  selectedCategory === null
                    ? 'border-[#FF8FC3] bg-[#FF8FC3] text-white'
                    : 'border-[#2B1E2B]/15 bg-white/65 text-[#3D2B3D] hover:border-[#FF8FC3]/45'
                }`}
              >
                All
              </button>

              {categoryFilters.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-all ${
                    selectedCategory === category.id
                      ? 'border-[#FF8FC3] bg-[#FF8FC3] text-white'
                      : 'border-[#2B1E2B]/15 bg-white/65 text-[#3D2B3D] hover:border-[#FF8FC3]/45'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-6 md:px-12 py-10 md:py-12">
        <div className="grid gap-3 rounded-2xl border border-[#2B1E2B]/10 bg-white/65 p-3 backdrop-blur-sm md:grid-cols-[1fr_auto_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9D8A9D]" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, style, or keyword"
              className="w-full rounded-xl border border-[#2B1E2B]/12 bg-white/80 py-3 pl-10 pr-4 text-sm text-[#2B1E2B] outline-none transition-colors placeholder:text-[#B19FB1] focus:border-[#FF8FC3]"
            />
          </label>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'newest' | 'price-asc' | 'price-desc')}
            className="rounded-xl border border-[#2B1E2B]/12 bg-white/80 px-3 py-3 text-sm text-[#2B1E2B] outline-none focus:border-[#6FA3FF]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Sort: Price Low to High</option>
            <option value="price-desc">Sort: Price High to Low</option>
          </select>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#2B1E2B]/12 bg-white/80 px-5 py-3 text-sm text-[#2B1E2B] transition-colors hover:border-[#FF8FC3]/45 hover:text-[#FF8FC3]"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-[#2B1E2B]/10 bg-white/70 p-10 text-center">
            <p className="text-lg text-[#6E5F6E]">No products match your current filters.</p>
            <button
              onClick={clearFilters}
              className="mt-4 rounded-full bg-gradient-to-r from-[#FF8FC3] to-[#6FA3FF] px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-10 space-y-12">
            {featuredProducts.length > 0 && (
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="font-serif text-3xl text-[#2B1E2B]">Featured Showcase</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#FF8FC3]/50 to-transparent" />
                </div>

                <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
                  {featuredProducts.map((product, index) => (
                    <div key={product.id} className={index === 0 ? 'md:col-span-2' : ''}>
                      <ProductCard product={product} featured={index === 0} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {regularProducts.length > 0 && (
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <h2 className="font-serif text-3xl text-[#2B1E2B]">All Products</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-[#6FA3FF]/50 to-transparent" />
                </div>

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {regularProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <div
        className={`fixed inset-0 bg-[#3D2B3D]/30 backdrop-blur-sm z-50 transition-opacity duration-500 ${
          isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterOpen(false)}
      />

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
