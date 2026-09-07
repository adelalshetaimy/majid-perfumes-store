import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { supabase, formatPrice, type OrderItem } from '@/lib/supabase';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { CheckCircle2, Loader2, MessageCircle } from 'lucide-react';

type FormState = {
  name: string;
  phone: string;
  location: string;
  address: string;
  notes: string;
  marketing_consent: boolean;
};

export default function CheckoutPage() {
  const { items, total, currency, clear } = useCart();
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    location: '',
    address: '',
    notes: '',
    marketing_consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [waLink, setWaLink] = useState('');
  const [countdown, setCountdown] = useState(2);
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    if (status !== 'success' || !waLink) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (!autoOpenedRef.current) {
      autoOpenedRef.current = true;
      window.open(waLink, '_blank');
    }
  }, [status, waLink, countdown]);

  if (items.length === 0 && status !== 'success') {
    return (
      <div className="container-lux flex flex-col items-center justify-center py-32 text-center">
        <h2 className="font-display text-2xl font-bold text-bronze-700">لا يمكن إتمام طلب فارغ</h2>
        <p className="mt-2 text-bronze-500">أضف منتجات إلى سلتك أولاً</p>
        <Link to="/" className="btn-primary mt-8">تصفح المنتجات</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.location || !form.address) return;

    setStatus('submitting');
    setErrorMsg('');

    const orderItems: OrderItem[] = items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      currency: i.currency,
    }));

    const { error } = await supabase.from('orders').insert({
      customer_name: form.name,
      phone: form.phone,
      location: form.location,
      address: form.address,
      notes: form.notes,
      marketing_consent: form.marketing_consent,
      items: orderItems,
      total,
      currency,
    });

    if (error) {
      console.error('Order save failed', error);
      setStatus('error');
      setErrorMsg('حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى.');
      return;
    }

    const link = buildWhatsAppLink(orderItems, { name: form.name, phone: form.phone, location: form.location, address: form.address, notes: form.notes }, total, currency);
    setWaLink(link);
    clear();
    setCountdown(2);
    autoOpenedRef.current = false;
    setStatus('success');
  };

  if (status === 'success') {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
        <div className="card-lux w-full max-w-md p-8 text-center md:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-bronze-100 animate-scaleIn">
            <CheckCircle2 size={48} className="text-bronze-500" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold text-bronze-700 md:text-3xl">
            تم استلام طلبك بنجاح!
          </h2>
          <p className="mt-3 text-bronze-500 leading-relaxed">
            جاري تحويلك لواتساب لتأكيد التفاصيل مع المتجر
          </p>

          {countdown > 0 ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-bronze-400">
              <Loader2 size={16} className="animate-spin" />
              سيتم فتح واتساب خلال {countdown}...
            </div>
          ) : (
            <p className="mt-6 text-sm text-bronze-400">
              إذا لم يفتح واتساب تلقائياً، اضغط الزر أدناه
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              <MessageCircle size={18} /> فتح واتساب الآن
            </a>
            <Link to="/" className="btn-outline w-full">العودة للمتجر</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-lux py-8 md:py-12">
      <h1 className="mb-8 font-display text-2xl font-bold text-bronze-700 md:text-3xl">إتمام الطلب</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card-lux space-y-5 p-6 lg:col-span-2">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="label-lux">الاسم الكامل *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-lux"
                placeholder="اكتب اسمك"
              />
            </div>
            <div>
              <label className="label-lux">رقم الجوال *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="input-lux"
                placeholder="مثال: 730700888"
              />
            </div>
          </div>

          <div>
            <label className="label-lux">المدينة / الدولة *</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="input-lux"
              placeholder="مثال: الرياض، السعودية"
            />
          </div>

          <div>
            <label className="label-lux">العنوان بالتفصيل *</label>
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input-lux resize-none"
              placeholder="الحي، الشارع، رقم المنزل..."
            />
          </div>

          <div>
            <label className="label-lux">ملاحظات إضافية</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input-lux resize-none"
              placeholder="أي تفاصيل تريد إضافتها"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-cream-100 p-4">
            <input
              type="checkbox"
              checked={form.marketing_consent}
              onChange={(e) => setForm({ ...form, marketing_consent: e.target.checked })}
              className="mt-1 h-5 w-5 accent-bronze-500"
            />
            <span className="text-sm text-bronze-600">
              أوافق على استلام العروض والتحديثات عبر واتساب مستقبلاً
            </span>
          </label>

          {status === 'error' && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{errorMsg}</div>
          )}

          <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full">
            {status === 'submitting' ? (
              <>
                <Loader2 size={18} className="animate-spin" /> جاري التأكيد...
              </>
            ) : (
              <>
                <MessageCircle size={18} /> تأكيد الطلب عبر واتساب
              </>
            )}
          </button>
        </form>

        <div className="card-lux h-fit p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-bold text-bronze-700">ملخص الطلب</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-bronze-600">
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
        </div>
      </div>
    </div>
  );
}
