import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

export function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const { data: featured } = await api.products.list({ featured: true, limit: 6 });
      const { data: newItems  } = await api.products.list({ new_arrival: true, limit: 8 });
      if (featured) setFeaturedProducts(featured);
      if (newItems)  setNewArrivals(newItems);
    };

    loadProducts();
  }, []);

  return (
    <div className="bg-[#FFF8F0]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F0] via-[#FFF8F0]/70 to-[#FFF8F0]/10" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#FFB3D1]/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-[#C8DCFF]/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 w-full">
          <div className="max-w-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-[#FFB3D1] font-medium mb-4">
              New Collection 2024
            </p>
            <h1 className="font-serif text-6xl md:text-8xl text-[#3D2B3D] leading-tight mb-6">
              Every Step
              <br />
              <span className="bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] bg-clip-text text-transparent">
                Tells a Story
              </span>
            </h1>
            <p className="text-[#7A6A7A] leading-relaxed mb-10 text-lg">
              Crafted with intention, designed for your journey. Discover footwear that moves with purpose.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="/shop"
                className="inline-block px-10 py-4 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white font-medium hover:shadow-xl hover:shadow-[#FFB3D1]/30 transition-all duration-300 rounded-full text-sm uppercase tracking-wider"
              >
                Explore Collection
              </a>
              <a
                href="/about"
                className="inline-block px-10 py-4 border-2 border-[#FFB3D1]/50 text-[#3D2B3D] hover:border-[#FFB3D1] hover:bg-[#FFCCE0]/30 transition-all duration-300 rounded-full text-sm uppercase tracking-wider"
              >
                Our Story
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#B0A0B0]">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#FFB3D1] to-transparent animate-float" />
        </div>
      </section>

      {/* Featured Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFB3D1]/0 via-[#FFB3D1]/30 to-[#A8C4FF]/0" />
        </div>
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#A8C4FF] mb-2">Curated Picks</p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#3D2B3D]">Featured</h2>
            </div>
            <a
              href="/featured"
              className="text-sm uppercase tracking-wider text-[#B0A0B0] hover:text-[#FFB3D1] transition-colors border-b border-[#FFB3D1]/40 pb-0.5"
            >
              View All
            </a>
          </div>

          <div className="relative -mx-6 md:-mx-12">
            <div className="overflow-x-auto pb-8 scrollbar-hide">
              <div className="flex gap-6 px-6 md:px-12" style={{ scrollSnapType: 'x mandatory' }}>
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex-none w-[280px] md:w-[360px]"
                    style={{
                      scrollSnapAlign: 'start',
                      height: index % 3 === 0 ? '520px' : index % 2 === 0 ? '480px' : '440px',
                    }}
                  >
                    <div className="h-full">
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Statement Section */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3D2B3D]/70 via-[#3D2B3D]/50 to-[#FFB3D1]/30" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <p className="text-xs uppercase tracking-[0.3em] text-[#FFCCE0] mb-4">Our Promise</p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
            Crafted for the Journey
          </h2>
          <p className="text-lg leading-relaxed opacity-90 text-[#FFF8F0]">
            Each pair is meticulously handcrafted using premium materials and time-honored techniques.
            We believe in creating footwear that not only looks beautiful but tells your unique story with every step.
          </p>
          <a
            href="/about"
            className="inline-block mt-8 px-10 py-4 border-2 border-[#FFB3D1]/70 text-white hover:bg-[#FFB3D1]/20 transition-all duration-300 rounded-full text-sm uppercase tracking-wider"
          >
            Discover More
          </a>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="relative py-24 bg-gradient-to-b from-[#FFF8F0] to-[#FFCCE0]/20">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#FFB3D1] mb-2">Just Dropped</p>
              <h2 className="font-serif text-4xl md:text-5xl text-[#3D2B3D]">New Arrivals</h2>
            </div>
            <a
              href="/new"
              className="text-sm uppercase tracking-wider text-[#B0A0B0] hover:text-[#A8C4FF] transition-colors border-b border-[#A8C4FF]/40 pb-0.5"
            >
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {newArrivals.map((product, index) => (
              <div key={product.id} className="transform hover:scale-[1.02] transition-transform duration-300">
                <ProductCard product={product} rotation={index % 2 === 0 ? 1 : -1} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Row */}
      <section className="py-16 bg-gradient-to-r from-[#FFCCE0]/30 via-[#FFF8F0] to-[#C8DCFF]/30">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: '🎨', title: 'Handcrafted', desc: 'Every pair made with artisan care' },
              { icon: '🌿', title: 'Sustainable', desc: 'Eco-conscious materials & process' },
              { icon: '✨', title: 'Premium', desc: 'Uncompromising quality, always' },
            ].map((feat) => (
              <div key={feat.title} className="p-8 rounded-2xl bg-white/60 border border-[#FFB3D1]/15 hover:border-[#FFB3D1]/40 hover:shadow-lg hover:shadow-[#FFB3D1]/10 transition-all">
                <div className="text-3xl mb-4">{feat.icon}</div>
                <h3 className="font-serif text-xl text-[#3D2B3D] mb-2">{feat.title}</h3>
                <p className="text-[#7A6A7A] text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
