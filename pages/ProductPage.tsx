import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, formatPrice, type Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { ArrowRight, Minus, Plus, ShoppingBag, Check } from 'lucide-react';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setProduct(data as Product);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.sale_price ?? product.price,
      quantity,
      currency: product.currency,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container-lux py-20">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-cream-200" />
          <div className="space-y-4">
            <div className="h-8 w-1/2 animate-pulse rounded bg-cream-200" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-cream-200" />
            <div className="h-24 animate-pulse rounded bg-cream-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-lux flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-xl font-bold text-bronze-700">المنتج غير موجود</p>
        <Link to="/" className="btn-primary mt-6">العودة للرئيسية</Link>
      </div>
    );
  }

  const outOfStock = product.availability === 'نفذ';
  const finalPrice = product.sale_price ?? product.price;

  return (
    <div className="container-lux py-8 md:py-12">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-bronze-500 hover:text-bronze-700">
        <ArrowRight size={16} /> رجوع
      </button>

      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-cream-200 shadow-card">
          <img src={product.image_url} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
          {outOfStock && (
            <span className="absolute inset-0 flex items-center justify-center bg-ink-900/50 font-display text-lg font-bold text-cream-50">
              نفذت الكمية
            </span>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm font-semibold text-bronze-400">{product.category}</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-bronze-700 md:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            {product.sale_price !== null ? (
              <>
                <span className="font-display text-2xl font-bold text-bronze-700">
                  {formatPrice(product.sale_price, product.currency)}
                </span>
                <span className="text-lg text-bronze-400 line-through">
                  {formatPrice(product.price, product.currency)}
                </span>
              </>
            ) : (
              <span className="font-display text-2xl font-bold text-bronze-700">
                {formatPrice(product.price, product.currency)}
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-bronze-600">{product.description}</p>

          {!outOfStock && (
            <div className="mt-8">
              <label className="label-lux">الكمية</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-bronze-200 bg-cream-50 text-bronze-600 transition hover:bg-bronze-50 active:scale-95"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-display text-xl font-bold text-bronze-700">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-bronze-200 bg-cream-50 text-bronze-600 transition hover:bg-bronze-50 active:scale-95"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleAddToCart} disabled={outOfStock} className="btn-primary flex-1">
              {added ? (
                <>
                  <Check size={18} /> تمت الإضافة للسلة
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> أضف للسلة
                </>
              )}
            </button>
            <Link to="/cart" className="btn-outline flex-1">عرض السلة</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
