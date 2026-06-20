import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Download, ExternalLink, ShieldCheck, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import hostingImage from "@/assets/service-infra-hero.jpg";
import appImage from "@/assets/app-dev.jpg";

const formatPrice = (price?: number, currency = "EGP") =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency, maximumFractionDigits: 0 }).format(price || 0);

const ProductDetails = () => {
  const { slug } = useParams();
  const { data } = useData();
  const product = (data.products || []).find((item) => item.slug === slug || item.id === slug);
  const related = (data.products || []).filter((item) => item.isActive && item.id !== product?.id).slice(0, 3);
  const category = (data.productCategories || []).find((item) => item.id === product?.categoryId);

  if (!product) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Navbar />
        <main className="container-custom py-40 text-center">
          <h1 className="heading-lg">المنتج غير موجود</h1>
          <Button className="mt-6" asChild><Link to="/store">العودة للمتجر</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const visual = product.image || (product.type === "hosting" ? hostingImage : appImage);
  const finalPrice = product.salePrice || product.price;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-hero py-12 text-secondary-foreground">
          <div className="container-custom">
            <Link to="/store" className="mb-5 inline-flex items-center gap-2 text-sm text-secondary-foreground/70 hover:text-primary">
              <ArrowLeft size={16} />
              العودة للمتجر
            </Link>
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
              <div className="overflow-hidden rounded-lg border border-white/12 bg-white/5">
                <img src={visual} alt={product.title} className="aspect-[16/10] w-full object-cover" />
              </div>
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{category?.name || product.type}</span>
                  {product.badge && <span className="rounded-md bg-white/10 px-3 py-1 text-xs font-bold">{product.badge}</span>}
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">
                    <Star size={14} fill="currentColor" /> {product.rating}
                  </span>
                </div>
                <h1 className="font-heading text-4xl font-extrabold leading-tight lg:text-5xl">{product.title}</h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-secondary-foreground/72">{product.shortDescription}</p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <div>
                    {product.salePrice && <p className="text-sm text-secondary-foreground/45 line-through">{formatPrice(product.price, product.currency)}</p>}
                    <p className="font-heading text-4xl font-extrabold text-primary">{formatPrice(finalPrice, product.currency)}</p>
                  </div>
                  <Button size="xl" asChild><Link to={`/checkout/${product.id}`}>شراء الآن</Link></Button>
                  {product.demoUrl && (
                    <Button size="xl" variant="heroOutline" asChild>
                      <a href={product.demoUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /> معاينة</a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid gap-8 lg:grid-cols-[1fr_340px]">
            <article className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h2 className="font-heading text-2xl font-bold">تفاصيل المنتج</h2>
              <p className="mt-4 whitespace-pre-line leading-8 text-muted-foreground">{product.description}</p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 rounded-md bg-muted p-3">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </article>

            <aside className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-5 shadow-card">
                <h3 className="font-heading text-lg font-bold">التسليم والحماية</h3>
                <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <p className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" /> لا يظهر رابط التحميل إلا بعد اعتماد الطلب كمدفوع.</p>
                  <p className="flex gap-2"><Download className="h-4 w-4 shrink-0 text-primary" /> ملفات المنتجات الرقمية داخل مركز التحميل فقط.</p>
                  <p>زمن التسليم: <span className="font-bold text-foreground">{product.deliveryTime || "حسب نوع المنتج"}</span></p>
                </div>
                <Button className="mt-5 w-full" asChild><Link to={`/checkout/${product.id}`}>إتمام الطلب</Link></Button>
              </div>
              <div className="rounded-lg border border-border bg-muted p-5">
                <h3 className="font-bold">تحتاج مشروع مماثل؟</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">افتح تذكرة واكتب المطلوب وسنجهز لك عرض تنفيذ مخصص.</p>
                <Button className="mt-4 w-full" variant="outline" asChild><Link to="/support">فتح تذكرة</Link></Button>
              </div>
            </aside>
          </div>
        </section>

        {related.length > 0 && (
          <section className="section-padding bg-muted/50">
            <div className="container-custom">
              <h2 className="heading-md mb-6">منتجات مقترحة</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <Link key={item.id} to={`/product/${item.slug}`} className="rounded-lg border border-border bg-card p-4 shadow-card hover:border-primary/50">
                    <p className="font-bold">{item.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.shortDescription}</p>
                    <p className="mt-3 font-heading text-xl font-extrabold text-primary">{formatPrice(item.salePrice || item.price, item.currency)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetails;
