import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('manzil_wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const removeFromWishlist = (id: string) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem('manzil_wishlist', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <h1 className="font-serif text-5xl md:text-6xl text-[#2D3142] mb-2">My Wishlist</h1>
        <p className="text-[#6B7280] mb-12">
          {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved
        </p>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Heart className="w-20 h-20 text-[#FFB6D9] mb-6 opacity-50" />
            <h2 className="font-serif text-3xl text-[#2D3142] mb-4">No saved items yet</h2>
            <p className="text-[#6B7280] mb-8 max-w-md">
              Add your favorite shoes to your wishlist to keep track of items you love
            </p>
            <a
              href="/shop"
              className="px-8 py-3 bg-gradient-to-r from-[#FF69B4] to-[#FF69B4] text-white rounded-lg hover:shadow-lg transition-all font-medium"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlist.map((item) => (
              <div key={item.id} className="card-soft overflow-hidden group hover:scale-105 transition-all">
                <div className="relative h-48 bg-[#F5F1E8] overflow-hidden">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  )}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#FFE4F5] transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-[#FF69B4]" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-lg text-[#2D3142] mb-2 line-clamp-2">{item.name}</h3>
                  <p className="font-mono text-xl text-[#FF69B4] font-bold mb-4">${item.price}</p>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF69B4] to-[#FF69B4] text-white rounded-lg hover:shadow-lg transition-all font-medium">
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
