import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useData } from "@/context/DataContext";
import appImage from "@/assets/app-dev.jpg";

const Directory = () => {
  const { data } = useData();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const sites = useMemo(() => {
    const clean = query.trim().toLowerCase();
    return (data.directorySites || [])
      .filter((site) => site.isActive)
      .filter((site) => category === "all" || site.category === category)
      .filter((site) => !clean || `${site.title} ${site.description} ${site.category}`.toLowerCase().includes(clean))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [data.directorySites, query, category]);

  const categories = Array.from(new Set((data.directorySites || []).map((site) => site.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Navbar />
      <main className="pt-24">
        <section className="bg-gradient-hero py-12 text-secondary-foreground">
          <div className="container-custom">
            <p className="mb-2 text-sm font-bold text-primary">دليل المواقع</p>
            <h1 className="heading-lg">مواقع ومنتجات منشورة</h1>
            <p className="mt-3 max-w-2xl text-secondary-foreground/70">صفحة مستقلة لعرض المواقع والمنتجات التي تم تنفيذها أو ربطها بمتجر تلجاوي.</p>
          </div>
        </section>

        <section className="border-b border-border bg-card py-5">
          <div className="container-custom grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث في الدليل..." className="pr-10 text-right" />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={category === "all" ? "default" : "outline"} onClick={() => setCategory("all")}>الكل</Button>
              {categories.map((item) => (
                <Button key={item} variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)}>{item}</Button>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sites.map((site) => (
              <article key={site.id} className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
                <img src={site.image || appImage} alt={site.title} className="aspect-[16/10] w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-bold text-primary">{site.category}</p>
                  <h2 className="mt-2 font-heading text-xl font-bold">{site.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{site.description}</p>
                  <Button className="mt-5 w-full" variant="secondary" asChild>
                    <a href={site.url} target="_blank" rel="noreferrer">
                      زيارة الموقع
                      <ExternalLink size={15} />
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Directory;
