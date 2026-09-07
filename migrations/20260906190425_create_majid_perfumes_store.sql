/*
# Create Majid Perfumes store data model

1. New Tables
- `products`: public catalog items with name, pricing, currency, category, description, image URL, and availability.
- `reviews`: curated customer testimonials managed by authenticated store staff.
- `orders`: customer checkout records including contact details, line items, totals, and WhatsApp marketing consent.

2. Storage
- Creates the public `product-images` bucket so catalog images can be displayed publicly while uploads and changes require authentication.

3. Security
- Enables row-level security on all store tables.
- Products are publicly readable; only authenticated users can create, edit, or delete products.
- Reviews are publicly readable; only authenticated users can manage reviews.
- Orders can be submitted by the public checkout, but only authenticated users can read, update, or delete order records.
- Storage objects are publicly readable and authenticated-only for insert, update, and delete.

4. Important notes
- No payment information is stored because checkout is completed through WhatsApp.
- Order line items are stored as JSON so the exact basket at checkout remains available for export and customer service.
*/

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price numeric(12,2) NOT NULL CHECK (price >= 0),
  sale_price numeric(12,2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= price)),
  currency text NOT NULL DEFAULT 'ريال يمني',
  category text NOT NULL CHECK (category IN ('عطور رجالية', 'عطور نسائية', 'هدايا وبكجات', 'معطرات الجسم')),
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL,
  availability text NOT NULL DEFAULT 'متاح' CHECK (availability IN ('متاح', 'نفذ')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products(created_at DESC);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products" ON public.products FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Staff can add products" ON public.products;
CREATE POLICY "Staff can add products" ON public.products FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Staff can edit products" ON public.products;
CREATE POLICY "Staff can edit products" ON public.products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Staff can delete products" ON public.products;
CREATE POLICY "Staff can delete products" ON public.products FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  review_text text NOT NULL,
  rating integer NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Staff can add reviews" ON public.reviews;
CREATE POLICY "Staff can add reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Staff can edit reviews" ON public.reviews;
CREATE POLICY "Staff can edit reviews" ON public.reviews FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Staff can delete reviews" ON public.reviews;
CREATE POLICY "Staff can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  location text NOT NULL,
  address text NOT NULL,
  notes text NOT NULL DEFAULT '',
  marketing_consent boolean NOT NULL DEFAULT false,
  items jsonb NOT NULL,
  total numeric(12,2) NOT NULL CHECK (total >= 0),
  currency text NOT NULL DEFAULT 'ريال يمني',
  status text NOT NULL DEFAULT 'جديد' CHECK (status IN ('جديد', 'تم التواصل', 'مكتمل', 'ملغي')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at DESC);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can submit orders" ON public.orders;
CREATE POLICY "Public can submit orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "Staff can view orders" ON public.orders;
CREATE POLICY "Staff can view orders" ON public.orders FOR SELECT TO authenticated USING (true);
DROP POLICY IF EXISTS "Staff can update orders" ON public.orders;
CREATE POLICY "Staff can update orders" ON public.orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Staff can delete orders" ON public.orders;
CREATE POLICY "Staff can delete orders" ON public.orders FOR DELETE TO authenticated USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view product images" ON storage.objects;
CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Staff can upload product images" ON storage.objects;
CREATE POLICY "Staff can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Staff can update product images" ON storage.objects;
CREATE POLICY "Staff can update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Staff can delete product images" ON storage.objects;
CREATE POLICY "Staff can delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');