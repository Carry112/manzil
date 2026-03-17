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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<{
    page: string;
    params?: Record<string, string>;
  }>({ page: 'home' });

  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;

      if (path === '/' || path === '') {
        setCurrentPage({ page: 'home' });
      } else if (path === '/shop' || path === '/new' || path === '/featured') {
        setCurrentPage({ page: 'shop' });
      } else if (path.startsWith('/product/')) {
        const slug = path.split('/product/')[1];
        setCurrentPage({ page: 'product', params: { slug } });
      } else if (path === '/checkout') {
        setCurrentPage({ page: 'checkout' });
      } else if (path === '/about') {
        setCurrentPage({ page: 'about' });
      } else if (path === '/blog') {
        setCurrentPage({ page: 'blog' });
      } else if (path === '/faq') {
        setCurrentPage({ page: 'faq' });
      } else if (path === '/contact') {
        setCurrentPage({ page: 'contact' });
      } else if (path === '/wishlist') {
        setCurrentPage({ page: 'wishlist' });
      } else if (path === '/account') {
        setCurrentPage({ page: 'account' });
      } else if (path === '/cart') {
        setCurrentPage({ page: 'cart' });
      } else {
        setCurrentPage({ page: 'home' });
      }
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
        handleNavigation();
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage.page) {
      case 'home':
        return <Homepage />;
      case 'shop':
        return <ShopPage />;
      case 'product':
        return <ProductPage slug={currentPage.params?.slug || ''} />;
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
        <main>{renderPage()}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
