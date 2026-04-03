import { Card, CardHeader, CardFooter, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating?: number;
}

interface TestimonialsSectionProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  testimonials: Testimonial[];
}

export function TestimonialsSection({
  title = 'Trusted by thousands of teams',
  subtitle = 'See what our customers have to say about us.',
  badgeText = 'Testimonials',
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="w-full py-12 md:py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-gradient-to-r from-[#FF8FC3] to-[#6FA3FF] px-3 py-1 text-xs uppercase tracking-[0.14em] text-white">
              {badgeText}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[#2B1E2B] md:text-4xl">
              {title}
            </h2>
            <p className="mx-auto max-w-[900px] text-[#7A6A7A] md:text-lg">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 py-10 lg:grid-cols-2">
          {testimonials.map((t, i) => {
            const stars = Math.max(0, Math.min(5, t.rating ?? 0));

            return (
              <Card
                key={i}
                className="flex h-full flex-col rounded-2xl border border-[#FFB3D1]/25 bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:border-[#FF8FC3]/45"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-4 w-4 ${
                            idx < stars
                              ? 'fill-[#FF8FC3] text-[#FF8FC3]'
                              : 'fill-[#E9D9E9] text-[#E9D9E9]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="leading-relaxed text-[#6E5F6E]">"{t.text}"</p>
                </CardContent>

                <CardFooter className="mt-auto">
                  <div className="flex items-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-xl border border-[#FFB3D1]/30 object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#2B1E2B]">{t.name}</p>
                      <p className="text-xs text-[#8E7E8E]">{t.role}</p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
