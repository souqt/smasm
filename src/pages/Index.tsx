import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Cloud,
  Code2,
  CreditCard,
  Download,
  Headphones,
  Package,
  ShieldCheck,
  Star,
  Wallet,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlockRenderer from "@/components/BlockRenderer";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import heroImage from "@/assets/hero-ai.jpg";
import hostingImage from "@/assets/service-infra-hero.jpg";
import appImage from "@/assets/app-dev.jpg";

const formatPrice = (price?: number, currency = "EGP") =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency, maximumFractionDigits: 0 }).format(price || 0);

const ProductFallbackVisual = ({ type }: { type: string }) => {
  const Icon = type === "hosting" ? Cloud : type === "service" ? Code2 : Package;
  return (
    <div className="flex aspect-[16/10] items-center justify-center bg-gradient-dark text-secondary-foreground">
      <Icon className="h-16 w-16 text-primary" />
    </div>
  );
};

const Index = () => {
  const { data } = useData();
  const products = (data.products || []).filter((product) => product.isActive && product.isFeatured).slice(0, 6);
  const reviews = (data.reviews || []).filter((review) => review.isApproved && review.isFeatured).slice(0, 3);
  const works = (data.portfolioProjects || []).filter((project) => project.isFeatured).slice(0, 3);
  const homeBlocks = data.pageBlocks?.home || [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-hero pt-28 text-secondary-foreground">
          <div className="absolute inset-0 opacity-20">
            <img src={heroImage} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-secondary/82" />
          <div className="container-custom relative grid min-h-[calc(100vh-5rem)] gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                منصة عربية للمتاجر الرقمية والاستضافة
              </div>
              <h1 className="font-heading text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                تلجاوي لاستضافة المواقع وبيع المنتجات وبرمجة الويب
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-secondary-foreground/75 sm:text-lg">
                متجر احترافي بتحميل آمن بعد الشراء، دعم فني بالتذاكر، عضويات كاملة، وطرق دفع مباشرة تشمل InstaPay وVodafone Cash والتحويل البنكي وPayPal.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="xl" asChild>
                  <Link to="/store">
                    <Package size={18} />
                    تصفح المنتجات
                  </Link>
                </Button>
                <Button size="xl" variant="heroOutline" asChild>
                  <Link to="/support">
                    <Headphones size={18} />
                    افتح تذكرة دعم
                  </Link>
                </Button>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-secondary-foreground/70">
                {["حماية تنزيلات", "كوبونات خصم", "دعم بعد البيع", "مشاريع مماثلة"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2">
                    <BadgeCheck size={15} className="text-primary" />
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              {products.slice(0, 3).map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-lg border border-white/12 bg-white/10 p-4 text-right backdrop-blur transition-transform hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    {index === 0 ? <Cloud size={22} /> : index === 1 ? <Download size={22} /> : <Code2 size={22} />}
                  </div>
                  <div>
                    <p className="font-bold">{product.title}</p>
                    <p className="line-clamp-1 text-sm text-secondary-foreground/65">{product.shortDescription}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-heading text-lg font-extrabold">{formatPrice(product.salePrice || product.price, product.currency)}</p>
                    <p className="text-xs text-secondary-foreground/55">{product.deliveryTime || "تسليم سريع"}</p>
                  </div>
                </Link>
              ))}
              <Link to="/store" className="block rounded-lg border border-white/12 bg-white/5 p-4 text-center font-semibold hover:bg-white/10">
                عرض كل منتجات المتجر
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="border-b border-border bg-card py-4">
          <div className="container-custom flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2"><Wallet size={16} /> InstaPay</span>
            <span className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2"><CreditCard size={16} /> Vodafone Cash</span>
            <span className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2"><Banknote size={16} /> تحويل بنكي</span>
            <span className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2"><ShieldCheck size={16} /> PayPal</span>
          </div>
        </section>

        <section className="section-padding" id="products">
          <div className="container-custom">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-sm font-bold text-primary">منتجات المتجر</p>
                <h2 className="heading-lg">منتجات وخدمات جاهزة للتنفيذ</h2>
              </div>
              <Button variant="outline" asChild>
                <Link to="/store">
                  كل المنتجات
                  <ArrowLeft size={16} />
                </Link>
              </Button>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product, index) => (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="overflow-hidden rounded-lg border border-border bg-card shadow-card transition-transform hover:-translate-y-1"
                >
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="aspect-[16/10] w-full object-cover" />
                  ) : (
                    <ProductFallbackVisual type={product.type} />
                  )}
                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{product.badge || product.type}</span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-500"><Star size={15} fill="currentColor" /> {product.rating}</span>
                    </div>
                    <h3 className="font-heading text-xl font-bold">{product.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
                    <div className="mt-5 flex items-center justify-between gap-3">
                      <p className="font-heading text-2xl font-extrabold text-primary">{formatPrice(product.salePrice || product.price, product.currency)}</p>
                      <Button asChild>
                        <Link to={`/product/${product.slug}`}>التفاصيل</Link>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-muted/50">
          <div className="container-custom grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
              <img src={hostingImage} alt="Managed hosting" className="h-full min-h-[340px] w-full object-cover" />
            </div>
            <div>
              <p className="mb-2 text-sm font-bold text-primary">استضافة وبرمجة</p>
              <h2 className="heading-lg">نظام كامل من أول الطلب إلى التسليم</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  ["عضويات كاملة", "تسجيل دخول وبيانات عميل ومركز تحميل."],
                  ["تذاكر دعم", "أقسام وأولويات ومتابعة بعد البيع."],
                  ["دفع مباشر", "تعليمات دفع وإثبات تحويل ومراجعة إدارية."],
                  ["حماية الملفات", "تحميل من endpoint يتحقق من الشراء المدفوع."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-lg border border-border bg-card p-4">
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 text-sm font-bold text-primary">أعمالنا</p>
                <h2 className="heading-lg">مشاريع تم تنفيذها ويمكن طلب مماثل</h2>
              </div>
              <Button variant="outline" asChild><Link to="/portfolio">كل الأعمال</Link></Button>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {works.map((work, index) => (
                <article key={work.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
                  <img src={work.image || (index % 2 ? appImage : hostingImage)} alt={work.title} className="aspect-[16/10] w-full object-cover" />
                  <div className="p-5">
                    <p className="text-xs font-bold text-primary">{work.category}</p>
                    <h3 className="mt-2 font-heading text-lg font-bold">{work.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{work.description}</p>
                    <Button className="mt-4 w-full" variant="secondary" asChild>
                      <Link to={work.relatedProductId ? `/checkout/${work.relatedProductId}` : "/support"}>عمل مشروع مماثل</Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-secondary text-secondary-foreground">
          <div className="container-custom">
            <div className="mb-10 text-center">
              <p className="mb-2 text-sm font-bold text-primary">تقييمات العملاء</p>
              <h2 className="heading-lg">ثقة تظهر قبل قرار الشراء</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <div className="mb-4 flex gap-1 text-amber-400">
                    {Array.from({ length: Math.round(review.rating) }).map((_, index) => <Star key={index} size={16} fill="currentColor" />)}
                  </div>
                  <p className="leading-7 text-secondary-foreground/80">{review.comment}</p>
                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="font-bold">{review.customerName}</p>
                    <p className="text-sm text-secondary-foreground/55">{review.customerTitle}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {homeBlocks.length > 0 && <BlockRenderer blocks={homeBlocks} />}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
