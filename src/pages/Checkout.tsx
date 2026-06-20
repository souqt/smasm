import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Lock, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/context/DataContext";
import { useMember } from "@/context/MemberContext";
import { api, uploadFile } from "@/lib/api";

const formatPrice = (price?: number, currency = "EGP") =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency, maximumFractionDigits: 0 }).format(price || 0);

const Checkout = () => {
  const { productId } = useParams();
  const { data } = useData();
  const { token, isAuthenticated, member } = useMember();
  const { toast } = useToast();
  const navigate = useNavigate();
  const product = (data.products || []).find((item) => item.id === productId || item.slug === productId);
  const paymentMethods = (data.paymentMethods || []).filter((method) => method.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]?.key || "instapay");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentReference, setPaymentReference] = useState("");
  const [notes, setNotes] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedPayment = useMemo(
    () => paymentMethods.find((method) => method.key === paymentMethod) || paymentMethods[0],
    [paymentMethods, paymentMethod]
  );

  if (!product) {
    return (
      <div className="min-h-screen" dir="rtl">
        <Navbar />
        <main className="container-custom py-40 text-center">
          <h1 className="heading-lg">المنتج غير موجود</h1>
          <Button className="mt-6" asChild><Link to="/store">العودة للمتجر</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = product.salePrice || product.price;
  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const response = await api.applyCoupon(coupon, [product.id]);
      setDiscount(Number(response.discount || 0));
      toast({ title: "تم تطبيق الكوبون", description: `قيمة الخصم ${formatPrice(response.discount || 0, product.currency)}` });
    } catch (error) {
      setDiscount(0);
      toast({ title: "الكوبون غير صالح", description: "راجع الكود أو شروط الحد الأدنى.", variant: "destructive" });
    }
  };

  const handleProofUpload = async (file?: File) => {
    if (!file) return;
    try {
      const response = await uploadFile(file, "payment-proofs");
      setProofUrl(response.url);
      toast({ title: "تم رفع إثبات الدفع" });
    } catch {
      toast({ title: "تعذر رفع الملف", variant: "destructive" });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await api.createOrder(token, {
        items: [{ productId: product.id, quantity: 1 }],
        paymentMethod,
        paymentReference,
        paymentProof: proofUrl,
        couponCode: coupon,
        notes,
      });
      toast({ title: "تم إنشاء الطلب", description: "سيظهر المنتج في مركز التحميل بعد اعتماد الدفع." });
      navigate(`/account?order=${response.orderNumber || ""}`);
    } catch (error) {
      toast({ title: "تعذر إنشاء الطلب", description: "راجع بيانات الدفع وحاول مرة أخرى.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-hero py-12 text-secondary-foreground">
          <div className="container-custom">
            <p className="mb-2 text-sm font-bold text-primary">إتمام الشراء</p>
            <h1 className="heading-lg">{product.title}</h1>
            <p className="mt-3 text-secondary-foreground/70">سجل الدخول، اختر طريقة الدفع، ثم أرسل بيانات التحويل للمراجعة.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid gap-8 lg:grid-cols-[1fr_380px]">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-card">
              {!isAuthenticated && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                  يجب تسجيل الدخول أو إنشاء عضوية قبل إتمام الطلب.
                  <Button className="mt-3" asChild><Link to="/login">تسجيل الدخول</Link></Button>
                </div>
              )}

              {isAuthenticated && (
                <div className="rounded-lg bg-muted p-4 text-sm">
                  الطلب باسم: <span className="font-bold">{member?.fullName}</span> - {member?.email}
                </div>
              )}

              <div>
                <h2 className="mb-3 font-heading text-xl font-bold">طريقة الدفع</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.key)}
                      className={`rounded-lg border p-4 text-right transition-colors ${
                        paymentMethod === method.key ? "border-primary bg-primary/10" : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="font-bold">{method.name}</span>
                      {method.accountLabel && <span className="mt-1 block text-xs text-muted-foreground">{method.accountLabel}</span>}
                    </button>
                  ))}
                </div>
                {selectedPayment && (
                  <div className="mt-4 rounded-lg bg-muted p-4 text-sm leading-7 text-muted-foreground">
                    <p className="font-bold text-foreground">{selectedPayment.accountLabel}</p>
                    <p>{selectedPayment.instructions}</p>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">رقم العملية / Transaction ID</label>
                  <Input value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} className="text-right" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">إثبات الدفع</label>
                  <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background text-sm hover:bg-muted">
                    <Upload size={16} />
                    {proofUrl ? "تم الرفع" : "رفع صورة"}
                    <input type="file" className="hidden" accept="image/*,.pdf" onChange={(event) => handleProofUpload(event.target.files?.[0])} />
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">ملاحظات الطلب</label>
                <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-28 text-right" />
              </div>

              <Button size="lg" className="w-full" disabled={loading || !isAuthenticated}>
                <CheckCircle2 size={18} />
                تأكيد الطلب
              </Button>
            </form>

            <aside className="h-fit rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-xl font-bold">ملخص الطلب</h2>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex justify-between gap-4"><span>{product.title}</span><span>{formatPrice(subtotal, product.currency)}</span></div>
                <div className="flex gap-2">
                  <Input value={coupon} onChange={(event) => setCoupon(event.target.value.toUpperCase())} placeholder="كود الخصم" className="text-right" />
                  <Button type="button" variant="outline" onClick={handleApplyCoupon}>تطبيق</Button>
                </div>
                {discount > 0 && <div className="flex justify-between text-primary"><span>الخصم</span><span>- {formatPrice(discount, product.currency)}</span></div>}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-lg font-bold"><span>الإجمالي</span><span>{formatPrice(total, product.currency)}</span></div>
                </div>
              </div>
              <div className="mt-5 rounded-lg bg-muted p-4 text-sm leading-7 text-muted-foreground">
                <Lock className="mb-2 h-5 w-5 text-primary" />
                ملف المنتج لن يكون متاحاً للتحميل إلا بعد اعتماد الدفع وربطه بحسابك من الخادم.
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
