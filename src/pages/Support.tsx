import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Headphones, Send } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMember } from "@/context/MemberContext";
import { api } from "@/lib/api";

const Support = () => {
  const { member, token, isAuthenticated } = useMember();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: member?.fullName || "",
    email: member?.email || "",
    phone: member?.phone || "",
    subject: "",
    department: "technical",
    priority: "normal",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.createTicket(form, token || undefined);
      toast({ title: "تم فتح التذكرة", description: `رقم التذكرة ${response.ticketNumber || ""}` });
      if (isAuthenticated) navigate("/account");
      setForm((prev) => ({ ...prev, subject: "", message: "" }));
    } catch {
      toast({ title: "تعذر فتح التذكرة", variant: "destructive" });
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
            <p className="mb-2 text-sm font-bold text-primary">الدعم الفني</p>
            <h1 className="heading-lg">افتح تذكرة وسنراجع طلبك</h1>
            <p className="mt-3 max-w-2xl text-secondary-foreground/70">نظام دعم بديل للوظائف، مخصص لمتابعة مشاكل المنتجات والاستضافة وطلبات البرمجة.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid gap-8 lg:grid-cols-[1fr_360px]">
            <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary"><Headphones size={22} /></span>
                <div>
                  <h2 className="font-heading text-xl font-bold">بيانات التذكرة</h2>
                  <p className="text-sm text-muted-foreground">كلما كانت التفاصيل أوضح كان الحل أسرع.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">الاسم</label>
                  <Input value={form.fullName} onChange={(event) => update("fullName", event.target.value)} required className="text-right" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">البريد الإلكتروني</label>
                  <Input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required className="text-right" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">الهاتف</label>
                  <Input value={form.phone} onChange={(event) => update("phone", event.target.value)} className="text-right" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">القسم</label>
                  <select value={form.department} onChange={(event) => update("department", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="technical">دعم فني</option>
                    <option value="billing">الدفع والفواتير</option>
                    <option value="hosting">الاستضافة</option>
                    <option value="custom_project">مشروع مخصص</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">الأولوية</label>
                  <select value={form.priority} onChange={(event) => update("priority", event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    <option value="low">منخفضة</option>
                    <option value="normal">عادية</option>
                    <option value="high">عالية</option>
                    <option value="urgent">عاجلة</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">عنوان التذكرة</label>
                  <Input value={form.subject} onChange={(event) => update("subject", event.target.value)} required className="text-right" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">تفاصيل الطلب</label>
                  <Textarea value={form.message} onChange={(event) => update("message", event.target.value)} required className="min-h-40 text-right" />
                </div>
              </div>

              <Button size="lg" className="mt-6 w-full" disabled={loading}>
                <Send size={18} />
                فتح التذكرة
              </Button>
            </form>

            <aside className="space-y-4">
              <div className="rounded-lg border border-border bg-muted p-5">
                <h3 className="font-heading text-lg font-bold">حساب العميل أفضل للدعم</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">لو سجلت الدخول، سيتم ربط التذكرة بطلباتك ومنتجاتك تلقائياً.</p>
                {!isAuthenticated && <Button className="mt-4 w-full" asChild><Link to="/login">تسجيل الدخول</Link></Button>}
              </div>
              <div className="rounded-lg border border-border bg-card p-5 shadow-card">
                <h3 className="font-heading text-lg font-bold">طلبات المشاريع المماثلة</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">اختر قسم "مشروع مخصص" واكتب رابط العمل أو المنتج المطلوب تنفيذه بشكل مشابه.</p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
