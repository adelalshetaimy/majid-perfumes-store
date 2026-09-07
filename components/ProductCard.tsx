import { Link } from 'react-router-dom';
import { formatPrice, type Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { Plus, Check } from 'lucide-react';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.sale_price ?? product.price,
      quantity: 1,
      currency: product.currency,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const outOfStock = product.availability === 'نفذ';

  return (
    <div className="card-lux group flex flex-col overflow-hidden hover:shadow-card hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-cream-200">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink-900/50 font-display text-sm font-bold text-cream-50">
            نفذت الكمية
          </span>
        )}
        {product.sale_price !== null && !outOfStock && (
          <span className="absolute top-3 right-3 rounded-full bg-bronze-500 px-3 py-1 text-xs font-bold text-cream-50 shadow-soft">
            خصم
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold text-bronze-400">{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 font-display text-base font-bold text-bronze-700 transition-colors hover:text-bronze-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-bronze-500">{product.description}</p>

        <div className="mt-3 flex items-center gap-2">
          {product.sale_price !== null ? (
            <>
              <span className="font-display text-lg font-bold text-bronze-700">
                {formatPrice(product.sale_price, product.currency)}
              </span>
              <span className="text-sm text-bronze-400 line-through">
                {formatPrice(product.price, product.currency)}
              </span>
            </>
          ) : (
            <span className="font-display text-lg font-bold text-bronze-700">
              {formatPrice(product.price, product.currency)}
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="btn-primary mt-4 w-full"
        >
          {added ? (
            <>
              <Check size={18} /> تمت الإضافة
            </>
          ) : (
            <>
              <Plus size={18} /> أضف للسلة
            </>
          )}
        </button>
      </div>
    </div>
  );
}
