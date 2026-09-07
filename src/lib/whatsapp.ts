import { WHATSAPP_NUMBER, type OrderItem } from '@/lib/supabase';

export function buildWhatsAppLink(items: OrderItem[], customer: { name: string; phone: string; location: string; address: string; notes: string }, total: number, currency: string): string {
  const lines: string[] = [];
  lines.push('🧺 *طلب جديد من مجيد للعطور*');
  lines.push('');
  lines.push('━━━━━━━━━━━━━━');
  lines.push('*المنتجات:*');
  items.forEach((item, idx) => {
    const lineTotal = item.price * item.quantity;
    lines.push(`${idx + 1}. ${item.name}`);
    lines.push(`   الكمية: ${item.quantity} × ${item.price.toLocaleString('ar-EG')} = ${lineTotal.toLocaleString('ar-EG')} ${item.currency}`);
  });
  lines.push('━━━━━━━━━━━━━━');
  lines.push(`*الإجمالي: ${total.toLocaleString('ar-EG')} ${currency}*`);
  lines.push('');
  lines.push('*بيانات العميل:*');
  lines.push(`الاسم: ${customer.name}`);
  lines.push(`الجوال: ${customer.phone}`);
  lines.push(`المدينة/الدولة: ${customer.location}`);
  lines.push(`العنوان: ${customer.address}`);
  if (customer.notes) lines.push(`ملاحظات: ${customer.notes}`);

  const text = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
