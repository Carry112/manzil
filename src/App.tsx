import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { Cart } from './components/Cart';
import { Footer } from './components/Footer';
import { Homepage } from './pages/Homepage';
import { ShopPage } from './pages/ShopPage';
import { ProductPage } from './pages/ProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { CartProvider } from './context/CartContext';

interface RouteState {
  page: string;
  params?: Record<string, string>;
}

function resolveRoute(path: string): RouteState {
  if (path === '/' || path === '') return { page: 'home' };
  if (path === '/shop' || path === '/new' || path === '/featured') return { page: 'shop' };
  if (path.startsWith('/product/')) {
    const slug = path.split('/product/')[1] || '';
    return { page: 'product', params: { slug } };
  }
  if (path === '/checkout') return { page: 'checkout' };
  if (path === '/about') return { page: 'about' };
  if (path === '/blog') return { page: 'blog' };
  if (path === '/faq') return { page: 'faq' };
  if (path === '/contact') return { page: 'contact' };
  if (path === '/wishlist') return { page: 'wishlist' };
  if (path === '/account') return { page: 'account' };
  if (path === '/cart') return { page: 'cart' };
  return { page: 'home' };
}

function routeKey(route: RouteState): string {
  if (route.page === 'product') {
    return `${route.page}:${route.params?.slug || ''}`;
  }
  return route.page;
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<RouteState>(() =>
    resolveRoute(typeof window !== 'undefined' ? window.location.pathname : '/')
  );
  const [displayPage, setDisplayPage] = useState<RouteState>(() =>
    resolveRoute(typeof window !== 'undefined' ? window.location.pathname : '/')
  );
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  useEffect(() => {
    const handleNavigation = () => {
      setCurrentPage(resolveRoute(window.location.pathname));
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href.startsWith(window.location.origin)) {
        e.preventDefault();
        const url = new URL(link.href);
        window.history.pushState({}, '', url.pathname);
        window.scrollTo(0, 0);
        handleNavigation();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    if (routeKey(currentPage) === routeKey(displayPage)) return;

    setIsPageTransitioning(true);

    const swapTimer = window.setTimeout(() => {
      setDisplayPage(currentPage);
      window.requestAnimationFrame(() => setIsPageTransitioning(false));
    }, 130);

    return () => window.clearTimeout(swapTimer);
  }, [currentPage, displayPage]);

  const renderPage = (pageState: RouteState) => {
    switch (pageState.page) {
      case 'home':
        return <Homepage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductPage slug={pageState.params?.slug || ''} />;
      case 'checkout':
        return <CheckoutPage />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage />;
      case 'faq':
        return <FAQPage />;
      case 'contact':
        return <ContactPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'account':
        return <AccountPage />;
      case 'cart':
        return <CheckoutPage />;
      default:
        return <Homepage />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Header onMenuClick={() => setIsMenuOpen(true)} />
        <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <Cart />
        <main
          className={`transition-all duration-300 ease-out will-change-transform ${
            isPageTransitioning ? 'opacity-0 translate-y-1 blur-[1px]' : 'opacity-100 translate-y-0 blur-0'
          }`}
        >
          {renderPage(displayPage)}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
