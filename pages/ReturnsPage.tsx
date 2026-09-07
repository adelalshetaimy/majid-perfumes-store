export default function ReturnsPage() {
  return (
    <div className="container-lux py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-bronze-700 md:text-4xl">سياسة الاسترجاع</h1>
        <div className="mt-8 space-y-6 leading-relaxed text-bronze-600">
          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">الاسترجاع خلال 7 أيام</h2>
            <p className="mt-2">
              يمكنك طلب استرجاع المنتج خلال 7 أيام من تاريخ الاستلام، بشرط أن يكون المنتج في حالته الأصلية وغير مستخدم وبالتغليف الأصلي.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">شروط الاسترجاع</h2>
            <ul className="mt-2 list-disc space-y-1 pr-5">
              <li>أن يكون المنتج غير مستخدم وغير مفتوح.</li>
              <li>أن يكون في عبوته الأصلية بحالته الكاملة.</li>
              <li>إرفاق إثبات الشراء (فاتورة أو رقم الطلب).</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">الحالات غير القابلة للاسترجاع</h2>
            <ul className="mt-2 list-disc space-y-1 pr-5">
              <li>المنتجات المستخدمة أو المفتوحة.</li>
              <li>المنتجات التالفة بسبب سوء الاستخدام.</li>
              <li>المنتجات المخصصة أو المصنوعة حسب الطلب.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">طريقة الاسترجاع</h2>
            <p className="mt-2">
              لطلب استرجاع، تواصل معنا عبر واتساب على الرقم +967 730 700 888 مع ذكر رقم الطلب وسبب الاسترجاع. سيقوم فريقنا بمراجعة طلبك وتوجيهك للخطوات التالية.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">المبالغ المستردة</h2>
            <p className="mt-2">
              تتم عمليات استرداد المبالغ بعد استلام المنتج وفحصه والتأكد من مطابقته لشروط الاسترجاع. سيتم تنسيق طريقة الاسترداد معك عبر واتساب.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
