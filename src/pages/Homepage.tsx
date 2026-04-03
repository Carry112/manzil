import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';
import { ArrowRight, Crown, RefreshCw, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { CardStack, type CardStackItem } from '../components/ui/card-stack';

type FeaturedStackItem = CardStackItem & {
  price: number;
  href: string;
  tag?: string;
};

const featuredFallbackImages = [
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1400&q=80',
];

export function Homepage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [stackCardWidth, setStackCardWidth] = useState(560);

  useEffect(() => {
    const loadProducts = async () => {
      const { data: featured } = await api.products.list({ featured: true, limit: 6 });
      const { data: newItems  } = await api.products.list({ new_arrival: true, limit: 8 });
      if (featured) setFeaturedProducts(featured);
      if (newItems)  setNewArrivals(newItems);
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const updateCardSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setStackCardWidth(Math.max(290, width - 44));
        return;
      }

      if (width < 1024) {
        setStackCardWidth(Math.min(520, width - 130));
        return;
      }

      setStackCardWidth(560);
    };

    updateCardSize();
    window.addEventListener('resize', updateCardSize);
    return () => window.removeEventListener('resize', updateCardSize);
  }, []);

  const heroImagePool = [...featuredProducts, ...newArrivals]
    .flatMap((product) => (Array.isArray(product.images) ? product.images.slice(0, 1) : []))
    .filter(Boolean);

  const heroImages = [
    heroImagePool[0] || 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?auto=format&fit=crop&w=1200&q=80',
    heroImagePool[1] || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80',
    heroImagePool[2] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  ];

  const featuredStackItems = useMemo<FeaturedStackItem[]>(
    () =>
      featuredProducts.slice(0, 7).map((product, index) => ({
        id: product.id,
        title: product.name,
        description: product.description,
        imageSrc:
          product.images?.[0] ||
          featuredFallbackImages[index % featuredFallbackImages.length],
        href: `/product/${product.slug}`,
        price: product.price,
        tag: product.new_arrival ? 'New Drop' : product.featured ? 'Featured' : undefined,
      })),
    [featuredProducts]
  );

  const stackCardHeight = Math.round(stackCardWidth * 0.64);

  return (
    <div className="relative overflow-hidden bg-[#FFF8F0]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#FFB3D1]/20 blur-3xl" />
        <div className="absolute right-10 top-20 h-56 w-56 rounded-full bg-[#A8C4FF]/30 blur-3xl" />
      </div>

      <section className="relative mx-auto grid min-h-[86vh] max-w-[1920px] gap-12 px-6 pb-14 pt-16 md:px-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-20">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#FFB3D1]/50 bg-white/80 px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-[#3D2B3D]">
            <Sparkles className="h-3.5 w-3.5 text-[#FFB3D1]" />
            New Collection
          </p>

          <h1 className="max-w-3xl font-serif text-5xl leading-[1.04] text-[#2B1E2B] md:text-6xl lg:text-7xl">
            The New Standard For
            <span className="block bg-gradient-to-r from-[#FF8FC3] via-[#E490C7] to-[#6FA3FF] bg-clip-text text-transparent">
              Modern Luxury Streetwear
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#6E5F6E] md:text-lg">
            Sharp silhouettes, tactile materials, and curated drops. Built for city movement and styled for statement.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF8FC3] to-[#6FA3FF] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-[#FF8FC3]/25"
            >
              Shop Collection
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-[#2B1E2B]/15 bg-white/80 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#2B1E2B] transition-colors hover:border-[#FF8FC3]/50 hover:text-[#FF8FC3]"
            >
              Brand Manifesto
            </a>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-2 rounded-2xl border border-[#FFB3D1]/20 bg-white/70 p-4 backdrop-blur-sm">
            {[
              { value: '24h', label: 'Dispatch Time' },
              { value: '4.9', label: 'Avg Rating' },
              { value: '100%', label: 'Quality Check' },
            ].map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="font-serif text-2xl text-[#2B1E2B]">{metric.value}</p>
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#8E7E8E]">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 -top-10 hidden rounded-full border border-[#2B1E2B]/20 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#2B1E2B] lg:block">
            Limited Drop
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 overflow-hidden rounded-3xl border border-[#FFB3D1]/25 bg-white p-2 shadow-md">
              <img
                src={heroImages[0]}
                alt="Featured fashion drop"
                className="h-[340px] w-full rounded-[20px] object-cover md:h-[430px]"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#A8C4FF]/35 bg-white p-2 shadow-sm">
              <img
                src={heroImages[1]}
                alt="Streetwear detail"
                className="h-40 w-full rounded-xl object-cover md:h-52"
              />
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#FFB3D1]/30 bg-white p-2 shadow-sm">
              <img
                src={heroImages[2]}
                alt="Premium lookbook"
                className="h-40 w-full rounded-xl object-cover md:h-52"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-24">
        <div className="mx-auto max-w-[1920px] px-6 md:px-12">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#7A6A7A]">Focus Edit</p>
              <h2 className="mt-2 font-serif text-4xl text-[#2B1E2B] md:text-5xl">Featured Pieces</h2>
            </div>
            <a
              href="/featured"
              className="inline-flex items-center gap-2 border-b border-[#2B1E2B]/20 pb-1 text-sm uppercase tracking-[0.15em] text-[#2B1E2B] transition-colors hover:text-[#FF8FC3]"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {featuredStackItems.length ? (
            <div className="mx-auto max-w-6xl">
              <CardStack<FeaturedStackItem>
                items={featuredStackItems}
                initialIndex={0}
                maxVisible={5}
                overlap={0.56}
                spreadDeg={38}
                depthPx={120}
                tiltXDeg={8}
                cardWidth={stackCardWidth}
                cardHeight={stackCardHeight}
                autoAdvance
                intervalMs={2600}
                pauseOnHover
                showDots
                renderCard={(item, state) => (
                  <div className="relative h-full w-full overflow-hidden rounded-2xl">
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className={`h-full w-full object-cover transition-transform duration-500 ${
                        state.active ? 'scale-100' : 'scale-105'
                      }`}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#2B1E2B]/85 via-[#2B1E2B]/25 to-transparent" />

                    {item.tag && (
                      <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                        {item.tag}
                      </div>
                    )}

                    <div className="absolute inset-0 border border-white/25" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                      <p className="font-serif text-2xl leading-tight text-white md:text-3xl">
                        {item.title}
                      </p>
                      <p className="mt-2 line-clamp-2 max-w-lg text-sm text-white/80 md:text-base">
                        {item.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="font-mono text-sm text-[#FFD6EA] md:text-base">
                          ${item.price.toFixed(2)}
                        </span>
                        <a
                          href={item.href}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center rounded-full border border-white/45 bg-white/15 px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:border-[#FF8FC3]/75 hover:text-[#FF8FC3]"
                        >
                          View Product
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              />
            </div>
          ) : (
            <p className="rounded-2xl border border-[#FFB3D1]/20 bg-white/70 p-6 text-[#7A6A7A]">
              Featured items are on their way.
            </p>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#2B1E2B] py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,143,195,0.28),transparent_40%),radial-gradient(circle_at_82%_72%,rgba(111,163,255,0.22),transparent_45%)]" />
        <div className="relative mx-auto grid max-w-[1920px] gap-10 px-6 md:px-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#FFD4E8]">Our Design Principle</p>
            <h2 className="max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
              Crafted for movement,
              <span className="block text-[#BFD5FF]">built for presence.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[#E9DEE9]">
              Every release combines premium construction with practical comfort, so your fit performs as strongly as it looks.
            </p>
          </div>

          <div className="grid gap-3 rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <Crown className="mt-0.5 h-5 w-5 text-[#FFD4E8]" />
              <p className="text-sm text-[#F8F1F8]">Limited edition capsules curated by season.</p>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-[#FFD4E8]" />
              <p className="text-sm text-[#F8F1F8]">Every product is quality-checked before dispatch.</p>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCw className="mt-0.5 h-5 w-5 text-[#BFD5FF]" />
              <p className="text-sm text-[#F8F1F8]">Easy exchange support with responsive assistance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-gradient-to-b from-[#FFF8F0] to-[#FDECF6] py-20 md:py-24">
        <div className="mx-auto max-w-[1920px] px-6 md:px-12">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#7A6A7A]">Live Now</p>
              <h2 className="mt-2 font-serif text-4xl text-[#2B1E2B] md:text-5xl">New Arrivals</h2>
            </div>
            <a
              href="/new"
              className="inline-flex items-center gap-2 border-b border-[#2B1E2B]/20 pb-1 text-sm uppercase tracking-[0.15em] text-[#2B1E2B] transition-colors hover:text-[#6FA3FF]"
            >
              Explore Drop
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {newArrivals.length ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4">
              {newArrivals.map((product, index) => (
                <div
                  key={product.id}
                  className="transition-transform duration-500 hover:-translate-y-1"
                >
                  <ProductCard product={product} rotation={index % 2 === 0 ? 0.7 : -0.7} />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-[#A8C4FF]/20 bg-white/70 p-6 text-[#7A6A7A]">
              New arrivals are being updated. Check back shortly.
            </p>
          )}
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-[1920px] gap-4 px-6 md:grid-cols-3 md:px-12">
          {[
            {
              icon: <Truck className="h-5 w-5" />,
              title: 'Fast Dispatch',
              description: 'Orders ship within 24 hours on working days.',
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: 'Verified Quality',
              description: 'Every piece passes multi-point quality checks.',
            },
            {
              icon: <RefreshCw className="h-5 w-5" />,
              title: 'Smooth Exchange',
              description: 'Quick support for size and fit exchanges.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-[#2B1E2B]/10 bg-white/75 p-6 shadow-sm backdrop-blur-sm transition-colors hover:border-[#FF8FC3]/35"
            >
              <div className="mb-3 inline-flex rounded-full bg-gradient-to-r from-[#FF8FC3]/20 to-[#6FA3FF]/20 p-2 text-[#2B1E2B]">
                {feature.icon}
              </div>
              <h3 className="font-serif text-xl text-[#2B1E2B]">{feature.title}</h3>
              <p className="mt-2 text-sm text-[#7A6A7A]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
