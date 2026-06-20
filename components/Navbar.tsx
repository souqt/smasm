import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Headphones, LogIn, Menu, Package, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useData } from "@/context/DataContext";
import { useMember } from "@/context/MemberContext";

const fallbackNavLinks = [
  { id: "home", name: "الرئيسية", href: "/", isActive: true },
  { id: "store", name: "المتجر", href: "/store", isActive: true },
  { id: "portfolio", name: "أعمالنا", href: "/portfolio", isActive: true },
  { id: "support", name: "الدعم", href: "/support", isActive: true },
  { id: "directory", name: "دليل المواقع", href: "/directory", isActive: true },
];

const Navbar = () => {
  const { data } = useData();
  const { member, isAuthenticated } = useMember();
  const [isOpen, setIsOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navLinks = (data.navLinks?.length ? data.navLinks : fallbackNavLinks).filter((link) => link.isActive);
  const featuredProducts = useMemo(
    () => (data.products || []).filter((product) => product.isActive).sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 6),
    [data.products]
  );
  const siteName = data.settings?.siteName || "تلجاوي";
  const whatsapp = data.settings?.whatsappNumber || data.contact?.socialLinks?.whatsapp || "";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setProductOpen(false);
  }, [location.pathname]);

  const renderLogo = () => (
    <Link to="/" className="flex items-center gap-3" aria-label={siteName}>
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-gradient-primary text-lg font-black text-primary-foreground shadow-soft">
        ت
      </div>
      <div className="leading-tight">
        <p className="font-heading text-xl font-extrabold text-foreground">{siteName}</p>
        <p className="text-[11px] font-medium text-muted-foreground">Hosting & Digital Store</p>
      </div>
    </Link>
  );

  const renderNavItem = (link: typeof fallbackNavLinks[number]) => (
    <Link
      key={link.id}
      to={link.href}
      className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
        location.pathname === link.href ? "bg-primary/10 text-primary" : "text-foreground/75 hover:bg-muted hover:text-foreground"
      }`}
    >
      {link.name}
    </Link>
  );

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-border bg-background/92 shadow-card backdrop-blur-xl" : "border-transparent bg-background/88 backdrop-blur"
      }`}
      dir="rtl"
    >
      <div className="container-custom">
        <div className="flex h-20 items-center justify-between gap-4">
          {renderLogo()}

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map(renderNavItem)}
            <div className="relative" onMouseEnter={() => setProductOpen(true)} onMouseLeave={() => setProductOpen(false)}>
              <button className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-foreground/75 transition-colors hover:bg-muted hover:text-foreground">
                المنتجات
                <ChevronDown size={15} />
              </button>
              <AnimatePresence>
                {productOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-border bg-card p-2 shadow-elevated"
                  >
                    {featuredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.slug}`}
                        className="flex items-start gap-3 rounded-md p-3 text-right transition-colors hover:bg-muted"
                      >
                        <span className="mt-1 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Package size={17} />
                        </span>
                        <span>
                          <span className="block text-sm font-bold text-foreground">{product.title}</span>
                          <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">{product.shortDescription}</span>
                        </span>
                      </Link>
                    ))}
                    <Link to="/store" className="mt-1 block rounded-md bg-secondary px-3 py-2 text-center text-sm font-semibold text-secondary-foreground">
                      عرض كل المنتجات
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            {whatsapp && (
              <Button variant="outline" asChild>
                <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                  واتساب
                </a>
              </Button>
            )}
            <Button variant="secondary" asChild>
              <Link to="/support">
                <Headphones size={16} />
                تذكرة دعم
              </Link>
            </Button>
            <Button asChild>
              <Link to={isAuthenticated ? "/account" : "/login"}>
                {isAuthenticated ? <User size={16} /> : <LogIn size={16} />}
                {isAuthenticated ? member?.fullName?.split(" ")[0] || "حسابي" : "دخول"}
              </Link>
            </Button>
          </div>

          <button className="rounded-md p-2 text-foreground lg:hidden" onClick={() => setIsOpen((value) => !value)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <div className="container-custom space-y-2 py-4">
              {navLinks.map((link) => (
                <Link key={link.id} to={link.href} className="block rounded-md px-3 py-3 text-sm font-semibold hover:bg-muted">
                  {link.name}
                </Link>
              ))}
              <Link to="/store" className="block rounded-md px-3 py-3 text-sm font-semibold hover:bg-muted">كل المنتجات</Link>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="secondary" asChild><Link to="/support">تذكرة دعم</Link></Button>
                <Button asChild><Link to={isAuthenticated ? "/account" : "/login"}>{isAuthenticated ? "حسابي" : "دخول"}</Link></Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
