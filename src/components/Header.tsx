import { useState, useEffect } from 'react';
import { Menu, ShoppingBag, Search, Heart, User, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ActionSearchBar } from './ui/action-search-bar';

interface HeaderProps {
  onMenuClick: () => void;
}

const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Stories' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function Header({ onMenuClick }: HeaderProps) {
  const { itemCount, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const cartLabel = itemCount > 99 ? '99+' : String(itemCount);

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
          ? 'bg-[#FFF8F0]/97 backdrop-blur-xl shadow-[0_16px_45px_-30px_rgba(43,30,43,0.55)]'
          : 'bg-[#FFF8F0]/86 backdrop-blur-lg'
      } border-b border-[#FFB3D1]/35`}
    >
      <div className="max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="hidden h-[82px] items-center justify-between md:flex">
          <a href="/" className="group inline-flex flex-col">
            <span
              className="text-[30px] leading-none text-[#1F171F] tracking-[0.28em] uppercase"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              CHÉLOUVE
            </span>
            <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em] text-[#8F7D8F]">
              <Sparkles className="h-3 w-3 text-[#FF8FC3]" />
              Urban Atelier
            </span>
          </a>

          <nav className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[13px] uppercase tracking-[0.15em] text-[#3D2B3D] transition-colors hover:text-[#FF8FC3] after:absolute after:-bottom-2 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-[#FF8FC3] after:to-[#6FA3FF] after:transition-transform hover:after:scale-x-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ActionSearchBar className="hidden xl:block" placeholder="Search sneakers, drops..." />

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="rounded-full border border-[#FFB3D1]/35 bg-white/70 p-2.5 text-[#3D2B3D] transition-all hover:border-[#FF8FC3]/70 hover:text-[#FF8FC3] xl:hidden"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            <a
              href="/wishlist"
              className="rounded-full border border-[#FFB3D1]/35 bg-white/70 p-2.5 text-[#3D2B3D] transition-all hover:border-[#FF8FC3]/70 hover:text-[#FF8FC3]"
              aria-label="Wishlist"
            >
              <Heart className="h-4.5 w-4.5" />
            </a>

            <a
              href="/account"
              className="rounded-full border border-[#A8C4FF]/45 bg-white/70 p-2.5 text-[#3D2B3D] transition-all hover:border-[#6FA3FF]/65 hover:text-[#6FA3FF]"
              aria-label="Account"
            >
              <User className="h-4.5 w-4.5" />
            </a>

            <button
              onClick={openCart}
              className="relative inline-flex items-center gap-2 rounded-full border border-[#A8C4FF]/45 bg-gradient-to-r from-[#FFEDF7] to-[#E8F0FF] px-4 py-2 text-[#3D2B3D] transition-all hover:shadow-lg hover:shadow-[#A8C4FF]/25"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              <span className="text-xs uppercase tracking-[0.14em]">Bag</span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[20px] rounded-full bg-gradient-to-r from-[#FF8FC3] to-[#6FA3FF] px-1.5 py-0.5 text-center text-[10px] font-semibold text-white">
                  {cartLabel}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="relative flex h-[74px] items-center justify-between md:hidden">
          <button
            onClick={onMenuClick}
            className="rounded-full border border-[#FFB3D1]/45 bg-white/80 p-2.5 text-[#3D2B3D] transition-colors hover:border-[#FF8FC3]/70 hover:text-[#FF8FC3]"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <a href="/" className="absolute left-1/2 -translate-x-1/2">
            <h1
              className="text-xl text-[#1A1A1A] tracking-[0.24em] uppercase"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              CHÉLOUVE
            </h1>
          </a>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="rounded-full border border-[#FFB3D1]/45 bg-white/80 p-2.5 text-[#3D2B3D] transition-colors hover:border-[#FF8FC3]/70 hover:text-[#FF8FC3]"
              aria-label="Search"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

            <button
              onClick={openCart}
              className="relative rounded-full border border-[#A8C4FF]/55 bg-[#EEF4FF] p-2.5 text-[#3D2B3D] transition-colors hover:border-[#6FA3FF]/70 hover:text-[#6FA3FF]"
              aria-label="Shopping cart"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-gradient-to-r from-[#FF8FC3] to-[#6FA3FF] px-1 text-center text-[10px] font-semibold text-white">
                  {cartLabel}
                </span>
              )}
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t border-[#FFB3D1]/30 pb-4 pt-3">
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8E7E8E]" />
              <input
                id="site-search"
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products, stories..."
                className="w-full rounded-xl border border-[#FFB3D1]/45 bg-white/80 py-3 pl-10 pr-4 text-sm text-[#3D2B3D] outline-none transition-colors placeholder:text-[#AA99AA] focus:border-[#FF8FC3]"
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 160)}
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
