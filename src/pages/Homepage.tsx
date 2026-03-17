import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Texture } from '../components/Texture';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

export function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const { data: featured } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(6);

      const { data: newItems } = await supabase
        .from('products')
        .select('*')
        .eq('new_arrival', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (featured) setFeaturedProducts(featured);
      if (newItems) setNewArrivals(newItems);
    };

    loadProducts();
  }, []);

  return (
    <div className="bg-[#FAF9F6]">
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-5">
          <div className="relative col-span-1 md:col-span-3 bg-[#F5F1E8]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  'url(https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1920)',
                transform: 'translateY(var(--scroll-y, 0px))',
              }}
            />
          </div>

          <div className="relative col-span-1 md:col-span-2 flex items-center justify-center p-8 md:p-12">
            <Texture type="canvas" opacity={0.06} />
            <div className="relative z-10 text-center md:text-left max-w-md">
              <h1 className="font-serif text-5xl md:text-7xl text-[#2C2C2C] leading-tight mb-6">
                Every Step
                <br />
                Tells a Story
              </h1>
              <p className="text-[#A8A8A8] leading-relaxed mb-8">
                Crafted with intention, designed for your journey. Discover footwear that moves with
                purpose.
              </p>
              <a
                href="/shop"
                className="relative inline-block px-10 py-4 bg-[#C1876B] text-white hover:bg-[#C1876B]/90 transition-colors overflow-hidden group"
              >
                <Texture type="leather" opacity={0.08} className="group-hover:opacity-0" />
                <span className="relative z-10 text-sm uppercase tracking-wider">
                  Explore Collection
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 overflow-hidden">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C2C2C]">Featured</h2>
            <a
              href="/featured"
              className="text-sm uppercase tracking-wider text-[#A8A8A8] hover:text-[#C1876B] transition-colors"
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

      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-[#2C2C2C]/40" />
        <Texture type="leather" opacity={0.08} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
          <h2 className="font-serif text-4xl md:text-6xl leading-tight mb-6">
            Crafted for the Journey
          </h2>
          <p className="text-lg leading-relaxed opacity-90">
            Each pair is meticulously handcrafted using premium materials and time-honored
            techniques. We believe in creating footwear that not only looks beautiful but tells your
            unique story with every step.
          </p>
        </div>
      </section>

      <section className="relative py-24">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-serif text-4xl md:text-5xl text-[#2C2C2C]">New Arrivals</h2>
            <a
              href="/new"
              className="text-sm uppercase tracking-wider text-[#A8A8A8] hover:text-[#C1876B] transition-colors"
            >
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {newArrivals.map((product, index) => (
              <div key={product.id} className="transform hover:scale-105 transition-transform">
                <ProductCard
                  product={product}
                  rotation={index % 2 === 0 ? 2 : -2}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
