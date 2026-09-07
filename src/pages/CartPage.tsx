import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/supabase';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, total, currency, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container-lux flex flex-col items-center justify-center py-32 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cream-200">
          <ShoppingBag size={40} className="text-bronze-400" />
        </div>
        <h2 className="mt-6 font-display text-2xl font-bold text-bronze-700">سلتك فارغة</h2>
        <p className="mt-2 text-bronze-500">تصفح مجموعتنا واختر عطرك المفضل</p>
        <Link to="/" className="btn-primary mt-8">تصفح المنتجات</Link>
      </div>
    );
  }

  return (
    <div className="container-lux py-8 md:py-12">
      <h1 className="mb-8 font-display text-2xl font-bold text-bronze-700 md:text-3xl">سلة التسوق</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="card-lux flex gap-4 p-4">
              <Link to={`/product/${item.id}`} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-cream-200">
                {item.image_url && (
                  <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                )}
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-bronze-700">{item.name}</h3>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-bronze-400 transition hover:text-red-600"
                    aria-label="حذف"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <span className="mt-1 text-sm font-semibold text-bronze-500">
                  {formatPrice(item.price, item.currency)}
                </span>

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze-200 bg-cream-50 text-bronze-600 transition hover:bg-bronze-50 active:scale-95"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-display font-bold text-bronze-700">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-bronze-200 bg-cream-50 text-bronze-600 transition hover:bg-bronze-50 active:scale-95"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="font-display font-bold text-bronze-700">
                    {formatPrice(item.price * item.quantity, item.currency)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-bronze-500 hover:text-bronze-700">
            <ArrowLeft size={16} /> متابعة التسوق
          </button>
        </div>

        <div className="card-lux h-fit p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-bronze-700">ملخص الطلب</h2>
          <div className="mt-4 space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-bronze-600">
                <span>{item.name} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity, item.currency)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-bronze-200 pt-4">
            <div className="flex justify-between font-display text-lg font-bold text-bronze-700">
              <span>الإجمالي</span>
              <span>{formatPrice(total, currency)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-primary mt-6 w-full">
            إتمام الطلب
          </Link>
        </div>
      </div>
    </div>
  );
}
