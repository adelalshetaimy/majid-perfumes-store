import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase, type Product, type Review, type Order, formatPrice } from '@/lib/supabase';
import { Loader2, LogOut, Package, Star, Users, Plus, Pencil, Trash2, Download, X, Check } from 'lucide-react';

type Tab = 'products' | 'reviews' | 'orders';

export default function AdminDashboard() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) navigate('/admin/login');
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]).then(([p, r, o]) => {
      if (p.data) setProducts(p.data as Product[]);
      if (r.data) setReviews(r.data as Review[]);
      if (o.data) setOrders(o.data as Order[]);
      setDataLoading(false);
    });
  }, [session]);

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-bronze-500" size={32} />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const exportCSV = () => {
    const headers = ['الاسم', 'الجوال', 'المدينة', 'العنوان', 'الموافقة التسويقية', 'الإجمالي', 'العملة', 'التاريخ', 'الحالة'];
    const rows = orders.map((o) => [
      o.customer_name,
      o.phone,
      o.location,
      o.address.replace(/\n/g, ' '),
      o.marketing_consent ? 'نعم' : 'لا',
      o.total,
      o.currency,
      new Date(o.created_at).toLocaleString('ar-EG'),
      o.status,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-bronze-200/60 bg-cream-50/90 backdrop-blur-md">
        <div className="container-lux flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center" aria-label="مجيد للعطور">
              <span className="relative h-10 w-28 overflow-hidden">
                <img
                  src="/771679225_122139364155159678_4887865984073179713_n.jpg"
                  alt="شعار مجيد للعطور"
                  className="absolute inset-x-0 top-0 h-auto w-full object-contain"
                />
              </span>
            </Link>
            <span className="rounded-full bg-bronze-100 px-3 py-0.5 text-xs font-semibold text-bronze-600">لوحة التحكم</span>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-bronze-600 transition hover:bg-bronze-50">
            <LogOut size={18} /> خروج
          </button>
        </div>
      </header>

      <div className="container-lux py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard icon={<Package size={20} />} label="المنتجات" value={products.length} />
          <StatCard icon={<Star size={20} />} label="الآراء" value={reviews.length} />
          <StatCard icon={<Users size={20} />} label="الطلبات" value={orders.length} />
          <StatCard icon={<Check size={20} />} label="موافقون على العروض" value={orders.filter((o) => o.marketing_consent).length} />
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto no-scrollbar">
          <TabButton active={tab === 'products'} onClick={() => setTab('products')} icon={<Package size={16} />} label="المنتجات" />
          <TabButton active={tab === 'reviews'} onClick={() => setTab('reviews')} icon={<Star size={16} />} label="الآراء" />
          <TabButton active={tab === 'orders'} onClick={() => setTab('orders')} icon={<Users size={16} />} label="العملاء والطلبات" />
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-bronze-500" size={32} />
          </div>
        ) : tab === 'products' ? (
          <ProductsTab products={products} onUpdate={setProducts} />
        ) : tab === 'reviews' ? (
          <ReviewsTab reviews={reviews} onUpdate={setReviews} />
        ) : (
          <OrdersTab orders={orders} onUpdate={setOrders} onExport={exportCSV} />
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="card-lux flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bronze-100 text-bronze-600">{icon}</div>
      <div>
        <p className="text-xs text-bronze-500">{label}</p>
        <p className="font-display text-xl font-bold text-bronze-700">{value}</p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 font-display text-sm font-semibold transition-all ${
        active ? 'bg-bronze-500 text-cream-50 shadow-soft' : 'bg-cream-50 text-bronze-600 hover:bg-bronze-50'
      }`}
    >
      {icon} {label}
    </button>
  );
}

/* ===== Products Tab ===== */
function ProductsTab({ products, onUpdate }: { products: Product[]; onUpdate: (p: Product[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) onUpdate(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <Plus size={18} /> إضافة منتج
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p.id} className="card-lux overflow-hidden">
            <div className="aspect-video bg-cream-200">
              <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <span className="text-xs text-bronze-400">{p.category}</span>
              <h3 className="font-display font-bold text-bronze-700">{p.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-bold text-bronze-700">{formatPrice(p.sale_price ?? p.price, p.currency)}</span>
                {p.sale_price && <span className="text-sm text-bronze-400 line-through">{formatPrice(p.price, p.currency)}</span>}
              </div>
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${p.availability === 'متاح' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {p.availability}
              </span>
              <div className="mt-4 flex gap-2">
                <button onClick={() => { setEditing(p); setShowForm(true); }} className="flex-1 rounded-lg border border-bronze-200 py-2 text-sm font-semibold text-bronze-600 transition hover:bg-bronze-50">
                  <Pencil size={14} className="inline" /> تعديل
                </button>
                <button onClick={() => handleDelete(p.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ProductForm
          product={editing}
          onClose={() => setShowForm(false)}
          onSave={(saved) => {
            if (editing) {
              onUpdate(products.map((p) => (p.id === saved.id ? saved : p)));
            } else {
              onUpdate([saved, ...products]);
            }
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ProductForm({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (p: Product) => void }) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    price: product?.price?.toString() ?? '',
    sale_price: product?.sale_price?.toString() ?? '',
    currency: product?.currency ?? 'ريال يمني',
    category: product?.category ?? 'عطور رجالية',
    description: product?.description ?? '',
    image_url: product?.image_url ?? '',
    availability: product?.availability ?? 'متاح',
  });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('product-images').upload(fileName, file);
    if (upErr) {
      setError('فشل رفع الصورة');
      setUploading(false);
      return;
    }
    const { data: url } = supabase.storage.from('product-images').getPublicUrl(fileName);
    setForm({ ...form, image_url: url.publicUrl });
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      currency: form.currency,
      category: form.category,
      description: form.description,
      image_url: form.image_url,
      availability: form.availability,
    };

    let result;
    if (product) {
      result = await supabase.from('products').update(payload).eq('id', product.id).select().single();
    } else {
      result = await supabase.from('products').insert(payload).select().single();
    }

    setSubmitting(false);
    if (result.error) {
      setError('فشل حفظ المنتج');
      return;
    }
    onSave(result.data as Product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="card-lux max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-bronze-700">{product ? 'تعديل منتج' : 'منتج جديد'}</h2>
          <button onClick={onClose} className="text-bronze-400 hover:text-bronze-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-lux">اسم المنتج *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-lux" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-lux">السعر *</label>
              <input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-lux" />
            </div>
            <div>
              <label className="label-lux">سعر بعد الخصم</label>
              <input type="number" step="0.01" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} className="input-lux" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-lux">العملة *</label>
              <input required value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} className="input-lux" placeholder="ريال يمني" />
            </div>
            <div>
              <label className="label-lux">التوفر</label>
              <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="input-lux">
                <option value="متاح">متاح</option>
                <option value="نفذ">نفذ</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label-lux">الفئة *</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-lux">
              <option value="عطور رجالية">عطور رجالية</option>
              <option value="عطور نسائية">عطور نسائية</option>
              <option value="هدايا وبكجات">هدايا وبكجات</option>
              <option value="معطرات الجسم">معطرات الجسم</option>
            </select>
          </div>

          <div>
            <label className="label-lux">الوصف</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-lux resize-none" />
          </div>

          <div>
            <label className="label-lux">صورة المنتج</label>
            <div className="flex items-center gap-3">
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="btn-outline cursor-pointer">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} رفع صورة
              </label>
              {form.image_url && <img src={form.image_url} alt="preview" className="h-16 w-16 rounded-lg object-cover" />}
            </div>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-lux mt-2" placeholder="أو الصق رابط صورة" />
          </div>

          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'حفظ'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== Reviews Tab ===== */
function ReviewsTab({ reviews, onUpdate }: { reviews: Review[]; onUpdate: (r: Review[]) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الرأي؟')) return;
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (!error) onUpdate(reviews.filter((r) => r.id !== id));
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => { setEditing(null); setShowForm(true); }} className="btn-primary">
          <Plus size={18} /> إضافة رأي
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.id} className="card-lux p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-bronze-700">{r.customer_name}</h3>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < r.rating ? 'fill-bronze-400 text-bronze-400' : 'text-bronze-200'} />
                ))}
              </div>
            </div>
            <p className="mt-2 text-sm text-bronze-600">{r.review_text}</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setEditing(r); setShowForm(true); }} className="flex-1 rounded-lg border border-bronze-200 py-2 text-sm font-semibold text-bronze-600 transition hover:bg-bronze-50">
                <Pencil size={14} className="inline" /> تعديل
              </button>
              <button onClick={() => handleDelete(r.id)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ReviewForm
          review={editing}
          onClose={() => setShowForm(false)}
          onSave={(saved) => {
            if (editing) {
              onUpdate(reviews.map((r) => (r.id === saved.id ? saved : r)));
            } else {
              onUpdate([saved, ...reviews]);
            }
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

function ReviewForm({ review, onClose, onSave }: { review: Review | null; onClose: () => void; onSave: (r: Review) => void }) {
  const [form, setForm] = useState({
    customer_name: review?.customer_name ?? '',
    review_text: review?.review_text ?? '',
    rating: review?.rating ?? 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      customer_name: form.customer_name,
      review_text: form.review_text,
      rating: form.rating,
    };

    let result;
    if (review) {
      result = await supabase.from('reviews').update(payload).eq('id', review.id).select().single();
    } else {
      result = await supabase.from('reviews').insert(payload).select().single();
    }

    setSubmitting(false);
    if (result.error) {
      setError('فشل حفظ الرأي');
      return;
    }
    onSave(result.data as Review);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="card-lux w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-bronze-700">{review ? 'تعديل رأي' : 'رأي جديد'}</h2>
          <button onClick={onClose} className="text-bronze-400 hover:text-bronze-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-lux">اسم العميل *</label>
            <input required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="input-lux" />
          </div>
          <div>
            <label className="label-lux">نص التقييم *</label>
            <textarea required rows={3} value={form.review_text} onChange={(e) => setForm({ ...form, review_text: e.target.value })} className="input-lux resize-none" />
          </div>
          <div>
            <label className="label-lux">التقييم</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                  <Star size={24} className={n <= form.rating ? 'fill-bronze-400 text-bronze-400' : 'text-bronze-200'} />
                </button>
              ))}
            </div>
          </div>

          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader2 size={18} className="animate-spin" /> : 'حفظ'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== Orders Tab ===== */
function OrdersTab({ orders, onUpdate, onExport }: { orders: Order[]; onUpdate: (o: Order[]) => void; onExport: () => void }) {
  const handleStatusChange = async (id: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) onUpdate(orders.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    const { error } = await supabase.from('orders').delete().eq('id', id);
    if (!error) onUpdate(orders.filter((o) => o.id !== id));
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={onExport} className="btn-primary">
          <Download size={18} /> تصدير CSV
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center text-bronze-500">لا توجد طلبات بعد.</div>
      ) : (
        <div className="card-lux overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-bronze-200 bg-cream-100">
                <th className="p-4 font-display font-bold text-bronze-700">الاسم</th>
                <th className="p-4 font-display font-bold text-bronze-700">الجوال</th>
                <th className="p-4 font-display font-bold text-bronze-700">المدينة</th>
                <th className="p-4 font-display font-bold text-bronze-700">الإجمالي</th>
                <th className="p-4 font-display font-bold text-bronze-700">التسويق</th>
                <th className="p-4 font-display font-bold text-bronze-700">التاريخ</th>
                <th className="p-4 font-display font-bold text-bronze-700">الحالة</th>
                <th className="p-4 font-display font-bold text-bronze-700">إجراء</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-bronze-100 last:border-0 hover:bg-cream-50">
                  <td className="p-4 font-semibold text-bronze-700">{o.customer_name}</td>
                  <td className="p-4 text-bronze-600" dir="ltr">{o.phone}</td>
                  <td className="p-4 text-bronze-600">{o.location}</td>
                  <td className="p-4 font-semibold text-bronze-700">{formatPrice(o.total, o.currency)}</td>
                  <td className="p-4">
                    {o.marketing_consent ? (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">نعم</span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500">لا</span>
                    )}
                  </td>
                  <td className="p-4 text-bronze-500">{new Date(o.created_at).toLocaleDateString('ar-EG')}</td>
                  <td className="p-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="rounded-lg border border-bronze-200 bg-cream-50 px-2 py-1 text-xs font-semibold text-bronze-600"
                    >
                      <option value="جديد">جديد</option>
                      <option value="تم التواصل">تم التواصل</option>
                      <option value="مكتمل">مكتمل</option>
                      <option value="ملغي">ملغي</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(o.id)} className="text-red-500 transition hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
