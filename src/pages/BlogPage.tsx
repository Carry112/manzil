import { Calendar, ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'The Art of Handcrafted Footwear',
    excerpt: 'Discover the centuries-old techniques that make each Manzil shoe a masterpiece.',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-03-15',
    category: 'Craftsmanship',
    readTime: 5,
  },
  {
    id: 2,
    title: 'Sustainable Fashion: Our Eco-Friendly Journey',
    excerpt: 'How we are reducing our environmental footprint while maintaining premium quality.',
    image: 'https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-03-12',
    category: 'Sustainability',
    readTime: 6,
  },
  {
    id: 3,
    title: 'Care Guide: Keeping Your Manzil Shoes Like New',
    excerpt: 'Expert tips on maintaining your shoes for decades of wear and style.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-03-10',
    category: 'Care',
    readTime: 4,
  },
  {
    id: 4,
    title: 'The History of Iconic Shoe Styles',
    excerpt: 'Explore how classic shoe designs have shaped fashion and culture through time.',
    image: 'https://images.pexels.com/photos/2562878/pexels-photo-2562878.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '2024-03-08',
    category: 'Culture',
    readTime: 7,
  },
];

export function BlogPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <section className="relative py-16 section-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FF69B4]/30 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12">
          <h1 className="font-serif text-5xl md:text-6xl text-[#2D3142] mb-4">Stories & Insights</h1>
          <p className="text-xl text-[#6B7280] max-w-2xl">
            Explore the craft, culture, and craftsmanship behind every Manzil pair
          </p>
        </div>
      </section>

      <section className="py-20 max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {articles.slice(0, 2).map((article) => (
            <div
              key={article.id}
              className="group cursor-pointer transform hover:scale-102 transition-all duration-500"
            >
              <div className="overflow-hidden rounded-2xl mb-6">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center gap-4 text-sm mb-4 text-[#6B7280]">
                <span className="px-3 py-1 bg-[#FFE4F5] text-[#FF69B4] rounded-full font-medium">
                  {article.category}
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.date).toLocaleDateString()}
                </div>
              </div>
              <h2 className="font-serif text-3xl text-[#2D3142] mb-3 group-hover:text-[#FF69B4] transition-colors">
                {article.title}
              </h2>
              <p className="text-[#6B7280] mb-4 leading-relaxed">{article.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#6B7280]">{article.readTime} min read</span>
                <ArrowRight className="w-5 h-5 text-[#FF69B4] group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.slice(2).map((article) => (
            <div
              key={article.id}
              className="group cursor-pointer card-soft p-6 hover:scale-105 transition-all"
            >
              <div className="overflow-hidden rounded-xl mb-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-video object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="flex items-center gap-3 text-xs mb-3 text-[#6B7280]">
                <span className="px-2 py-1 bg-[#D4F0F8] text-[#87CEEB] rounded-full font-medium">
                  {article.category}
                </span>
                <Calendar className="w-3 h-3" />
                <span>{new Date(article.date).toLocaleDateString()}</span>
              </div>
              <h3 className="font-serif text-xl text-[#2D3142] mb-2 group-hover:text-[#FF69B4] transition-colors">
                {article.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{article.excerpt}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#FF69B4]/10 to-[#87CEEB]/10">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-3xl text-[#2D3142] mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Get exclusive stories, design tips, and early access to new collections
          </p>
          <form className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white border border-[#FFB6D9] rounded-lg focus:outline-none focus:border-[#FF69B4] transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-[#FF69B4] to-[#FF69B4] text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
