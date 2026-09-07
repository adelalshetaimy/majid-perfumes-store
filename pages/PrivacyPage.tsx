export default function PrivacyPage() {
  return (
    <div className="container-lux py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-bronze-700 md:text-4xl">سياسة الخصوصية</h1>
        <div className="mt-8 space-y-6 leading-relaxed text-bronze-600">
          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">مقدمة</h2>
            <p className="mt-2">
              في مجيد للعطور، نحترم خصوصية عملائنا ونلتزم بحماية بياناتهم الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا للمعلومات التي تشاركها معنا.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">المعلومات التي نجمعها</h2>
            <p className="mt-2">
              عند إتمام طلب عبر متجرنا، نجمع البيانات التالية: الاسم الكامل، رقم الجوال، المدينة/الدولة، العنوان التفصيلي، وملاحظات الطلب. كما نحفظ موافقتك أو عدم موافقتك على استلام العروض عبر واتساب.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">كيف نستخدم بياناتك</h2>
            <ul className="mt-2 list-disc space-y-1 pr-5">
              <li>معالجة وإتمام طلباتك وتوصيلها.</li>
              <li>التواصل معك بخصوص طلبك عبر واتساب.</li>
              <li>إرسال العروض والتحديثات في حال موافقتك على ذلك.</li>
              <li>تحسين خدماتنا وتجربة التسوق.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">حماية البيانات</h2>
            <p className="mt-2">
              نستخدم إجراءات تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرح به أو التعديل أو الإفصاح. لا نشارك بياناتك مع أي طرف ثالث لأغراض تسويقية دون موافقتك.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">حقوقك</h2>
            <p className="mt-2">
              لديك الحق في الوصول إلى بياناتك الشخصية، تصحيحها، أو طلب حذفها. للتمتع بهذه الحقوق، تواصل معنا عبر واتساب: +967 730 700 888.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-bronze-700">التواصل</h2>
            <p className="mt-2">
              لأي استفسار بخصوص سياسة الخصوصية، يرجى التواصل معنا عبر واتساب على الرقم +967 730 700 888.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
