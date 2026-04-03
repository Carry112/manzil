import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  const footerGroups = [
    {
      title: 'Shop',
      links: [
        { href: '/shop', label: 'All Products' },
        { href: '/featured', label: 'Featured Drops' },
        { href: '/new', label: 'New Arrivals' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/blog', label: 'Stories' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { href: '/faq', label: 'FAQ' },
        { href: '/account', label: 'My Account' },
        { href: '/wishlist', label: 'Wishlist' },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[#4C3B4C] bg-[#2B1E2B] text-[#F8EEF8]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-10 h-72 w-72 rounded-full bg-[#FF8FC3]/20 blur-3xl" />
        <div className="absolute bottom-0 right-8 h-72 w-72 rounded-full bg-[#6FA3FF]/20 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12">
        <div className="grid gap-10 border-b border-white/15 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h3
              className="text-3xl uppercase tracking-[0.3em] text-white"
              style={{ fontFamily: "'Bodoni Moda', serif" }}
            >
              CHÉLOUVE
            </h3>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#DCCEDC]">
              Curated street-luxury essentials built for movement, craftsmanship, and statement dressing.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#E8DDE8]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
                <MapPin className="h-4 w-4 text-[#FF8FC3]" />
                Lahore, PK
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5">
                <Phone className="h-4 w-4 text-[#6FA3FF]" />
                +92 300 0000000
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href="https://instagram.com"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#FFE9F5] transition-colors hover:border-[#FF8FC3]/75 hover:text-[#FF8FC3]"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#E8F0FF] transition-colors hover:border-[#6FA3FF]/75 hover:text-[#6FA3FF]"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-[#F4CDE4]">Members Edit</p>
            <h4 className="mt-2 font-serif text-3xl text-white">Get early access to every drop</h4>
            <p className="mt-3 text-sm text-[#E5D7E5]">
              Join the newsletter for first look releases, restocks, and styling notes.
            </p>

            <form
              className="mt-5 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder:text-[#D5C4D5] outline-none transition-colors focus:border-[#FF8FC3]"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-[#FF8FC3] to-[#6FA3FF] px-5 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-[#FF8FC3]/30"
              >
                <Mail className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 py-10 md:grid-cols-4">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h5 className="text-xs uppercase tracking-[0.22em] text-[#F4CDE4]">{group.title}</h5>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="inline-flex items-center gap-1.5 text-[#E0D1E0] transition-colors hover:text-[#FF8FC3]"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h5 className="text-xs uppercase tracking-[0.22em] text-[#BFD5FF]">Visit</h5>
            <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-[#D8C7D8]">
              Mon-Sat, 11:00 - 20:00
              <br />
              Studio 42, Main Boulevard
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/15 py-6 text-xs text-[#B7A9B7] md:flex-row">
          <p>© {year} Chelouve. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-5">
            <a href="/about" className="transition-colors hover:text-[#FF8FC3]">About</a>
            <a href="/faq" className="transition-colors hover:text-[#FF8FC3]">FAQ</a>
            <a href="/contact" className="transition-colors hover:text-[#6FA3FF]">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
