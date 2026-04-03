import { CardStack, type CardStackItem } from '@/components/ui/card-stack';

const items: CardStackItem[] = [
  {
    id: 1,
    title: 'Luxury Performance',
    description: 'Experience precision-crafted comfort and premium movement.',
    imageSrc:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1400&q=80',
    href: '/shop',
  },
  {
    id: 2,
    title: 'Elegant Design',
    description: 'Where contemporary street style meets timeless finish.',
    imageSrc:
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=80',
    href: '/featured',
  },
  {
    id: 3,
    title: 'Power And Speed',
    description: 'Built for city pace with day-long premium comfort.',
    imageSrc:
      'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1400&q=80',
    href: '/new',
  },
  {
    id: 4,
    title: 'Timeless Craftsmanship',
    description: 'Intentional details, quality materials, iconic silhouette.',
    imageSrc:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1400&q=80',
    href: '/shop',
  },
  {
    id: 5,
    title: 'Future Of Mobility',
    description: 'Designed to move with you from studio to street.',
    imageSrc:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1400&q=80',
    href: '/featured',
  },
];

export default function CardStackDemoPage() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-5xl p-8">
        <CardStack
          items={items}
          initialIndex={0}
          autoAdvance
          intervalMs={2200}
          pauseOnHover
          showDots
        />
      </div>
    </div>
  );
}
