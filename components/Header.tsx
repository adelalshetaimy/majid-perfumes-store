import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { to: '/', label: 'الرئيسية' },
  { to: '/#products', label: 'المنتجات' },
  { to: '/reviews', label: 'آراء العملاء' },
  { to: '/#about', label: 'عن العلامة' },
];

export default function Header() {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bronze-200/60 bg-cream-100/90 backdrop-blur-md">
      <div className="container-lux flex h-16 items-center justify-between gap-4 md:h-20">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)} aria-label="مجيد للعطور">
          <span className="relative h-14 w-36 overflow-hidden md:h-16 md:w-44">
            <img
              src="/771679225_122139364155159678_4887865984073179713_n.jpg"
              alt="شعار مجيد للعطور"
              className="absolute inset-x-0 top-0 h-auto w-full object-contain"
            />
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="link-underline font-display text-sm font-semibold text-bronze-600 transition-colors hover:text-bronze-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-bronze-500 text-cream-50 shadow-soft transition-all hover:bg-bronze-600 active:scale-95"
            aria-label="سلة التسوق"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -left-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ink-800 px-1 text-[0.7rem] font-bold text-cream-50">
                {count}
              </span>
            )}
          </Link>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full text-bronze-600 transition hover:bg-bronze-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="القائمة"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-bronze-200/60 bg-cream-100 md:hidden">
          <nav className="container-lux flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-3 py-3 font-display text-sm font-semibold text-bronze-600 transition hover:bg-bronze-50"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
