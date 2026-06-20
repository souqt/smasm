import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { useData } from "@/context/DataContext";

const Footer = () => {
  const { data } = useData();
  const siteName = data.settings?.siteName || "تلجاوي";
  const contact = data.contact || { address: "", phone: "", email: "", socialLinks: {} };
  const products = (data.products || []).filter((product) => product.isActive).slice(0, 4);

  const socials = [
    { url: contact.socialLinks?.facebook, icon: Facebook, label: "Facebook" },
    { url: contact.socialLinks?.instagram, icon: Instagram, label: "Instagram" },
    { url: contact.socialLinks?.youtube, icon: Youtube, label: "YouTube" },
  ].filter((item) => item.url);

  return (
    <footer className="bg-secondary text-secondary-foreground" dir="rtl">
      <div className="container-custom section-padding">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="mb-5 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gradient-primary text-xl font-black text-primary-foreground">ت</span>
              <span>
                <span className="block font-heading text-2xl font-extrabold">{siteName}</span>
                <span className="text-xs text-secondary-foreground/55">Hosting & Digital Store</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-secondary-foreground/65">
              {data.settings?.description || "استضافة ومنتجات رقمية وبرمجة ويب مع دعم فني وتحميل آمن بعد الشراء."}
            </p>
            {socials.length > 0 && (
              <div className="mt-5 flex gap-2">
                {socials.map((item) => (
                  <a key={item.label} href={item.url} target="_blank" rel="noreferrer" className="rounded-md bg-white/10 p-2 hover:bg-primary">
                    <item.icon size={18} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-5 font-heading text-lg font-bold">روابط سريعة</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/65">
              {[
                ["المتجر", "/store"],
                ["أعمالنا", "/portfolio"],
                ["الدعم الفني", "/support"],
                ["مركز التحميل", "/downloads"],
                ["دليل المواقع", "/directory"],
              ].map(([label, href]) => (
                <li key={href}><Link className="hover:text-primary" to={href}>{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-lg font-bold">منتجات بارزة</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/65">
              {products.map((product) => (
                <li key={product.id}><Link className="hover:text-primary" to={`/product/${product.slug}`}>{product.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-5 font-heading text-lg font-bold">تواصل معنا</h3>
            <ul className="space-y-4 text-sm text-secondary-foreground/65">
              {contact.address && <li className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0 text-primary" />{contact.address}</li>}
              {contact.phone && <li className="flex gap-3"><Phone size={18} className="shrink-0 text-primary" /><a href={`tel:${contact.phone}`}>{contact.phone}</a></li>}
              {contact.email && <li className="flex gap-3"><Mail size={18} className="shrink-0 text-primary" /><a href={`mailto:${contact.email}`}>{contact.email}</a></li>}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-secondary-foreground/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {siteName}. جميع الحقوق محفوظة.</p>
          <div className="flex gap-5">
            <Link to="/page/privacy">سياسة الخصوصية</Link>
            <Link to="/page/terms">شروط الاستخدام</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
