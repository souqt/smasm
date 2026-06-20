# تعليمات رفع تلجاوي

## 1. ملفات GitHub / الواجهة

ارفع ملفات المشروع إلى Repository على GitHub.

من إعدادات المستودع:

1. افتح `Settings > Pages`.
2. اختر `GitHub Actions` كمصدر النشر.
3. افتح `Settings > Secrets and variables > Actions > Variables`.
4. أضف:
   - `VITE_API_BASE_URL` = رابط الاستضافة التي تحتوي ملفات PHP، مثال: `https://api.example.com`
   - `VITE_BASE_PATH` = `/` لو الموقع على دومين مستقل، أو `/repo-name/` لو GitHub Pages على مسار مستودع.

بعد أول push على فرع `main` سيعمل workflow داخل `.github/workflows/deploy.yml` ويبني ملفات `dist` تلقائياً.

## 2. ملفات الاستضافة / PHP API

ارفع مجلد `public/api` إلى الاستضافة بحيث يصبح متاحاً بهذا الشكل:

```text
https://api.example.com/api/index.php
https://api.example.com/api/install.php
```

داخل `public/api/db.php` عدل بيانات قاعدة البيانات:

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'database_name');
define('DB_USER', 'database_user');
define('DB_PASS', 'database_password');
```

بعد الرفع افتح مرة واحدة:

```text
https://api.example.com/api/install.php
```

سيتم إنشاء جداول تلجاوي: المنتجات، الطلبات، العضويات، التذاكر، الكوبونات، طرق الدفع، التقييمات، الأعمال، دليل المواقع، والشات بوت.

## 3. لوحة الإدارة

الرابط:

```text
/admin/login
```

بيانات الأدمن الافتراضية كما في السكربت الأصلي:

```text
Username: AMMAR
Password: @ALIIOIIL81031
```

بعد الدخول غيّر كلمة المرور من لوحة الإدارة.

## 4. حماية تحميل الملفات

ملفات المنتجات المدفوعة ترفع من لوحة الإدارة كـ `product-files`.

هذه الملفات تحفظ في:

```text
public/api/private/products
```

ولا يتم إرجاع رابط مباشر لها. التحميل يتم فقط عبر:

```text
api/index.php?action=download&id=PRODUCT_ID&token=MEMBER_TOKEN
```

والـ PHP يتحقق من وجود طلب `paid` للعضو قبل إرسال الملف.

## 5. طرق الدفع

من لوحة الإدارة افتح `Store > Payments` وأضف أو عدل:

- InstaPay
- Vodafone Cash
- Bank Transfer
- PayPal

العميل ينشئ الطلب ويرفع إثبات الدفع، والأدمن يحول الطلب إلى `Paid`. بعدها تظهر الملفات داخل مركز التحميل.

## 6. الشات بوت

من `Store > Chatbot` أضف سؤالاً وكلمات مفتاحية وأكثر من إجابة، وسينوع الشات بوت الردود.

لو تريد ربط AI خارجي، ضع رابط webhook في:

```text
Admin > Settings > AI Chat Webhook URL
```

الـ webhook يستقبل:

```json
{ "message": "نص السؤال" }
```

ويرجع:

```json
{ "answer": "نص الإجابة" }
```
