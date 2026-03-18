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
        isScrolled
          ? 'bg-[#FFF8F0]/95 backdrop-blur-xl shadow-sm shadow-[#FFB3D1]/20'
          : 'bg-[#FFF8F0]/80 backdrop-blur-xl'
      } border-b border-[#FFB3D1]/30`}
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-[#FFCCE0] rounded-lg transition-colors"
            aria-label="Menu"
          >
            <Menu className="w-6 h-6 text-[#FFB3D1]" />
          </button>

          <a href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <h1 className="font-serif text-2xl md:text-3xl bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] bg-clip-text text-transparent font-bold tracking-widest">
              MANZIL
            </h1>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/shop" className="text-[#3D2B3D] hover:text-[#FFB3D1] transition-colors font-medium text-sm tracking-wide">
              Shop
            </a>
            <a href="/about" className="text-[#3D2B3D] hover:text-[#FFB3D1] transition-colors font-medium text-sm tracking-wide">
              About
            </a>
            <a href="/blog" className="text-[#3D2B3D] hover:text-[#FFB3D1] transition-colors font-medium text-sm tracking-wide">
              Stories
            </a>
            <a href="/faq" className="text-[#3D2B3D] hover:text-[#FFB3D1] transition-colors font-medium text-sm tracking-wide">
              FAQ
            </a>
            <a href="/contact" className="text-[#3D2B3D] hover:text-[#FFB3D1] transition-colors font-medium text-sm tracking-wide">
              Contact
            </a>
          </nav>

          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-[#FFCCE0] rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-[#FFB3D1]" />
            </button>

            <a
              href="/wishlist"
              className="p-2 hover:bg-[#FFCCE0] rounded-lg transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 text-[#FFB3D1]" />
            </a>

            <a
              href="/account"
              className="p-2 hover:bg-[#C8DCFF] rounded-lg transition-colors"
              aria-label="Account"
            >
              <User className="w-5 h-5 text-[#A8C4FF]" />
            </a>

            <button
              onClick={openCart}
              className="relative p-2 hover:bg-[#C8DCFF] rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#A8C4FF]" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-[#FFB3D1] to-[#A8C4FF] text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="pb-4">
            <input
              type="search"
              placeholder="Search products, stories..."
              className="w-full px-4 py-3 bg-[#FFCCE0]/40 border-2 border-[#FFB3D1]/50 rounded-xl focus:outline-none focus:border-[#FFB3D1] transition-colors placeholder:text-[#B0A0B0]"
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              autoFocus
            />
          </div>
        )}
      </div>
    </header>
  );
}
