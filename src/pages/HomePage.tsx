import { useEffect, useMemo, useState } from 'react';
import { supabase, fetchActiveCategories, type Product, type Category } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import { Search, Sparkles, Award, FlaskConical } from 'lucide-react';

const HERO_IMAGE = 'https://images.pexels.com/photos/9323864/pexels-photo-9323864.jpeg?auto=compress&cs=tinysrgb&w=1600';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('الكل');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      fetchActiveCategories(),
    ]).then(([productsRes, categoriesData]) => {
      if (!productsRes.error && productsRes.data) setProducts(productsRes.data as Product[]);
      setCategories(categoriesData);
      setLoading(false);
    });
  }, []);

  const categoryNames = useMemo(() => ['الكل', ...categories.map((c) => c.name)], [categories]);

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
        <div className="mb-8
