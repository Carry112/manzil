import { useState, useEffect } from 'react';
import { Menu, ShoppingBag, Search, Heart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-white/80 backdrop-blur-xl'
      } border-b border-[#FFB6D9]/20`}
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-[#FFE4F5] rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-[#FF69B4]" />
          </button>

          <a href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <h1 className="font-serif text-2xl md:text-3xl bg-gradient-to-r from-[#FF69B4] to-[#87CEEB] bg-clip-text text-transparent font-bold">
              MANZIL
            </h1>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/shop" className="text-[#2D3142] hover:text-[#FF69B4] transition-colors font-medium text-sm">
              Shop
            </a>
            <a href="/about" className="text-[#2D3142] hover:text-[#FF69B4] transition-colors font-medium text-sm">
              About
            </a>
            <a href="/blog" className="text-[#2D3142] hover:text-[#FF69B4] transition-colors font-medium text-sm">
              Stories
            </a>
            <a href="/faq" className="text-[#2D3142] hover:text-[#FF69B4] transition-colors font-medium text-sm">
              FAQ
            </a>
            <a href="/contact" className="text-[#2D3142] hover:text-[#FF69B4] transition-colors font-medium text-sm">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-[#FFE4F5] rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#FF69B4]" />
            </button>

            <a
              href="/wishlist"
              className="p-2 hover:bg-[#FFE4F5] rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-[#FF69B4]" />
            </a>

            <a
              href="/account"
              className="p-2 hover:bg-[#FFE4F5] rounded-lg transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5 text-[#FF69B4]" />
            </a>

            <button
              onClick={openCart}
              className="relative p-2 hover:bg-[#FFE4F5] rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#FF69B4]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-[#FF69B4] to-[#FF69B4] text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <input
              type="search"
              placeholder="Search products, stories..."
              className="w-full px-4 py-3 bg-[#FFE4F5] border-2 border-[#FFB6D9] rounded-xl focus:outline-none focus:border-[#FF69B4] transition-colors"
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              autoFocus
            />
          </div>
        )}
      </div>
    </header>
  );
}
