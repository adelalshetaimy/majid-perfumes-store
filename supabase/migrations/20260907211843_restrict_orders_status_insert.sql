/*
# Restrict orders.status from public INSERT

1. Security change
- The orders INSERT policy allows anon to submit orders, but the `status` column
  (a moderation/audit field) was writable by the public through the data API.
- This migration revokes table-wide INSERT from anon and re-grants INSERT on only
  the customer-facing columns, so `status` always defaults to 'جديد' and cannot be
  set by a public caller.
- authenticated (admin) retains full INSERT for any legitimate use.

2. Important notes
- No data is lost or modified — only column-level INSERT privileges are narrowed.
- The frontend checkout already omits `status` from its insert payload, so this
  change does not break the existing checkout flow.
*/

REVOKE INSERT ON public.orders FROM anon;
GRANT INSERT (customer_name, phone, location, address, notes, marketing_consent, items, total, currency) ON public.orders TO anon;