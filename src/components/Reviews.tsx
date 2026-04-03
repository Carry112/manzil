import { TestimonialsSection, type Testimonial } from './ui/testimonials-1';

export function Reviews() {
  const reviews: Testimonial[] = [
    {
      name: 'Areeba Khan',
      role: 'Streetwear Stylist',
      rating: 5,
      text: 'I style daily shoots, and Chelouve pairs hold shape, comfort, and finish all day long. The silhouettes are premium and camera-ready.',
      avatar:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Usman Tariq',
      role: 'Creative Director',
      rating: 4,
      text: 'Build quality is excellent and the cushioning is legit. We used them across two campaign days and comfort stayed consistent.',
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Maha Ali',
      role: 'Product Designer',
      rating: 5,
      text: 'Details are clean, materials feel luxe, and fit is true. These quickly became my go-to pair for office and weekend looks.',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Hamza Rauf',
      role: 'E-commerce Founder',
      rating: 5,
      text: 'Delivery was quick and packaging felt premium. The product looked exactly like the visuals, which is rare and appreciated.',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  return (
    <div className="mt-16 border-t border-[#F0D6E8] py-8">
      <TestimonialsSection
        badgeText="Verified Buyers"
        title="Loved By Sneaker Enthusiasts"
        subtitle="Real feedback from customers who wear Chelouve in daily city life, events, and studio work."
        testimonials={reviews}
      />
    </div>
  );
}
