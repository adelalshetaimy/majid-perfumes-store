import { useEffect, useMemo, useState } from 'react';
import { supabase, CATEGORIES, type Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Search, Sparkles, Award, FlaskConical } from 'lucide-react';

const HERO_IMAGE = 'https://images.pexels.com/photos/9323864/pexels-photo-9323864.jpeg?auto=compress&cs=tinysrgb&w=1600';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('الكل');
  const [search, setSearch] = useState('');

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProducts(data as Product[]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === 'الكل' || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase().trim());
      return matchCat && matchSearch;
    });
  }, [products, category, search]);

  const featured = useMemo(() => products.slice(0, 4), [products]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="عطور فاخرة" fetchPriority="high" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-ink-900/80 via-ink-900/50 to-ink-900/20" />
        </div>
        <div className="container-lux relative flex min-h-[70vh] flex-col justify-center py-20 text-cream-50">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-cream-100/30 bg-cream-50/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm">
            <Sparkles size={14} /> فخامة العطور الشرقية الأصيلة
          </span>
          <h1 className="max-w-xl font-display text-4xl font-bold leading-tight md:text-6xl">
            مجيد للعطور
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-cream-100/90 md:text-lg">
            رحلة عطرية فاخرة من قلب العود والمسك والورد. عطور تدوم وتروي قصة أصالة لا تُنسى.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#products" className="btn-primary bg-cream-50 text-bronze-700 hover:bg-cream-200">
              تصفح المجموعة
            </a>
            <a href="#about" className="btn-outline border-cream-100/40 text-cream-50 hover:bg-cream-50/10">
              تعرف علينا
            </a>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container-lux py-16">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold text-bronze-700 md:text-3xl">وصل حديثاً</h2>
            <p className="mt-2 text-sm text-bronze-500">أحدث ما وصل إلى متجرنا</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Products with filter */}
      <section id="products" className="container-lux py-12">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-bold text-bronze-700 md:text-3xl">مجموعتنا</h2>
          <p className="mt-2 text-sm text-bronze-500">اختر فئتك المفضلة واكتشف عطرك</p>
        </div>

        {/* Search */}
        <div className="mx-auto mb-6 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-bronze-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن عطر..."
              className="input-lux pr-11"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="no-scrollbar mb-10 flex justify-center gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap rounded-full px-5 py-2 font-display text-sm font-semibold transition-all ${
                category === cat
                  ? 'bg-bronze-500 text-cream-50 shadow-soft'
                  : 'bg-cream-50 text-bronze-600 hover:bg-bronze-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-cream-200" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-bronze-500">
            لا توجد منتجات مطابقة.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section id="about" className="bg-cream-100 py-16">
        <div className="container-lux grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-bold text-bronze-700 md:text-3xl">فن صناعة العطور</h2>
            <p className="mt-4 leading-relaxed text-bronze-600">
              في مجيد للعطور، نؤمن أن العطر ليس مجرد رائحة، بل هو ذاكرة وهوية. نختار أجود المواد الطبيعية من العود الكمبودي والمسك الأبيض والورد الطائفي، ونمزجها بحرفية عالية لنقدم لك عطوراً تدوم وتلامس الروح.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <Award className="mx-auto text-bronze-500" size={28} />
                <p className="mt-2 font-display text-sm font-bold text-bronze-700">جودة فاخرة</p>
              </div>
              <div className="text-center">
                <FlaskConical className="mx-auto text-bronze-500" size={28} />
                <p className="mt-2 font-display text-sm font-bold text-bronze-700">خلط حرفي</p>
              </div>
              <div className="text-center">
                <Sparkles className="mx-auto text-bronze-500" size={28} />
                <p className="mt-2 font-display text-sm font-bold text-bronze-700">ثبات طويل</p>
              </div>
            </div>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
            <img
              src="https://images.pexels.com/photos/29538704/pexels-photo-29538704.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="فن صناعة العطور"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
