import { useEffect, useMemo, useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { FAQ } from '../components/ui/faq-tabs';
import { api } from '../lib/api';
import type { FAQCategory, FAQItem } from '../types';

export function FAQPage() {
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFaqData();
  }, []);

  const loadFaqData = async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: loadError } = await api.faqs.listPublic();
    if (loadError) {
      setError(loadError.message || 'Unable to load FAQs right now.');
      setIsLoading(false);
      return;
    }

    setCategories((data?.categories as FAQCategory[]) || []);
    setFaqItems((data?.items as FAQItem[]) || []);
    setIsLoading(false);
  };

  const categoryMap = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      acc[category.slug] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const faqData = useMemo(() => {
    const grouped: Record<string, { question: string; answer: string }[]> = {};

    categories.forEach((category) => {
      grouped[category.slug] = [];
    });

    faqItems.forEach((faq) => {
      const key = faq.category_slug || categories.find((c) => c.id === faq.category_id)?.slug;
      if (!key) return;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push({ question: faq.question, answer: faq.answer });
    });

    return grouped;
  }, [categories, faqItems]);

  const hasContent = Object.values(faqData).some((list) => list.length > 0);

  return (
    <div className="min-h-screen pb-16 pt-24">
      <section className="relative overflow-hidden py-16 section-gradient">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-gradient-to-tr from-[#87CEEB]/30 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1920px] px-6 md:px-12">
          <h1 className="mb-4 font-serif text-5xl text-[#2D3142] md:text-6xl">Frequently Asked Questions</h1>
          <p className="max-w-2xl text-xl text-[#6B7280]">
            Answers managed by our admin team to keep you updated with the latest information.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:px-12">
        {isLoading && (
          <div className="rounded-2xl border border-[#FFB3D1]/25 bg-white/80 px-6 py-12 text-center text-[#7A6A7A]">
            Loading FAQs...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-red-600">
            {error}
          </div>
        )}

        {!isLoading && !error && !hasContent && (
          <div className="rounded-2xl border border-[#FFB3D1]/25 bg-white/80 px-6 py-12 text-center">
            <MessageCircleQuestion className="mx-auto h-10 w-10 text-[#FFB3D1]" />
            <h2 className="mt-4 font-serif text-2xl text-[#3D2B3D]">FAQs Coming Soon</h2>
            <p className="mt-2 text-[#7A6A7A]">Our team has not published FAQs yet. Please check back shortly.</p>
          </div>
        )}

        {!isLoading && !error && hasContent && (
          <FAQ
            title="Frequently Asked Questions"
            subtitle="Managed by our support team"
            categories={categoryMap}
            faqData={faqData}
            className="rounded-3xl border border-[#FFB3D1]/20 bg-white/80"
          />
        )}
      </section>

      <section className="bg-gradient-to-r from-[#FFE4F5]/30 to-[#D4F0F8]/30 py-16">
        <div className="mx-auto max-w-[1920px] px-6 text-center md:px-12">
          <h2 className="mb-4 font-serif text-3xl text-[#2D3142]">Still have questions?</h2>
          <p className="mb-8 text-[#6B7280]">Contact our customer support team</p>
          <a
            href="/contact"
            className="inline-block rounded-lg bg-gradient-to-r from-[#FF69B4] to-[#FF69B4] px-8 py-3 font-medium text-white transition-all hover:shadow-lg"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
