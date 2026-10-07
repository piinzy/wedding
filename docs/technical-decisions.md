# سجل القرارات التقنية — منصة رباط
> يُحدَّث هذا الملف مع كل قرار معماري مهم

---

## [2025-10-07] هيكل قاعدة البيانات: bride → organizer

**القرار:** إعادة تسمية جميع الجداول والأعمدة من `bride_*` إلى `organizer_*`

**السبب:** المنصة تستهدف جميع المناسبات (زواج، أعياد ميلاد، حفلات منزلية، مناسبات عامة) وليس الزفاف فقط. التسمية الأولى كانت تحدّ نطاق المنصة.

**التغييرات:**
- `bride_profiles` → `event_organizer_profiles` (مع عمود `event_type`)
- `bride_purchases` → `organizer_purchases`
- عمود `bride_id` → `organizer_id` في 6 جداول
- `wedding_date` → `event_date`
- Enum `user_role`: أضيفت قيمة `organizer` (لم تُحذف `bride` لتجنب كسر البيانات الموجودة)

**الملف:** `supabase/migrations/002_fix_schema_and_rls.sql`

---

## [2025-10-07] نمط Server Actions بدل API Routes

**القرار:** استخدام Next.js Server Actions (`'use server'`) لجميع عمليات قاعدة البيانات

**السبب:**
- تحقق المدخلات يحدث على الخادم تلقائياً (لا يمكن تجاوزه)
- أقل كوداً من API Routes لكل عملية
- TypeScript end-to-end من الصفحة للـ Action

**الملفات:**
- `src/lib/actions/auth.ts` — تسجيل المستخدمين والموردين
- `src/lib/actions/organizer.ts` — بيانات لوحة المنظّم
- `src/lib/actions/vendor.ts` — بيانات لوحة المورد
- `src/lib/actions/admin.ts` — عمليات الأدمن

---

## [2025-10-07] RLS: دالة is_admin() بدل Self-Join

**القرار:** إنشاء دالة `public.is_admin() SECURITY DEFINER` للتحقق من صلاحية الأدمن

**السبب:** السياسة الأصلية كانت تستعلم من جدول `users` لحماية نفس الجدول → infinite recursion

**الملف:** `supabase/migrations/002_fix_schema_and_rls.sql`

---

## [2025-10-07] Trigger: handle_new_user()

**القرار:** إضافة Trigger على `auth.users` ينشئ صفاً في `public.users` تلقائياً

**السبب:** بدون هذا الـ Trigger، أي مستخدم يسجل لا يحصل على صف في الجداول العامة وتفشل كل سياسات RLS

**الملف:** `supabase/migrations/002_fix_schema_and_rls.sql`

---

## [2025-10-07] حماية المفاتيح السرية

**القرار:** فصل صارم بين متغيرات الخادم والمتصفح

**القاعدة:**
- `NEXT_PUBLIC_*` = آمن للمتصفح (Supabase anon key، Moyasar publishable key، Cloudinary cloud name)
- بدون `NEXT_PUBLIC_` = خادم فقط (service role، OpenAI، Moyasar secret، Cloudinary secret)

**يُراجَع مع كل ميزة تتعامل مع دفع أو خدمة خارجية**

---

## الميزات المؤجلة (بقرار واعٍ)

| الميزة | السبب | شرط الفتح |
|--------|--------|-----------|
| OpenAI المساعد الذكي | ليست MVP | بعد وجود ١٠٠ مستخدم نشط |
| Moyasar الدفع | تحتاج موافقة تجارية | بعد التحقق من طلب حقيقي |
| Cloudinary الصور | تحتاج إعداد محدود | عند بناء صفحة المورد الكاملة |
| WhatsApp API | تكلفة تشغيل عالية | بعد وجود إيرادات |
