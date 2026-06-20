import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Cloud, Code2, Filter, Package, Search, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/context/DataContext";

const formatPrice = (price?: number, currency = "EGP") =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency, maximumFractionDigits: 0 }).format(price || 0);

const ProductIcon = ({ type }: { type: string }) => {
  const Icon = type === "hosting" ? Cloud : type === "service" ? Code2 : Package;
  return <Icon className="h-12 w-12 text-primary" />;
};

const Store = () => {
  const { data } = useData();
  const [params] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(params.get("type") || "all");

  const categories = data.productCategories || [];
  const products = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    return (data.products || [])
      .filter((product) => product.isActive)
      .filter((product) => category === "all" || product.type === category || product.categoryId === category)
      .filter((product) => !cleanQuery || `${product.title} ${product.shortDescription}`.toLowerCase().includes(cleanQuery))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [data.products, category, query]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-hero py-14 text-secondary-foreground">
          <div className="container-custom">
            <p className="mb-3 text-sm font-bold text-primary">متجر تلجاوي</p>
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h1 className="heading-xl">منتجات رقمية وخدمات جاهزة للشراء</h1>
                <p className="mt-4 max-w-2xl text-secondary-foreground/70">اختر المنتج، ادفع بالطريقة المناسبة، وبعد اعتماد الدفع تظهر الملفات في مركز التحميل الخاص بحسابك.</p>
              </div>
              <Button size="lg" variant="heroOutline" asChild><Link to="/support">طلب منتج مخصص</Link></Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-card py-5">
          <div className="container-custom grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث باسم المنتج..." className="pr-10 text-right" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={category === "all" ? "default" : "outline"} onClick={() => setCategory("all")}><Filter size={15} /> الكل</Button>
              {["hosting", "digital", "service", "package"].map((type) => (
                <Button key={type} variant={category === type ? "default" : "outline"} onClick={() => setCategory(type)}>
                  {type === "hosting" ? "استضافة" : type === "digital" ? "رقمي" : type === "service" ? "برمجة" : "باكدج"}
                </Button>
              ))}
              {categories.map((item) => (
                <Button key={item.id} variant={category === item.id ? "default" : "outline"} onClick={() => setCategory(item.id)}>
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-card transition-transform hover:-translate-y-1">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="aspect-[16/10] w-full object-cover" />
                  ) : (
                    <div className="flex aspect-[16/10] items-center justify-center bg-muted">
                      <ProductIcon type={product.type} />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{product.badge || "منتج"}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500"><Star size={15} fill="currentColor" /> {product.rating}</span>
                    </div>
                    <h2 className="font-heading text-xl font-bold">{product.title}</h2>
                    <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div>
                        {product.salePrice && <p className="text-xs text-muted-foreground line-through">{formatPrice(product.price, product.currency)}</p>}
                        <p className="font-heading text-2xl font-extrabold text-primary">{formatPrice(product.salePrice || product.price, product.currency)}</p>
                      </div>
                      <Button asChild><Link to={`/product/${product.slug}`}>عرض المنتج</Link></Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {products.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">لا توجد منتجات مطابقة حالياً.</div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Store;
