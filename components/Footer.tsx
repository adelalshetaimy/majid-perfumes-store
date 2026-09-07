import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Phone, MapPin } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/lib/supabase';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-bronze-200/60 bg-cream-100">
      <div className="container-lux grid gap-10 py-12 md:grid-cols-3">
        <div>
          <h3 className="font-display text-lg font-bold text-bronze-700">مجيد للعطور</h3>
          <p className="mt-3 text-sm leading-relaxed text-bronze-600">
            فن صناعة العطور الشرقية الفاخرة. نختار أجود أنواع العود والمسك والورد لنقدم لك تجربة عطرية استثنائية.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-bronze-700">تصفح سريع</h4>
          <ul className="mt-4 space-y-2 text-sm text-bronze-600">
            <li><Link to="/" className="link-underline hover:text-bronze-700">الرئيسية</Link></li>
            <li><Link to="/#products" className="link-underline hover:text-bronze-700">المنتجات</Link></li>
            <li><Link to="/reviews" className="link-underline hover:text-bronze-700">آراء العملاء</Link></li>
            <li><Link to="/privacy" className="link-underline hover:text-bronze-700">سياسة الخصوصية</Link></li>
            <li><Link to="/returns" className="link-underline hover:text-bronze-700">سياسة الاسترجاع</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-bronze-700">تواصل معنا</h4>
          <ul className="mt-4 space-y-3 text-sm text-bronze-600">
            <li className="flex items-center gap-2">
              <MessageCircle size={16} className="text-bronze-500" />
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-bronze-700">
                واتساب: +967 730 700 888
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-bronze-500" />
              <span>+967 730 700 888</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-bronze-500" />
              <span>اليمن — خدمة عالمية</span>
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={16} className="text-bronze-500" />
              <span>@majid.perfumes</span>
            </li>
          </ul>

          <div className="mt-5 flex items-center gap-3">
            <a href="https://facebook.com/MajidPerfumes12" target="_blank" rel="noopener noreferrer" aria-label="فيسبوك" className="flex h-10 w-10 items-center justify-center rounded-full bg-bronze-500 text-cream-50 shadow-soft transition-all hover:bg-bronze-600 hover:shadow-card active:scale-95">
              <Facebook size={18} />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="تيك توك" className="flex h-10 w-10 items-center justify-center rounded-full bg-bronze-500 text-cream-50 shadow-soft transition-all hover:bg-bronze-600 hover:shadow-card active:scale-95">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.04.89.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.09z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-bronze-200/60">
        <div className="container-lux flex flex-col items-center justify-between gap-2 py-6 text-xs text-bronze-500 md:flex-row">
          <p>© {new Date().getFullYear()} مجيد للعطور. جميع الحقوق محفوظة.</p>
          <p>صُمم بعناية لعشاق العطور الأصيلة.</p>
        </div>
      </div>
    </footer>
  );
}
