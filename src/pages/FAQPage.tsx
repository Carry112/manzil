import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    category: 'Shopping & Orders',
    questions: [
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.',
      },
      {
        q: 'What is your return policy?',
        a: 'We offer 30-day free returns on all unworn shoes with original packaging. Once returned, refunds are processed within 5-7 business days.',
      },
      {
        q: 'How can I track my order?',
        a: 'You will receive a tracking number via email as soon as your order ships. You can use this to monitor delivery progress.',
      },
    ],
  },
  {
    category: 'Product Care',
    questions: [
      {
        q: 'How do I care for my Manzil shoes?',
        a: 'We recommend using a soft brush for cleaning, applying leather conditioner monthly, and storing in a cool, dry place. See our care guides for specific materials.',
      },
      {
        q: 'Can you resole my shoes?',
        a: 'Absolutely! Our lifetime support includes professional resoles and repairs. Simply contact us with your shoe information.',
      },
      {
        q: 'How long do Manzil shoes last?',
        a: 'With proper care, our shoes can last 10+ years. Many customers have shoes that have been worn for decades.',
      },
    ],
  },
  {
    category: 'Sizing & Fit',
    questions: [
      {
        q: 'How do I find the right size?',
        a: 'We provide detailed size guides for each style. We recommend measuring your feet in the afternoon when they are slightly swollen.',
      },
      {
        q: 'Do you offer half sizes?',
        a: 'Most styles come in full and half sizes. Check individual product pages for sizing availability.',
      },
      {
        q: 'What if the shoes don\'t fit?',
        a: 'All shoes come with our 30-day perfect fit guarantee. If they don\'t fit, simply return them for free exchange or refund.',
      },
    ],
  },
  {
    category: 'Sustainability',
    questions: [
      {
        q: 'Are Manzil shoes environmentally friendly?',
        a: 'We use sustainable materials and ethical manufacturing practices. We offset our carbon footprint through verified environmental projects.',
      },
      {
        q: 'Do you use leather?',
        a: 'We use premium, ethically sourced leather along with innovative plant-based alternatives. All our leather comes from certified sources.',
      },
    ],
  },
];

export function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="relative py-16 section-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#87CEEB]/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12">
          <h1 className="font-serif text-5xl md:text-6xl text-[#2D3142] mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-[#6B7280] max-w-2xl">
            Find answers to common questions about our products, shipping, and services
          </p>
        </div>
      </section>

      <section className="py-20 max-w-4xl mx-auto px-6 md:px-12">
        <div className="space-y-12">
          {faqs.map((faqGroup, groupIdx) => (
            <div key={groupIdx}>
              <h2 className="font-serif text-3xl text-[#2D3142] mb-8 pb-4 border-b-2 border-[#FFB6D9]">
                {faqGroup.category}
              </h2>

              <div className="space-y-4">
                {faqGroup.questions.map((item, idx) => {
                  const id = `${groupIdx}-${idx}`;
                  const isExpanded = expandedId === id;

                  return (
                    <button
                      key={id}
                      onClick={() => setExpandedId(isExpanded ? null : id)}
                      className="w-full card-soft p-6 text-left transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-bold text-[#2D3142] text-lg flex-1">{item.q}</h3>
                        <ChevronDown
                          className={`w-6 h-6 text-[#FF69B4] flex-shrink-0 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>

                      {isExpanded && (
                        <p className="text-[#6B7280] leading-relaxed mt-4 animate-in fade-in slide-in-from-top-2">
                          {item.a}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#FFE4F5]/30 to-[#D4F0F8]/30">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-3xl text-[#2D3142] mb-4">Still have questions?</h2>
          <p className="text-[#6B7280] mb-8">Contact our customer support team</p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#FF69B4] to-[#FF69B4] text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
