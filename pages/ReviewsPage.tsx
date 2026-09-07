import { useEffect, useState } from 'react';
import { supabase, type Review } from '@/lib/supabase';
import { Star, Quote } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setReviews(data as Review[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-lux py-12 md:py-16">
      <div className="mb-12 text-center">
        <h1 className="font-display text-3xl font-bold text-bronze-700 md:text-4xl">آراء عملائنا</h1>
        <p className="mt-3 text-bronze-500">تجارب حقيقية من عملاء مجيد للعطور</p>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-cream-200" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-20 text-center text-bronze-500">لا توجد آراء بعد.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="card-lux p-6">
              <Quote className="text-bronze-200" size={32} />
              <p className="mt-3 leading-relaxed text-bronze-600">{review.review_text}</p>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'fill-bronze-400 text-bronze-400' : 'text-bronze-200'}
                  />
                ))}
              </div>
              <p className="mt-3 font-display font-bold text-bronze-700">{review.customer_name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
