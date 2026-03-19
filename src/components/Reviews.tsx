import { Star, ThumbsUp } from 'lucide-react';

export function Reviews() {
  const reviews = [
    {
      id: 1,
      author: 'Sarah M.',
      rating: 5,
      date: 'October 12, 2024',
      title: 'Absolutely perfect!',
      content: 'These shoes are incredibly comfortable right out of the box. The craftsmanship is evident, and I receive compliments every time I wear them. Will definitely buy another pair soon.',
      helpful: 12,
    },
    {
      id: 2,
      author: 'James T.',
      rating: 4,
      date: 'September 28, 2024',
      title: 'Great quality, runs slightly narrow',
      content: 'Beautiful design and premium materials. They were a bit snug at first but stretched perfectly after a few wears. Highly recommend, but maybe size up if you have wide feet.',
      helpful: 8,
    },
    {
      id: 3,
      author: 'Elena R.',
      rating: 5,
      date: 'August 15, 2024',
      title: 'My new favorites',
      content: 'The attention to detail is stunning. I love the sustainable packaging and the comfort is unmatched for long days on my feet.',
      helpful: 24,
    }
  ];

  return (
    <div className="py-12 border-t border-[#E8DCC4] mt-16">
      <div className="mb-12">
        <h2 className="font-serif text-3xl text-[#2C2C2C] mb-6">Customer Reviews</h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center bg-white p-6 md:p-8 rounded-2xl border border-[#E8DCC4] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C1876B]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-[#E8DCC4] pb-6 md:pb-0 md:pr-10 relative z-10 w-full md:w-auto">
            <div className="text-6xl font-serif text-[#2C2C2C] mb-2">4.8</div>
            <div className="flex gap-1 text-[#C1876B] justify-center md:justify-start mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <div className="text-sm text-[#A8A8A8] uppercase tracking-wider">Based on 128 reviews</div>
          </div>
          
          <div className="flex-1 w-full space-y-3 relative z-10">
            {[
              { stars: 5, pct: 85 },
              { stars: 4, pct: 10 },
              { stars: 3, pct: 3 },
              { stars: 2, pct: 1 },
              { stars: 1, pct: 1 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-4 text-sm">
                <span className="w-16 whitespace-nowrap text-[#7A6A7A]">{row.stars} Stars</span>
                <div className="flex-1 h-1.5 bg-[#F5F1E8] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#C1876B] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[#A8A8A8] font-mono">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 md:p-8 rounded-2xl border border-[#E8DCC4] hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-0.5 text-[#C1876B]">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-[#E8DCC4]'}`} 
                      />
                    ))}
                  </div>
                  <span className="font-serif text-[#2C2C2C] font-semibold">{review.title}</span>
                </div>
                <div className="text-xs text-[#A8A8A8] flex items-center gap-2">
                  <span className="font-semibold text-[#2C2C2C] bg-[#F5F1E8] px-2 py-1 rounded-md">{review.author}</span>
                  <span className="text-[#E8DCC4]">•</span>
                  <span>{review.date}</span>
                </div>
              </div>
            </div>
            
            <p className="text-[#7A6A7A] text-sm leading-relaxed mb-6">
              {review.content}
            </p>
            
            <button className="flex items-center gap-1.5 text-xs font-semibold text-[#A8A8A8] hover:text-[#C1876B] transition-colors py-1 px-3 rounded-lg hover:bg-[#F5F1E8] -ml-3">
              <ThumbsUp className="w-3.5 h-3.5" />
              Helpful ({review.helpful})
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button className="px-8 py-3 border-2 border-[#C1876B] text-[#C1876B] rounded-full text-sm uppercase tracking-wider hover:bg-[#C1876B] hover:text-white transition-all font-semibold">
          Load More Reviews
        </button>
      </div>
    </div>
  );
}
