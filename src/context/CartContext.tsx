import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { OrderItem } from '@/lib/supabase';

type CartItem = OrderItem & { image_url?: string };

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  currency: string;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'majid-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const currency = items[0]?.currency ?? 'ريال يمني';
    return {
      items,
      count,
      total,
      currency,
      addItem: (item) => {
        setItems((prev) => {
          const existing = prev.find((p) => p.id === item.id);
          if (existing) {
            return prev.map((p) =>
              p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
            );
          }
          return [...prev, item];
        });
      },
      removeItem: (id) => setItems((prev) => prev.filter((p) => p.id !== id)),
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, quantity } : p)));
      },
      clear: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
