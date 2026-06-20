import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, UserPlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMember } from "@/context/MemberContext";

const emptyRegister = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  company: "",
  country: "",
  city: "",
  address: "",
};

const MemberAuth = ({ mode = "login" }: { mode?: "login" | "register" }) => {
  const isRegister = mode === "register";
  const { login, register } = useMember();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState(emptyRegister);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof emptyRegister, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const ok = isRegister
        ? await register(form)
        : await login(form.email, form.password);
      if (!ok) {
        toast({ title: "تعذر الدخول", description: "راجع البيانات وحاول مرة أخرى.", variant: "destructive" });
        return;
      }
      toast({ title: isRegister ? "تم إنشاء العضوية" : "تم تسجيل الدخول" });
      navigate("/account");
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
            <p className="mb-2 text-sm font-bold text-primary">عضويات تلجاوي</p>
            <h1 className="heading-lg">{isRegister ? "إنشاء عضوية جديدة" : "تسجيل الدخول"}</h1>
            <p className="mt-3 text-secondary-foreground/70">حسابك يستخدم للشراء، متابعة التذاكر، والوصول لمركز التحميل.</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-start">
            <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="grid gap-4 sm:grid-cols-2">
                {isRegister && (
                  <>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold">الاسم بالكامل</label>
                      <Input value={form.fullName} onChange={(event) => update("fullName", event.target.value)} required className="text-right" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">رقم الهاتف</label>
                      <Input value={form.phone} onChange={(event) => update("phone", event.target.value)} required className="text-right" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">الشركة</label>
                      <Input value={form.company} onChange={(event) => update("company", event.target.value)} className="text-right" />
                    </div>
                  </>
                )}
                <div>
                  <label className="mb-2 block text-sm font-semibold">البريد الإلكتروني</label>
                  <Input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} required className="text-right" />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold">كلمة المرور</label>
                  <Input type="password" value={form.password} onChange={(event) => update("password", event.target.value)} required className="text-right" />
                </div>
                {isRegister && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">الدولة</label>
                      <Input value={form.country} onChange={(event) => update("country", event.target.value)} className="text-right" />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-semibold">المدينة</label>
                      <Input value={form.city} onChange={(event) => update("city", event.target.value)} className="text-right" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-semibold">العنوان</label>
                      <Input value={form.address} onChange={(event) => update("address", event.target.value)} className="text-right" />
                    </div>
                  </>
                )}
              </div>
              <Button size="lg" className="mt-6 w-full" disabled={loading}>
                {isRegister ? <UserPlus size={18} /> : <Lock size={18} />}
                {isRegister ? "إنشاء العضوية" : "دخول"}
              </Button>
              <p className="mt-5 text-center text-sm text-muted-foreground">
                {isRegister ? "لديك حساب بالفعل؟" : "ليس لديك حساب؟"}{" "}
                <Link className="font-bold text-primary" to={isRegister ? "/login" : "/register"}>
                  {isRegister ? "تسجيل الدخول" : "إنشاء عضوية"}
                </Link>
              </p>
            </form>

            <aside className="rounded-lg border border-border bg-muted p-6">
              <h2 className="font-heading text-xl font-bold">لماذا العضوية؟</h2>
              <ul className="mt-5 space-y-3 text-sm leading-7 text-muted-foreground">
                <li>مركز تحميل خاص بملفات المنتجات التي اشتريتها فقط.</li>
                <li>متابعة حالة الطلب والدفع من مكان واحد.</li>
                <li>فتح تذاكر دعم وربطها ببياناتك وطلباتك.</li>
                <li>استقبال تحديثات المنتج والملفات الجديدة بعد الاعتماد.</li>
              </ul>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MemberAuth;
